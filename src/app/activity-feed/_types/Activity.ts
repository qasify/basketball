/**
 * Activity feed item – who did what and when.
 * Frontend dummy model first; later can align with Firestore schema.
 */
export type ActivityActionType =
  | "WATCHLIST_ADDED"
  | "WATCHLIST_REMOVED"
  | "NOTE_SAVED"
  | "SCOUTING_REPORT_GENERATED"
  | "SCOUTING_REPORT_UPDATED"
  | "SCOUTING_REPORT_NOTES_SAVED";

export interface Activity {
  id: string;
  /** When the action happened (ISO string or timestamp) */
  createdAt: string;
  /** Email or display name of who did the action */
  userEmail: string | null;
  /** For display: "You" vs actual email */
  userDisplayName?: string;
  actionType: ActivityActionType;
  /** Player id if action is about a player */
  playerId?: number;
  /** Player name for display */
  playerName?: string;
  /** Optional short description (e.g. "Added to watchlist") */
  description?: string;
}
