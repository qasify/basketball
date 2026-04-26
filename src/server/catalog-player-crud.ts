import "server-only";
import type { Player } from "@/_api/basketball-api";
import { CATALOG_PLAYER_ROWS } from "@/constants/firestoreCatalog";
import type { CatalogPlayerRow } from "@/types/excel-catalog-rows";
import { getCatalogFirestoreDb } from "@/server/catalog-firestore-queries";

const BATCH_LIMIT = 450;

function rowDocIdsFromMergedPlayer(player: Player): number[] {
  const fromSeasons = (player.seasons ?? []).map((s) => s.id).filter((id) => id != null);
  const uniq = [...new Set(fromSeasons)];
  return uniq;
}

/** Delete all `catalogPlayerRows` documents that merge into this UI player. */
export async function deleteCatalogPlayerRowsForMergedPlayer(
  player: Player
): Promise<{ deleted: number }> {
  const db = getCatalogFirestoreDb();
  const col = db.collection(CATALOG_PLAYER_ROWS);
  const ids = rowDocIdsFromMergedPlayer(player);
  if (ids.length === 0) {
    throw new Error(
      "No catalog row IDs on this player (missing seasons). Cannot delete from Firestore."
    );
  }

  let deleted = 0;
  for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    const slice = ids.slice(i, i + BATCH_LIMIT);
    for (const id of slice) {
      batch.delete(col.doc(String(id)));
    }
    await batch.commit();
    deleted += slice.length;
  }
  return { deleted };
}

/** Patch profile fields on every catalog row for this merged player. */
export async function updateCatalogPlayerRowsForMergedPlayer(
  player: Player,
  patch: Partial<
    Pick<
      Player,
      | "name"
      | "position"
      | "country"
      | "age"
      | "height"
      | "weight"
      | "realgmId"
    >
  >
): Promise<{ updated: number }> {
  const db = getCatalogFirestoreDb();
  const col = db.collection(CATALOG_PLAYER_ROWS);
  const ids = rowDocIdsFromMergedPlayer(player);
  if (ids.length === 0) {
    throw new Error(
      "No catalog row IDs on this player (missing seasons). Cannot update in Firestore."
    );
  }

  const updates: Record<string, string | number> = {};
  if (patch.name !== undefined) updates.name = patch.name;
  if (patch.position !== undefined) updates.position = patch.position;
  if (patch.country !== undefined) updates.country = patch.country;
  if (patch.age !== undefined) updates.age = patch.age;
  if (patch.height !== undefined) updates.height = patch.height;
  if (patch.weight !== undefined) updates.weight = patch.weight;
  if (patch.realgmId !== undefined) updates.realgmId = patch.realgmId;
  if (Object.keys(updates).length === 0) {
    return { updated: 0 };
  }

  let updated = 0;
  for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    const slice = ids.slice(i, i + BATCH_LIMIT);
    for (const id of slice) {
      batch.update(col.doc(String(id)), updates);
    }
    await batch.commit();
    updated += slice.length;
  }
  return { updated };
}

export type CreateCatalogPlayerRowInput = {
  leagueId: number;
  teamId: number;
  team?: string;
  name: string;
  /** Same id as Excel/import rows — binds manual + imported seasons to one player. */
  realgmId?: number;
  position?: string;
  country?: string;
  age?: number;
  height?: string;
  weight?: string;
  season?: string;
};

/** Create one new catalog row (one season line). ID is generated to avoid collisions with import IDs. */
export async function createCatalogPlayerRow(
  input: CreateCatalogPlayerRowInput
): Promise<{ id: number }> {
  const db = getCatalogFirestoreDb();
  const col = db.collection(CATALOG_PLAYER_ROWS);

  const id = Math.floor(1_000_000_000 + Math.random() * 8_000_000_000);
  const row: CatalogPlayerRow = {
    id,
    name: input.name,
    leagueId: input.leagueId,
    teamId: input.teamId,
    team: input.team ?? "",
    number: "",
    position: input.position,
    country: input.country,
    age: input.age,
    height: input.height,
    weight: input.weight,
    season: input.season ?? new Date().getFullYear().toString(),
  };
  if (input.realgmId != null && input.realgmId > 0) {
    row.realgmId = input.realgmId;
  }

  await col.doc(String(id)).set(row, { merge: true });
  return { id };
}
