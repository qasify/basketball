"use server";

import * as admin from "firebase-admin";
import type { Player } from "@/_api/basketball-api";
import { getCatalogFirestoreDb } from "@/server/catalog-firestore-queries";
import {
  createCatalogPlayerRow,
  deleteCatalogPlayerRowsForMergedPlayer,
  updateCatalogPlayerRowsForMergedPlayer,
  type CreateCatalogPlayerRowInput,
} from "@/server/catalog-player-crud";

function assertFirestoreCatalogEnabled(): void {
  if (
    process.env.USE_FIRESTORE_CATALOG !== "true" &&
    process.env.USE_FIRESTORE_CATALOG !== "1"
  ) {
    throw new Error(
      "Catalog editing requires USE_FIRESTORE_CATALOG=true on the server."
    );
  }
}

/** Requires `users/{doc}` with `uid` matching token and `role` === `"admin"`. */
async function assertAdminIdToken(idToken: string): Promise<void> {
  const db = getCatalogFirestoreDb();
  const decoded = await admin.auth().verifyIdToken(idToken);
  const snap = await db
    .collection("users")
    .where("uid", "==", decoded.uid)
    .limit(1)
    .get();
  if (snap.empty) {
    throw new Error("Forbidden: user profile not found.");
  }
  const role = snap.docs[0].data().role as string | undefined;
  if (role !== "admin") {
    throw new Error("Forbidden: admin role required for catalog changes.");
  }
}

export async function deleteCatalogPlayerAction(
  idToken: string,
  player: Player
): Promise<{ ok: true; deleted: number } | { ok: false; error: string }> {
  try {
    assertFirestoreCatalogEnabled();
    await assertAdminIdToken(idToken);
    const { deleted } = await deleteCatalogPlayerRowsForMergedPlayer(player);
    return { ok: true, deleted };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return { ok: false, error: msg };
  }
}

export async function updateCatalogPlayerAction(
  idToken: string,
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
): Promise<{ ok: true; updated: number } | { ok: false; error: string }> {
  try {
    assertFirestoreCatalogEnabled();
    await assertAdminIdToken(idToken);
    const { updated } = await updateCatalogPlayerRowsForMergedPlayer(
      player,
      patch
    );
    return { ok: true, updated };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    return { ok: false, error: msg };
  }
}

export async function createCatalogPlayerRowAction(
  idToken: string,
  input: CreateCatalogPlayerRowInput
): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  try {
    assertFirestoreCatalogEnabled();
    await assertAdminIdToken(idToken);
    if (!input.name?.trim()) {
      throw new Error("Name is required.");
    }
    const { id } = await createCatalogPlayerRow(input);
    return { ok: true, id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Create failed";
    return { ok: false, error: msg };
  }
}
