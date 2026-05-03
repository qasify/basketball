/**
 * Roster fields from `getPlayer` (Excel cache) — used when listing notes on the
 * dashboard and `/dashboard/notes`.
 */
export type NotePlayerMeta = {
  name: string;
  /** Player photo URL from roster data; falls back to watchlist placeholder in UI. */
  image?: string;
  country?: string;
  position?: string;
  team?: string;
  age?: number;
  height?: string;
  weight?: string;
};
