/**
 * Upload public/data/{leagues,teams,players}.json to Firestore using the Admin SDK.
 *
 * Spark / free tier: use a daily write budget so each run stops before the ~20k/day
 * cap (default 19k/run leaves ~1k headroom for retries / other writes) and resumes
 * the next day without re-writing finished sections.
 *
 * Usage:
 *   npm run preprocess-data
 *   npm run import:firestore
 *
 * Env:
 *   IMPORT_MAX_WRITES_PER_RUN  default 19000 (set 0 for unlimited one-shot)
 *
 * Flags:
 *   --max-writes=19000   Override max writes for this run only
 *   --reset              Clear progress file; next run starts from scratch
 *
 * Progress file (gitignored): scripts/catalog-import-progress.json
 * Tracks nextLeagueIndex, nextTeamIndex, nextPlayerIndex — resume picks up there.
 *
 * Idempotent: set(..., { merge: true }) + one doc per numeric `id` (no duplicate docs).
 * Budget mode skips already-finished ranges using progress file — no re-writes until
 * you change JSON; then use --reset (see sourceSizes check).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, "..");
dotenv.config({ path: path.join(ROOT, ".env.local") });
dotenv.config({ path: path.join(ROOT, ".env") });

const DATA_DIR = path.join(ROOT, "public", "data");
const PROGRESS_FILE = path.join(ROOT, "scripts", "catalog-import-progress.json");

const CATALOG_LEAGUES = "catalogLeagues";
const CATALOG_TEAMS = "catalogTeams";
const CATALOG_PLAYER_ROWS = "catalogPlayerRows";

const OPS_PER_COMMIT = 100;
const COMMIT_MAX_RETRIES = 8;

const DEFAULT_MAX_WRITES = 19_000;

function parseCli() {
  const argv = process.argv.slice(2);
  let maxWrites = parseInt(
    process.env.IMPORT_MAX_WRITES_PER_RUN || String(DEFAULT_MAX_WRITES),
    10
  );
  let reset = false;
  for (const arg of argv) {
    if (arg === "--reset") reset = true;
    else if (arg.startsWith("--max-writes=")) {
      maxWrites = parseInt(arg.split("=")[1], 10);
      if (Number.isNaN(maxWrites)) maxWrites = DEFAULT_MAX_WRITES;
    }
  }
  return { maxWrites, reset };
}

function initAdmin() {
  if (admin.apps.length) return;

  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (inline?.trim()) {
    const cred = JSON.parse(inline);
    admin.initializeApp({ credential: admin.credential.cert(cred) });
    return;
  }

  if (credPath && fs.existsSync(credPath)) {
    const cred = JSON.parse(fs.readFileSync(credPath, "utf8"));
    admin.initializeApp({ credential: admin.credential.cert(cred) });
    return;
  }

  console.error(
    "Set FIREBASE_SERVICE_ACCOUNT_JSON (full JSON string) or GOOGLE_APPLICATION_CREDENTIALS (path to key file)."
  );
  process.exit(1);
}

let firestoreDb = null;

function getFirestoreDb() {
  initAdmin();
  if (!firestoreDb) {
    firestoreDb = admin.firestore();
    try {
      firestoreDb.settings({
        ignoreUndefinedProperties: true,
        preferRest: true,
      });
    } catch {
      /* older SDKs may not support preferRest */
    }
  }
  return firestoreDb;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isFirestoreQuotaError(err) {
  const msg = String(err?.message || err?.details || "").toLowerCase();
  return msg.includes("quota exceeded") || msg.includes("exceeded quota");
}

function isRetryableCommitError(err) {
  if (isFirestoreQuotaError(err)) return false;
  const code = err?.code;
  const msg = String(
    err?.message || err?.details || err?.errno || err?.cause?.message || err?.cause || ""
  );
  return (
    code === 4 ||
    code === 8 ||
    code === 14 ||
    code === "ENOTFOUND" ||
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    msg.includes("DEADLINE_EXCEEDED") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("ABORTED") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("ECONNRESET") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("fetch failed") ||
    msg.includes("getaddrinfo")
  );
}

async function commitChunk(db, writes) {
  let lastErr;
  for (let attempt = 0; attempt < COMMIT_MAX_RETRIES; attempt++) {
    try {
      const batch = db.batch();
      for (const { ref, data } of writes) {
        batch.set(ref, data, { merge: true });
      }
      await batch.commit();
      return;
    } catch (err) {
      lastErr = err;
      if (isFirestoreQuotaError(err)) {
        printQuotaHelp();
        throw err;
      }
      if (!isRetryableCommitError(err) || attempt === COMMIT_MAX_RETRIES - 1) {
        throw err;
      }
      const delayMs = Math.min(90_000, 1500 * 2 ** attempt);
      console.warn(
        `  … commit failed (attempt ${attempt + 1}/${COMMIT_MAX_RETRIES}), retry in ${delayMs / 1000}s — ${String(err.message || err).slice(0, 120)}`
      );
      await sleep(delayMs);
    }
  }
  throw lastErr;
}

function printQuotaHelp() {
  console.error(`
--- Firestore write quota exceeded ---

Spark caps daily writes (~20k). Use chunked import (default ${DEFAULT_MAX_WRITES} writes/run):
  npm run import:firestore

Resume tomorrow without re-uploading finished parts (progress in scripts/catalog-import-progress.json).

Or upgrade to Blaze: https://firebase.google.com/pricing
`);
}

function loadProgress(expectedSizes) {
  const empty = {
    version: 2,
    sourceSizes: { ...expectedSizes },
    nextLeagueIndex: 0,
    nextTeamIndex: 0,
    nextPlayerIndex: 0,
  };

  if (!fs.existsSync(PROGRESS_FILE)) {
    return empty;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));
    const progress = {
      version: 2,
      sourceSizes: raw.sourceSizes || { ...expectedSizes },
      nextLeagueIndex: raw.nextLeagueIndex ?? 0,
      nextTeamIndex: raw.nextTeamIndex ?? 0,
      nextPlayerIndex: raw.nextPlayerIndex ?? 0,
    };

    const prev = progress.sourceSizes;
    if (
      prev.leagues !== expectedSizes.leagues ||
      prev.teams !== expectedSizes.teams ||
      prev.players !== expectedSizes.players
    ) {
      console.error(`
catalog-import-progress.json was built for a different dataset (leagues=${prev.leagues}, teams=${prev.teams}, players=${prev.players}).
Current JSON: leagues=${expectedSizes.leagues}, teams=${expectedSizes.teams}, players=${expectedSizes.players}.

After changing Excel / preprocess-data, start a fresh import:
  npm run import:firestore -- --reset
`);
      process.exit(1);
    }
    return progress;
  } catch {
    return empty;
  }
}

function saveProgress(progress, expectedSizes) {
  const toSave = {
    ...progress,
    sourceSizes: { ...expectedSizes },
  };
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(toSave, null, 2));
}

function deleteProgress() {
  if (fs.existsSync(PROGRESS_FILE)) fs.unlinkSync(PROGRESS_FILE);
}

/**
 * Write docs[start..] until budget exhausted or array end.
 * onAfterBatch(nextIndex) runs after each successful batch (persist resume point on long imports).
 * @returns {{ nextIndex: number, writesConsumed: number }}
 */
async function writeArrayChunked(
  db,
  collectionName,
  docs,
  idField,
  startIndex,
  budgetRemaining,
  logLabel,
  onAfterBatch = null
) {
  let i = startIndex;
  let consumed = 0;
  const total = docs.length;

  while (i < total && consumed < budgetRemaining) {
    const room = budgetRemaining - consumed;
    const take = Math.min(OPS_PER_COMMIT, room, total - i);
    const slice = docs.slice(i, i + take);
    const writes = slice.map((item) => ({
      ref: db.collection(collectionName).doc(String(item[idField])),
      data: item,
    }));
    await commitChunk(db, writes);
    consumed += slice.length;
    i += slice.length;
    if (typeof onAfterBatch === "function") {
      onAfterBatch(i);
    }

    if (total > 2000 && (i % 5000 === 0 || i === total)) {
      console.log(`  ${logLabel}: ${i}/${total}`);
    }
  }

  return { nextIndex: i, writesConsumed: consumed };
}

function isComplete(progress, leagues, teams, players) {
  return (
    progress.nextLeagueIndex >= leagues.length &&
    progress.nextTeamIndex >= teams.length &&
    progress.nextPlayerIndex >= players.length
  );
}

async function main() {
  const { maxWrites: maxWritesArg, reset } = parseCli();
  const unlimited = maxWritesArg <= 0;
  const maxWritesPerRun = unlimited ? Number.MAX_SAFE_INTEGER : maxWritesArg;

  initAdmin();
  getFirestoreDb();

  if (reset) {
    deleteProgress();
    console.log("Progress reset. Next import starts from the beginning.\n");
  }

  const leaguesPath = path.join(DATA_DIR, "leagues.json");
  const teamsPath = path.join(DATA_DIR, "teams.json");
  const playersPath = path.join(DATA_DIR, "players.json");

  for (const p of [leaguesPath, teamsPath, playersPath]) {
    if (!fs.existsSync(p)) {
      console.error(`Missing ${p}. Run: npm run preprocess-data`);
      process.exit(1);
    }
  }

  const leagues = JSON.parse(fs.readFileSync(leaguesPath, "utf8"));
  const teams = JSON.parse(fs.readFileSync(teamsPath, "utf8"));
  const players = JSON.parse(fs.readFileSync(playersPath, "utf8"));

  const expectedSizes = {
    leagues: leagues.length,
    teams: teams.length,
    players: players.length,
  };

  let progress = loadProgress(expectedSizes);

  if (isComplete(progress, leagues, teams, players)) {
    console.log("Import already complete (progress file matches full dataset).");
    console.log("To re-import from scratch: npm run import:firestore -- --reset");
    return;
  }

  const db = getFirestoreDb();
  let remaining = maxWritesPerRun;

  console.log(
    unlimited
      ? `Import (unlimited writes): ${leagues.length} leagues, ${teams.length} teams, ${players.length} player rows`
      : `Import with budget ${maxWritesPerRun} writes this run (resume safe). ${leagues.length} leagues, ${teams.length} teams, ${players.length} player rows`
  );
  console.log(`Progress: league ${progress.nextLeagueIndex}/${leagues.length}, team ${progress.nextTeamIndex}/${teams.length}, player ${progress.nextPlayerIndex}/${players.length}\n`);

  // Leagues
  if (progress.nextLeagueIndex < leagues.length && remaining > 0) {
    console.log("→ catalogLeagues");
    const r = await writeArrayChunked(
      db,
      CATALOG_LEAGUES,
      leagues,
      "id",
      progress.nextLeagueIndex,
      remaining,
      "catalogLeagues",
      (nextIdx) => {
        progress.nextLeagueIndex = nextIdx;
        saveProgress(progress, expectedSizes);
      }
    );
    progress.nextLeagueIndex = r.nextIndex;
    remaining -= r.writesConsumed;
    saveProgress(progress, expectedSizes);
    console.log(`  (this run: ${r.writesConsumed} writes, ${remaining} budget left)\n`);
    if (remaining <= 0 && progress.nextLeagueIndex < leagues.length) {
      console.log("Daily budget reached mid-leagues. Run again tomorrow: npm run import:firestore");
      return;
    }
  }

  // Teams
  if (progress.nextTeamIndex < teams.length && remaining > 0) {
    console.log("→ catalogTeams");
    const r = await writeArrayChunked(
      db,
      CATALOG_TEAMS,
      teams,
      "id",
      progress.nextTeamIndex,
      remaining,
      "catalogTeams",
      (nextIdx) => {
        progress.nextTeamIndex = nextIdx;
        saveProgress(progress, expectedSizes);
      }
    );
    progress.nextTeamIndex = r.nextIndex;
    remaining -= r.writesConsumed;
    saveProgress(progress, expectedSizes);
    console.log(`  (this run: ${r.writesConsumed} writes, ${remaining} budget left)\n`);
    if (remaining <= 0 && progress.nextTeamIndex < teams.length) {
      console.log("Daily budget reached mid-teams. Run again tomorrow: npm run import:firestore");
      return;
    }
  }

  // Players
  if (progress.nextPlayerIndex < players.length && remaining > 0) {
    console.log("→ catalogPlayerRows");
    const r = await writeArrayChunked(
      db,
      CATALOG_PLAYER_ROWS,
      players,
      "id",
      progress.nextPlayerIndex,
      remaining,
      "catalogPlayerRows",
      (nextIdx) => {
        progress.nextPlayerIndex = nextIdx;
        saveProgress(progress, expectedSizes);
      }
    );
    progress.nextPlayerIndex = r.nextIndex;
    remaining -= r.writesConsumed;
    saveProgress(progress, expectedSizes);
    console.log(`  (this run: ${r.writesConsumed} writes, ${remaining} budget left)\n`);
    if (remaining <= 0 && progress.nextPlayerIndex < players.length) {
      console.log(
        `Daily budget reached with player row ${progress.nextPlayerIndex}/${players.length}. Tomorrow run: npm run import:firestore`
      );
      return;
    }
  }

  if (isComplete(progress, leagues, teams, players)) {
    deleteProgress();
    console.log("Firestore catalog import completed (all sections done). Progress file cleared.");
  } else {
    saveProgress(progress, expectedSizes);
    console.log("Import paused. Run again to continue.");
  }
}

main().catch((err) => {
  if (isFirestoreQuotaError(err)) printQuotaHelp();
  console.error(err);
  process.exit(1);
});
