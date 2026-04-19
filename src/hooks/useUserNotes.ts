"use client";

import { useCallback, useEffect, useState } from "react";
import { getPlayer } from "@/_api/basketball-api";
import { notesDB, type LatestNoteItem } from "@/_api/firebase-api";
import type { NotePlayerMeta } from "@/app/dashboard/_types";

/**
 * Loads the signed-in user’s recent notes + player roster metadata for display.
 * Used by the dashboard preview and `/dashboard/notes`.
 */
export function useUserNotes(limit: number) {
  const [items, setItems] = useState<LatestNoteItem[]>([]);
  const [playerMetaById, setPlayerMetaById] = useState<
    Record<number, NotePlayerMeta>
  >({});
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => {
    setReloadToken((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const rows = await notesDB.getLatestForUser(limit);
        if (cancelled) return;
        const ids = [
          ...new Set(rows.map((r) => r.playerId).filter((id) => id != null)),
        ];
        const next: Record<number, NotePlayerMeta> = {};
        await Promise.all(
          ids.map(async (id) => {
            try {
              const p = await getPlayer(id);
              next[id] = {
                name: p.name ?? "",
                country: p.country,
                position: p.position,
                team: p.team,
                age: p.age,
                height: p.height,
                weight: p.weight,
              };
            } catch {
              next[id] = { name: "" };
            }
          })
        );
        if (cancelled) return;
        setItems(rows);
        setPlayerMetaById(next);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit, reloadToken]);

  return { items, playerMetaById, loading, refresh };
}
