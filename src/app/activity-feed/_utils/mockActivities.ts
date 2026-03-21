import type { Activity } from "../_types/Activity";

/**
 * Dummy activity feed data for frontend preview.
 * Replace with Firestore query later.
 */
export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    userEmail: "qasim@example.com",
    userDisplayName: "Qasim",
    actionType: "SCOUTING_REPORT_UPDATED",
    playerId: 179763,
    playerName: "Noam Yaacov",
    description: "Updated scouting report with AI",
  },
  {
    id: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    userEmail: "you@example.com",
    userDisplayName: "You",
    actionType: "WATCHLIST_ADDED",
    playerId: 179763,
    playerName: "Noam Yaacov",
    description: "Added to watchlist",
  },
  {
    id: "3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    userEmail: "admin@example.com",
    userDisplayName: "Admin",
    actionType: "SCOUTING_REPORT_GENERATED",
    playerId: 12345,
    playerName: "John Smith",
    description: "Generated scouting report",
  },
  {
    id: "4",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    userEmail: "you@example.com",
    userDisplayName: "You",
    actionType: "NOTE_SAVED",
    playerId: 179763,
    playerName: "Noam Yaacov",
    description: "Saved a note",
  },
  {
    id: "5",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    userEmail: "qasim@example.com",
    userDisplayName: "Qasim",
    actionType: "SCOUTING_REPORT_NOTES_SAVED",
    playerId: 67890,
    playerName: "Jane Doe",
    description: "Added notes to scouting report",
  },
];
