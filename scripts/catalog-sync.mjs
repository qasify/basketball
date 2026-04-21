/**
 * One-shot catalog pipeline: Excel → JSON → Firestore
 *
 * 1) preprocess-data — reads Excel under public/data, writes leagues.json / teams.json / players.json
 * 2) import:firestore — uploads those JSON files to Firestore (catalogLeagues, catalogTeams, catalogPlayerRows)
 *
 * UI add/edit player (admin) updates master profile fields + optional RealGM ID on existing rows.
 * Per-season stats and bulk team/league rows still come from Excel → preprocess → import.
 * Rows with the same RealGM ID merge in the app after import (see merge logic in excel-league-api).
 *
 * Requires for step 2 (same as import:firestore):
 *   FIREBASE_SERVICE_ACCOUNT_JSON  or  GOOGLE_APPLICATION_CREDENTIALS
 *
 * Usage: npm run catalog:sync
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");

dotenv.config({ path: path.join(ROOT, ".env.local") });
dotenv.config({ path: path.join(ROOT, ".env") });

function hasFirestoreCredentials() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) {
    try {
      JSON.parse(inline);
      return true;
    } catch {
      console.error(
        "FIREBASE_SERVICE_ACCOUNT_JSON is set but is not valid JSON. Fix .env.local."
      );
      return false;
    }
  }
  const p = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (p && fs.existsSync(p)) return true;
  if (p && !fs.existsSync(p)) {
    console.error(
      `GOOGLE_APPLICATION_CREDENTIALS points to missing file: ${p}`
    );
    return false;
  }
  return false;
}

console.log("=== catalog:sync — preprocess-data, then import:firestore ===\n");

console.log("Step 1/2: preprocess-data (Excel → public/data/*.json)\n");
execSync("npm run preprocess-data", {
  cwd: ROOT,
  stdio: "inherit",
  shell: true,
  env: process.env,
});

if (!hasFirestoreCredentials()) {
  console.error(`
Step 2/2 skipped: no Firestore Admin credentials.

Set one of in .env.local:
  FIREBASE_SERVICE_ACCOUNT_JSON=<single-line service account JSON>
  GOOGLE_APPLICATION_CREDENTIALS=<absolute path to key.json>

JSON files are updated. When credentials are ready, run:
  npm run import:firestore
`);
  process.exit(1);
}

console.log("\nStep 2/2: import:firestore (JSON → Firestore)\n");
execSync("npm run import:firestore", {
  cwd: ROOT,
  stdio: "inherit",
  shell: true,
  env: process.env,
});

console.log("\ncatalog:sync finished.");
