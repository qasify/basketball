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

function initAdmin(): void {
  if (admin.apps.length > 0) return;

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!json?.trim()) {
    throw new Error(
      "Set FIREBASE_SERVICE_ACCOUNT_JSON when USE_FIRESTORE_CATALOG=true (service account JSON as a single-line string)."
    );
  }

  const cred = JSON.parse(json) as admin.ServiceAccount;
  admin.initializeApp({
    credential: admin.credential.cert(cred),
  });
}

type CatalogBundle = {
  leagues: League[];
  teams: CatalogTeamRow[];
  players: CatalogPlayerRow[];
};

/**
 * Full collection scan (~70k reads). Prefer `catalog-firestore-queries.ts` for production reads.
 * Kept for one-off tooling / debugging.
 */
async function fetchCatalogFromFirestoreUncached(): Promise<CatalogBundle> {
  initAdmin();
  const db = admin.firestore();

  const [leaguesSnap, teamsSnap, playersSnap] = await Promise.all([
    db.collection(CATALOG_LEAGUES).get(),
    db.collection(CATALOG_TEAMS).get(),
    db.collection(CATALOG_PLAYER_ROWS).get(),
  ]);

  if (leaguesSnap.empty || teamsSnap.empty || playersSnap.empty) {
    throw new Error(
      "Firestore catalog collections are empty. Run: npm run preprocess-data && npm run import:firestore"
    );
  }

  const leagues = leaguesSnap.docs.map((d) => {
    const data = d.data() as League;
    return { ...data, id: data.id ?? Number(d.id) };
  });

  const teams = teamsSnap.docs.map((d) => {
    const data = d.data() as CatalogTeamRow;
    return { ...data, id: data.id ?? Number(d.id) };
  });

  const players = playersSnap.docs.map((d) => {
    const data = d.data() as CatalogPlayerRow;
    return { ...data, id: data.id ?? Number(d.id) };
  });

  return { leagues, teams, players };
}

const getCachedCatalog = unstable_cache(
  async (): Promise<CatalogBundle> => fetchCatalogFromFirestoreUncached(),
  ["firestore-catalog-bundle-v1"],
  {
    revalidate: 3600,
    tags: ["firestore-catalog"],
  }
);

/**
 * Loads the same shapes as public/data/*.json using the Admin SDK (bypasses security rules).
 * Wrapped in Next.js `unstable_cache` (1h) so you do not pay ~70k Firestore reads on every request.
 *
 * Env:
 * - CATALOG_DISABLE_NEXT_CACHE=true — always fetch from Firestore (heavy; dev/debug only).
 * - For zero catalog reads in dev: USE_FIRESTORE_CATALOG=false (JSON files).
 *
 * After a full re-import, new data appears within the cache window or call revalidateTag("firestore-catalog") from a Route Handler.
 */
export async function loadCatalogFromFirestore(): Promise<CatalogBundle> {
  if (process.env.CATALOG_DISABLE_NEXT_CACHE === "true") {
    return fetchCatalogFromFirestoreUncached();
  }
  return getCachedCatalog();
}
