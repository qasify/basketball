import type { LatestNoteItem } from "@/_api/firebase-api";
import type { NotePlayerMeta } from "../_types";

export function displayNotePlayerName(
  row: LatestNoteItem,
  playerMeta: Record<number, NotePlayerMeta>
): string {
  const fromDoc = row.playerName?.trim();
  if (fromDoc) return fromDoc;
  const fromMeta = playerMeta[row.playerId]?.name?.trim();
  if (fromMeta) return fromMeta;
  return `Player #${row.playerId}`;
}

/** Format stored ISO `dateTime` for display (readable local date + time). */
export function formatNoteTimestamp(iso: string | undefined): string | null {
  if (iso == null || String(iso).trim() === "") return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Two characters for avatar — handles “Player #123” fallback. */
export function noteInitials(displayName: string, playerId: number): string {
  const d = displayName.trim();
  if (/^Player #\d+$/i.test(d)) {
    const id = String(playerId);
    return id.length <= 2 ? id : id.slice(-2);
  }
  const parts = d.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0];
    const b = parts[parts.length - 1][0];
    if (a && b) return `${a}${b}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length === 1) {
    return `${parts[0]}?`.toUpperCase();
  }
  return String(playerId).slice(-2).padStart(2, "0");
}

/** One line of position · team · age · height · weight for full note rows. */
export function formatNotePlayerExtras(
  meta: NotePlayerMeta | undefined
): string | null {
  if (!meta) return null;
  const parts: string[] = [];
  if (meta.position) parts.push(meta.position);
  if (meta.team) parts.push(meta.team);
  if (meta.age != null) parts.push(`Age ${meta.age}`);
  if (meta.height) parts.push(meta.height);
  if (meta.weight) parts.push(meta.weight);
  return parts.length ? parts.join(" · ") : null;
}
