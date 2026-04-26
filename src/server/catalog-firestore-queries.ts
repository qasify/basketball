import "server-only";
import * as admin from "firebase-admin";
import { unstable_cache } from "next/cache";
import {
  CATALOG_LEAGUES,
  CATALOG_PLAYER_ROWS,
  CATALOG_TEAMS,
} from "@/constants/firestoreCatalog";
import type { League } from "@/_api/basketball-api";
import type { CatalogPlayerRow, CatalogTeamRow } from "@/types/excel-catalog-rows";

/** Firestore allows at most 30 values in a single `in` query. */
export const FIRESTORE_IN_MAX = 30;

const LEAGUES_LIMIT = 500;
const TEAMS_ALL_LIMIT = 8000;

function initAdmin(): void {
  if (admin.apps.length > 0) return;
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!json?.trim()) {
    throw new Error(
      "Set FIREBASE_SERVICE_ACCOUNT_JSON when USE_FIRESTORE_CATALOG=true."
    );
  }
  const cred = JSON.parse(json) as admin.ServiceAccount;
  admin.initializeApp({ credential: admin.credential.cert(cred) });
}

function getDb() {
  initAdmin();
  return admin.firestore();
}

/** Exposed for catalog Admin writes (CRUD) in `catalog-player-crud.ts`. */
export function getCatalogFirestoreDb() {
  return getDb();
}

function docToLeague(
  d: admin.firestore.QueryDocumentSnapshot | admin.firestore.DocumentSnapshot
): League {
  const data = d.data() as League;
  return { ...data, id: data.id ?? Number(d.id) };
}

function docToTeam(
  d: admin.firestore.QueryDocumentSnapshot | admin.firestore.DocumentSnapshot
): CatalogTeamRow {
  const data = d.data() as CatalogTeamRow;
  return { ...data, id: data.id ?? Number(d.id) };
}

function docToPlayerRow(
  d: admin.firestore.QueryDocumentSnapshot | admin.firestore.DocumentSnapshot
): CatalogPlayerRow {
  const data = d.data() as CatalogPlayerRow;
  return { ...data, id: data.id ?? Number(d.id) };
}

/** Bounded query — not a full collection scan. */
async function fetchLeaguesUncached(): Promise<League[]> {
  const snap = await getDb()
    .collection(CATALOG_LEAGUES)
    .limit(LEAGUES_LIMIT)
    .get();
  return snap.docs.map((d) => docToLeague(d));
}

/** Teams for one league, or all teams when leagueId is 0. */
async function fetchTeamsUncached(leagueId: number): Promise<CatalogTeamRow[]> {
  const col = getDb().collection(CATALOG_TEAMS);
  const snap =
    leagueId === 0
      ? await col.limit(TEAMS_ALL_LIMIT).get()
      : await col.where("leagueId", "==", leagueId).get();
  return snap.docs.map((d) => docToTeam(d));
}

/** Batched `where('teamId','in', …)`. */
async function fetchPlayerRowsByTeamIdsUncached(
  teamIds: number[]
): Promise<CatalogPlayerRow[]> {
  if (teamIds.length === 0) return [];
  const col = getDb().collection(CATALOG_PLAYER_ROWS);
  const out: CatalogPlayerRow[] = [];
  const unique = [...new Set(teamIds)];

  for (let i = 0; i < unique.length; i += FIRESTORE_IN_MAX) {
    const chunk = unique.slice(i, i + FIRESTORE_IN_MAX);
    const snap = await col.where("teamId", "in", chunk).get();
    out.push(...snap.docs.map((d) => docToPlayerRow(d)));
  }
  return out;
}

/** One page of raw rows (cursor on numeric `id`). When teamIds exceed `in` limit, returns full set in one chunk (no cursor). */
export async function getPlayerRowsPageByTeamIdsFromFirestore(
  teamIds: number[],
  rawLimit: number,
  cursor: string | null
): Promise<{ rows: CatalogPlayerRow[]; nextCursor: string | null }> {
  const unique = [...new Set(teamIds)].sort((a, b) => a - b);
  if (unique.length === 0) return { rows: [], nextCursor: null };

  if (unique.length > FIRESTORE_IN_MAX) {
    const all = await fetchPlayerRowsByTeamIdsUncached(unique);
    return { rows: all, nextCursor: null };
  }

  const db = getDb();
  const col = db.collection(CATALOG_PLAYER_ROWS);
  const limitPlus = rawLimit + 1;
  let q = col
    .where("teamId", "in", unique)
    .orderBy("id")
    .limit(limitPlus);

  if (cursor != null && cursor !== "") {
    const n = parseInt(cursor, 10);
    if (!Number.isNaN(n)) {
      q = q.startAfter(n);
    }
  }

  const snap = await q.get();
  const allDocs = snap.docs.map((d) => docToPlayerRow(d));
  const hasMore = allDocs.length > rawLimit;
  const rows = hasMore ? allDocs.slice(0, rawLimit) : allDocs;
  const nextCursor =
    hasMore && rows.length > 0 ? String(rows[rows.length - 1].id) : null;

  return { rows, nextCursor };
}

/** Matches excel-league-api getPlayerById merge logic using queries only. */
async function fetchPlayerRowsForPlayerIdUncached(
  id: number
): Promise<CatalogPlayerRow[]> {
  const col = getDb().collection(CATALOG_PLAYER_ROWS);

  const byReal = await col.where("realgmId", "==", id).limit(500).get();
  if (!byReal.empty) {
    return byReal.docs.map((d) => docToPlayerRow(d));
  }

  const byRow = await col.where("id", "==", id).limit(100).get();
  if (!byRow.empty) {
    const row = docToPlayerRow(byRow.docs[0]);
    const name = row.name;
    const country = row.country || "unknown";
    const broad = await col.where("name", "==", name).limit(300).get();
    return broad
      .docs
      .map((d) => docToPlayerRow(d))
      .filter((p) => (p.country || "unknown") === country);
  }

  const docSnap = await col.doc(String(id)).get();
  if (docSnap.exists) {
    const row = docToPlayerRow(docSnap);
    const name = row.name;
    const country = row.country || "unknown";
    const broad = await col.where("name", "==", name).limit(300).get();
    return broad
      .docs
      .map((d) => docToPlayerRow(d))
      .filter((p) => (p.country || "unknown") === country);
  }

  throw new Error(`Player with ID ${id} not found`);
}

export async function getLeaguesFromFirestore(): Promise<League[]> {
  if (process.env.CATALOG_DISABLE_NEXT_CACHE === "true") {
    return fetchLeaguesUncached();
  }
  return unstable_cache(
    async () => fetchLeaguesUncached(),
    ["catalog-q-leagues-v1"],
    { revalidate: 3600, tags: ["firestore-catalog"] }
  )();
}

export async function getTeamsFromFirestore(
  leagueId: number
): Promise<CatalogTeamRow[]> {
  if (process.env.CATALOG_DISABLE_NEXT_CACHE === "true") {
    return fetchTeamsUncached(leagueId);
  }
  return unstable_cache(
    async () => fetchTeamsUncached(leagueId),
    ["catalog-q-teams-v1", String(leagueId)],
    { revalidate: 3600, tags: ["firestore-catalog"] }
  )();
}

export async function getPlayerRowsByTeamIdsFromFirestore(
  teamIds: number[]
): Promise<CatalogPlayerRow[]> {
  const key = [...new Set(teamIds)].sort((a, b) => a - b).join(",");
  if (!key) return [];
  // Do not use unstable_cache here: Next.js data cache rejects entries > 2MB, and
  // batched "all teams" / large league selections can return tens of MB of rows.
  // Client-side TanStack Query still dedupes refetches for the same teamIds.
  return fetchPlayerRowsByTeamIdsUncached(teamIds);
}

export async function getPlayerRowsForIdFromFirestore(
  id: number
): Promise<CatalogPlayerRow[]> {
  if (process.env.CATALOG_DISABLE_NEXT_CACHE === "true") {
    return fetchPlayerRowsForPlayerIdUncached(id);
  }
  return unstable_cache(
    async () => fetchPlayerRowsForPlayerIdUncached(id),
    ["catalog-q-player-one-v1", String(id)],
    { revalidate: 300, tags: ["firestore-catalog"] }
  )();
}
