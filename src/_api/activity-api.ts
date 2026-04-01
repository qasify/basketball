/**
 * Global org activity feed — Firestore collection `activities`.
 * Trust: client writes after real actions + rules enforce actorUid == auth.uid.
 */
import { db } from "@/utils/config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { Activity, ActivityActionType } from "@/app/activity-feed/_types/Activity";

const ACTIVITIES_COLLECTION = "activities";

const VALID_ACTIONS: ActivityActionType[] = [
  "WATCHLIST_ADDED",
  "WATCHLIST_REMOVED",
  "NOTE_SAVED",
  "SCOUTING_REPORT_GENERATED",
  "SCOUTING_REPORT_UPDATED",
  "SCOUTING_REPORT_NOTES_SAVED",
];

export type LogActivityInput = {
  actionType: ActivityActionType;
  playerId?: number;
  playerName?: string;
  description?: string;
  userDisplayName?: string;
};

function isValidActionType(v: unknown): v is ActivityActionType {
  return typeof v === "string" && VALID_ACTIONS.includes(v as ActivityActionType);
}

function timestampToIso(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as Timestamp).toDate().toISOString();
  }
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

export function firestoreDocToActivity(
  docId: string,
  data: Record<string, unknown>
): Activity | null {
  const actionType = data.actionType;
  if (!isValidActionType(actionType)) return null;

  return {
    id: docId,
    createdAt: timestampToIso(data.createdAt),
    userEmail: typeof data.userEmail === "string" ? data.userEmail : null,
    userDisplayName:
      typeof data.userDisplayName === "string"
        ? data.userDisplayName
        : undefined,
    actionType,
    playerId: typeof data.playerId === "number" ? data.playerId : undefined,
    playerName:
      typeof data.playerName === "string" ? data.playerName : undefined,
    description:
      typeof data.description === "string" ? data.description : undefined,
  };
}

/**
 * Append one activity (no-op if not signed in). Safe to fire-and-forget.
 */
export async function logActivity(input: LogActivityInput): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user?.uid) return;

  if (!VALID_ACTIONS.includes(input.actionType)) return;

  await addDoc(collection(db, ACTIVITIES_COLLECTION), {
    actionType: input.actionType,
    createdAt: serverTimestamp(),
    actorUid: user.uid,
    userEmail: user.email ?? null,
    userDisplayName: input.userDisplayName ?? user.displayName ?? null,
    playerId: input.playerId ?? null,
    playerName: input.playerName ?? null,
    description: input.description ?? null,
  });
}

export type ActivitiesPageResult = {
  activities: Activity[];
  /** Last document on this page — pass to `fetchActivitiesPage` as `cursor` for the next page */
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  /** More documents exist after this page */
  hasMore: boolean;
};

/**
 * One page of activities from Firestore (newest first). Uses cursor + limit (no client-side cap).
 */
export async function fetchActivitiesPage(
  pageSize: number,
  cursor: QueryDocumentSnapshot<DocumentData> | null
): Promise<ActivitiesPageResult> {
  const col = collection(db, ACTIVITIES_COLLECTION);
  const q = cursor
    ? query(
        col,
        orderBy("createdAt", "desc"),
        startAfter(cursor),
        limit(pageSize + 1)
      )
    : query(col, orderBy("createdAt", "desc"), limit(pageSize + 1));

  const snap = await getDocs(q);
  const docs = snap.docs;
  const hasMore = docs.length > pageSize;
  const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;

  const activities = pageDocs
    .map((d) =>
      firestoreDocToActivity(d.id, d.data() as Record<string, unknown>)
    )
    .filter((a): a is Activity => a != null);

  const lastDoc =
    pageDocs.length > 0 ? pageDocs[pageDocs.length - 1]! : null;

  return { activities, lastDoc, hasMore };
}
