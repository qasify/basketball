import { db } from "@/utils/config/firebase";
import { Player } from "./basketball-api";
import type { ScoutingReport } from "./scouting-report-api";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { logActivity } from "./activity-api";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

const auth = getAuth();

export const usersDB = {
  getRole: async (uid: string): Promise<"admin" | "user"> => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      return querySnapshot.docs[0].data().role || "user";
    }
    return "user";
  },
  getProfile: async (uid: string) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      return querySnapshot.docs[0].data() as {
        uid: string;
        email: string;
        role: "admin" | "user";
        displayName?: string;
        createdAt?: string;
      };
    }
    return null;
  },
  updateDisplayName: async (uid: string, displayName: string) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      const docRef = doc(db, "users", querySnapshot.docs[0].id);
      await updateDoc(docRef, { displayName });
    }
    // Also update Firebase Auth profile
    const currentUser = auth.currentUser;
    if (currentUser) {
      const { updateProfile } = await import("firebase/auth");
      await updateProfile(currentUser, { displayName });
    }
  },
  createUser: async (uid: string, email: string) => {
    await addDoc(collection(db, "users"), {
      uid,
      email,
      role: "user",
      createdAt: new Date().toISOString(),
    });
  }
};

export const authDB = {
  register: async (email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await usersDB.createUser(credential.user.uid, email);
  },

  login: async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  logout: async () => {
    await signOut(auth);
  },

  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },
};

const WATCHLIST_COLLECTION = "watchlist";
const TEAM_ROSTER_COLLECTION = "team";
const NOTE_COLLECTION = "note";
const LEAGUE_PLAYER_PROFILE_COLLECTION = "league-player-profile";
const SCOUTING_REPORT_COLLECTION = "scouting-report";

export interface Note {
  id: number;
  note: string;
  user: string;
  /** ISO timestamp — updated whenever the note is saved */
  dateTime: string;
  /** Denormalized for lists (e.g. latest notes) */
  playerName?: string;
  /** Set when loaded from `notesDB.get` — Firestore doc id for `notesDB.remove` */
  firestoreId?: string;
}

export type LatestNoteItem = {
  firestoreId: string;
  playerId: number;
  note: string;
  playerName: string;
  dateTime: string;
};

/** Upper bound when listing all of a user’s notes (full `/dashboard/notes` page). Pass to `getLatestForUser`. */
export const NOTES_USER_LIST_MAX = 200;

export interface FBPlayer extends Player {
  documentId: string;
  notes?: Note[];
}

export interface ScoutingReportRecord {
  id?: string; // Firestore document id
  playerId: number;
  report: ScoutingReport;
  updatedAt: string; // ISO timestamp
  /** User-added notes or additional information for the scouting report */
  userNotes?: Record<string, string>;
}

export const watchListDB = {
  add: async (player: Player) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;

    const q = query(
      collection(db, WATCHLIST_COLLECTION),
      where("id", "==", player.id),
      where("userEmail", "==", userEmail)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isInTeam, isInWatchlist, ...otherData } = player;
      await addDoc(collection(db, WATCHLIST_COLLECTION), {
        ...otherData,
        userEmail,
      });
      void logActivity({
        actionType: "WATCHLIST_ADDED",
        playerId: player.id,
        playerName: player.name,
      }).catch(() => {});
    }
  },
  getAll: async () => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return [];

    const q = query(
      collection(db, WATCHLIST_COLLECTION),
      where("userEmail", "==", userEmail)
    );
    const querySnapshot = await getDocs(q);
    
    const players = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const notes = await notesDB.get(data.id);
        return {
          documentId: doc.id,
          ...data,
          notes,
        } as FBPlayer;
      })
    );

    return players;
  },
  remove: async (documentId: string) => {
    const docRef = doc(db, WATCHLIST_COLLECTION, documentId);
    const snap = await getDoc(docRef);
    const data = snap.data() as { id?: number; name?: string } | undefined;
    await deleteDoc(docRef);
    if (data?.id != null) {
      void logActivity({
        actionType: "WATCHLIST_REMOVED",
        playerId: data.id,
        playerName: typeof data.name === "string" ? data.name : undefined,
      }).catch(() => {});
    }
  },
  update: async (player: FBPlayer) => {
    const docRef = doc(db, WATCHLIST_COLLECTION, player.documentId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isInTeam, isInWatchlist, documentId, ...otherData } = player;
    await updateDoc(docRef, {
      ...otherData,
    });
  },
};

export const scoutingReportDB = {
  get: async (
    playerId: number
  ): Promise<ScoutingReportRecord | null> => {
    const q = query(
      collection(db, SCOUTING_REPORT_COLLECTION),
      where("playerId", "==", playerId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) {
      return null;
    }
    const docSnapshot = querySnapshot.docs[0];
    return {
      id: docSnapshot.id,
      ...(docSnapshot.data() as Omit<ScoutingReportRecord, "id">),
    };
  },
  save: async (playerId: number, report: ScoutingReport) => {
    const now = new Date().toISOString();
    const q = query(
      collection(db, SCOUTING_REPORT_COLLECTION),
      where("playerId", "==", playerId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
      await addDoc(collection(db, SCOUTING_REPORT_COLLECTION), {
        playerId,
        report,
        updatedAt: now,
      } satisfies Omit<ScoutingReportRecord, "id">);
    } else {
      const docRef = doc(db, SCOUTING_REPORT_COLLECTION, querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        report,
        updatedAt: now,
      });
    }
  },
  /** Update only user-added notes (and last updated). Report must already exist. */
  updateNotes: async (playerId: number, userNotes: string) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;
    const now = new Date().toISOString();
    const q = query(
      collection(db, SCOUTING_REPORT_COLLECTION),
      where("playerId", "==", playerId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) return;
    const docRef = doc(db, SCOUTING_REPORT_COLLECTION, querySnapshot.docs[0].id);
    // User dot notation to update the map field for the specific user
    await updateDoc(docRef, { [`userNotes.${userEmail.replace(/\./g, '_')}`]: userNotes, updatedAt: now });
  },
};

export const teamRosterDB = {
  add: async (player: Player) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;

    const q = query(
      collection(db, TEAM_ROSTER_COLLECTION),
      where("id", "==", player.id),
      where("userEmail", "==", userEmail)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isInTeam, isInWatchlist, ...otherData } = player;
      await addDoc(collection(db, TEAM_ROSTER_COLLECTION), { ...otherData, userEmail });
    }
  },
  getAll: async () => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return [];

    const q = query(
      collection(db, TEAM_ROSTER_COLLECTION),
      where("userEmail", "==", userEmail)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          documentId: doc.id,
          ...doc.data(),
        } as FBPlayer)
    );
  },
  remove: async (documentId: string) => {
    const docRef = doc(db, TEAM_ROSTER_COLLECTION, documentId);
    await deleteDoc(docRef);
  },
  update: async (player: FBPlayer) => {
    const docRef = doc(db, TEAM_ROSTER_COLLECTION, player.documentId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isInTeam, isInWatchlist, documentId, ...otherData } = player;
    await updateDoc(docRef, {
      ...otherData,
    });
  },
};

export const notesDB = {
  /** @param playerName optional — used for activity feed */
  add: async (playerId: number, note: string, playerName?: string) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;
    const q = query(
      collection(db, NOTE_COLLECTION),
      where("id", "==", playerId)
    );
    const querySnapshot = await getDocs(q);
    const existingDoc = querySnapshot.docs.find(doc => doc.data().user === userEmail);

    const now = new Date().toISOString();
    const name = playerName?.trim() || "";
    if (!existingDoc) {
      await addDoc(collection(db, NOTE_COLLECTION), {
        id: playerId,
        note,
        user: userEmail,
        dateTime: now,
        ...(name ? { playerName: name } : {}),
      });
    } else {
      const docRef = doc(db, NOTE_COLLECTION, existingDoc.id);
      await updateDoc(docRef, {
        note,
        dateTime: now,
        ...(name ? { playerName: name } : {}),
      });
    }
    void logActivity({
      actionType: "NOTE_SAVED",
      playerId,
      playerName,
      description: "Saved a note",
    }).catch(() => {});
  },
  get: async (playerId: number) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return undefined;

    const q = query(
      collection(db, NOTE_COLLECTION),
      where("id", "==", playerId)
    );
    const querySnapshot = await getDocs(q);
    
    const userNotes = querySnapshot.docs
      .map((d) => ({ ...(d.data() as Note), firestoreId: d.id }))
      .filter((note) => note.user === userEmail);

    if (userNotes.length > 0) {
      return userNotes;
    } else {
      return undefined;
    }
  },
  /** Recent notes for the signed-in user, newest first. Preview: default `6`; full list: {@link NOTES_USER_LIST_MAX}. */
  getLatestForUser: async (limit = 6): Promise<LatestNoteItem[]> => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return [];
    const q = query(
      collection(db, NOTE_COLLECTION),
      where("user", "==", userEmail)
    );
    const querySnapshot = await getDocs(q);
    const rows: LatestNoteItem[] = querySnapshot.docs.map((d) => {
      const data = d.data() as Partial<Note> & { note?: string };
      const playerId = typeof data.id === "number" ? data.id : Number(data.id);
      return {
        firestoreId: d.id,
        playerId: Number.isFinite(playerId) ? playerId : 0,
        note: String(data.note ?? ""),
        playerName: String(data.playerName ?? "").trim(),
        dateTime: String(data.dateTime ?? "").trim(),
      };
    });
    const parsed = (s: string) => {
      const t = Date.parse(s);
      return Number.isNaN(t) ? null : t;
    };
    rows.sort((a, b) => {
      const ta = parsed(a.dateTime);
      const tb = parsed(b.dateTime);
      if (ta == null && tb == null) return 0;
      if (ta == null) return 1;
      if (tb == null) return -1;
      return tb - ta;
    });
    return rows.slice(0, limit);
  },
  /** Delete a note document; only allowed if it belongs to the signed-in user. */
  remove: async (firestoreId: string) => {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;
    const docRef = doc(db, NOTE_COLLECTION, firestoreId);
    const snap = await getDoc(docRef);
    if (!snap.exists) return;
    const data = snap.data();
    if (!data || data.user !== userEmail) return;
    await deleteDoc(docRef);
  },
};

export const leaguePlayerProfileDB = {
  add: async (player: Player) => {
    const q = query(
      collection(db, LEAGUE_PLAYER_PROFILE_COLLECTION),
      where("id", "==", player.id)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isInTeam, isInWatchlist, ...otherData } = player;
      await addDoc(collection(db, LEAGUE_PLAYER_PROFILE_COLLECTION), otherData);
    }
  },
  get: async (
    sportsRadarLeagueId: string,
    sportsRadarLeagueSeason: string,
    sportsRadarTeamId: string
  ) => {
    const Id = `${sportsRadarLeagueId}-${sportsRadarLeagueSeason}-${sportsRadarTeamId}`;
    const q = query(
      collection(db, LEAGUE_PLAYER_PROFILE_COLLECTION),
      where("id", "==", Id)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  },
  remove: async (documentId: string) => {
    const docRef = doc(db, LEAGUE_PLAYER_PROFILE_COLLECTION, documentId);
    await deleteDoc(docRef);
  },
};
