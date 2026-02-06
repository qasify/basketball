import { db } from "@/utils/config/firebase";
import { Player } from "./basketball-api";
import type { ScoutingReport } from "./scouting-report-api";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

const auth = getAuth();

export const authDB = {
  register: async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
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
  note: string;
  user: string;
  dateTime: string;
}

export interface FBPlayer extends Player {
  documentId: string;
  notes?: Note[];
}

export interface ScoutingReportRecord {
  id?: string; // Firestore document id
  playerId: number;
  report: ScoutingReport;
  updatedAt: string; // ISO timestamp
}

export const watchListDB = {
  add: async (player: Player) => {
    const q = query(
      collection(db, WATCHLIST_COLLECTION),
      where("id", "==", player.id)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isInTeam, isInWatchlist, ...otherData } = player;
      await addDoc(collection(db, WATCHLIST_COLLECTION), otherData);
    }
  },
  getAll: async () => {
    const querySnapshot = await getDocs(collection(db, WATCHLIST_COLLECTION));
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
    await deleteDoc(docRef);
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
};

export const teamRosterDB = {
  add: async (player: Player) => {
    const q = query(
      collection(db, TEAM_ROSTER_COLLECTION),
      where("id", "==", player.id)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isInTeam, isInWatchlist, ...otherData } = player;
      await addDoc(collection(db, TEAM_ROSTER_COLLECTION), otherData);
    }
  },
  getAll: async () => {
    const querySnapshot = await getDocs(collection(db, TEAM_ROSTER_COLLECTION));
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
  add: async (playerId: number, note: string) => {
    const q = query(
      collection(db, NOTE_COLLECTION),
      where("id", "==", playerId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 0) {
      await addDoc(collection(db, NOTE_COLLECTION), {
        id: playerId,
        note,
        user: auth.currentUser?.email,
      });
    } else {
      const docRef = doc(db, NOTE_COLLECTION, querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        note,
      });
    }
  },
  get: async (playerId: number) => {
    const q = query(
      collection(db, NOTE_COLLECTION),
      where("id", "==", playerId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      return querySnapshot.docs.map((doc) => {
        return doc.data() as Note;
      });
    } else {
      return undefined;
    }
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
