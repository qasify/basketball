/**
 * Roster fields from `getPlayer` (Excel cache) — used when listing notes on the
 * dashboard and `/dashboard/notes`.
 */
export type NotePlayerMeta = {
  name: string;
  country?: string;
  position?: string;
  team?: string;
  age?: number;
  height?: string;
  weight?: string;
};
