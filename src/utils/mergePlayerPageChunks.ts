import type { Player } from "@/_api/basketball-api";

/** Merge player chunks from paged Firestore fetches (same person can appear on two pages). */
export function combineMergedPlayerPages(chunks: Player[][]): Player[] {
  const byKey = new Map<string, Player>();

  const keyOf = (p: Player) =>
    p.realgmId != null ? `rg:${p.realgmId}` : `nm:${p.name}|${p.country ?? "unknown"}`;

  for (const list of chunks) {
    for (const p of list) {
      const k = keyOf(p);
      const existing = byKey.get(k);
      if (!existing) {
        byKey.set(k, {
          ...p,
          seasons: [...(p.seasons ?? [])],
        });
        continue;
      }
      const seenSeasonIds = new Set(
        (existing.seasons ?? []).map((s) => s.id)
      );
      for (const s of p.seasons ?? []) {
        if (!seenSeasonIds.has(s.id)) {
          if (!existing.seasons) existing.seasons = [];
          existing.seasons.push(s);
          seenSeasonIds.add(s.id);
        }
      }
      if (p.position && !existing.position) existing.position = p.position;
      if (p.height && !existing.height) existing.height = p.height;
      if (p.weight && (!existing.weight || existing.weight === ""))
        existing.weight = p.weight;
      if (p.age != null && existing.age == null) existing.age = p.age;
      if (p.country && !existing.country) existing.country = p.country;
    }
  }

  return Array.from(byKey.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
