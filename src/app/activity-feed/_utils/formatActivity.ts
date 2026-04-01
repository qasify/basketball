import type { Activity, ActivityActionType } from "../_types/Activity";

const ACTION_LABELS: Record<ActivityActionType, string> = {
  WATCHLIST_ADDED: "Added to watchlist",
  WATCHLIST_REMOVED: "Removed from watchlist",
  NOTE_SAVED: "Saved a note",
  SCOUTING_REPORT_GENERATED: "Generated scouting report",
  SCOUTING_REPORT_UPDATED: "Updated scouting report",
  SCOUTING_REPORT_NOTES_SAVED: "Added notes to scouting report",
};

export function getActionLabel(actionType: ActivityActionType): string {
  return ACTION_LABELS[actionType] ?? actionType;
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

export function getActivitySummary(activity: Activity): string {
  const who = activity.userDisplayName ?? activity.userEmail ?? "Someone";
  const action = activity.description ?? getActionLabel(activity.actionType);
  const target = activity.playerName ? ` for ${activity.playerName}` : "";
  return `${who} ${action.toLowerCase()}${target}`;
}

