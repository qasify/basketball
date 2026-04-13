/**
 * All user-facing toast copy lives here. Import `toastMessage` (and helpers) from components;
 * change wording in one place for the whole app.
 */
export const toastMessage = {
  auth: {
    signInFailedTitle: "Sign in failed",
    invalidCredentials: "Invalid email or password",
    signUpFailedTitle: "Sign up failed",
    signUpEmailInUse:
      "Failed to create account. Email might be already in use.",
    passwordsMismatchTitle: "Check your passwords",
    passwordsMismatchBody: "Passwords do not match",
    passwordShortTitle: "Password too short",
    passwordShortBody: "Password must be at least 6 characters",
  },

  watchlist: {
    addedTitle: "Added to watchlist",
    alreadyTitle: "Already on watchlist",
    signInTitle: "Sign in required",
    signInDesc: "Log in to add players to your watchlist.",
    updateErrorTitle: "Couldn't update watchlist",
    updateErrorDesc: "Check your connection and try again.",
    removedTitle: "Removed from watchlist",
    removeErrorTitle: "Couldn't remove player",
    removeErrorDesc: "Check your connection and try again.",
    priorityTitle: "Priority updated",
    priorityErrorTitle: "Couldn't update priority",
    priorityErrorDesc: "Try again in a moment.",
  },

  notes: {
    loadErrorTitle: "Couldn't load notes",
    loadErrorDesc: "Try again in a moment.",
    savedTitle: "Note saved",
    saveErrorTitle: "Couldn't save note",
    saveErrorDesc: "Check your connection and try again.",
  },

  profile: {
    displayNameSaved: "Display name saved",
    displayNameErrorTitle: "Couldn't save display name",
    displayNameErrorDesc: "Try again in a moment.",
    passwordUpdatedTitle: "Password updated",
    passwordUpdatedDesc: "Use your new password next time you sign in.",
    passwordWrongTitle: "Incorrect current password",
    passwordWrongDesc: "Re-enter your current password and try again.",
    passwordChangeErrorTitle: "Couldn't change password",
  },

  catalog: {
    loadTeamsTitle: "Couldn't load teams",
    loadTeamsDesc: "Check your connection or try different leagues.",
    loadPlayersTitle: "Couldn't load players",
    loadPlayersDesc: "Check your connection or team selection.",
    loadLeaguesTitle: "Couldn't load leagues",
    loadLeaguesDesc: "Refresh the page or try again shortly.",
  },

  header: {
    randomPlayerErrorTitle: "Couldn't load a random player",
    randomPlayerErrorDesc: "Try again in a moment.",
    searchErrorTitle: "Search failed",
    searchErrorDesc: "Couldn't fetch results. Try again.",
  },

  activityFeed: {
    loadErrorTitle: "Couldn't load activity",
    loadErrorDesc: "Try refreshing or check your connection.",
  },

  scouting: {
    loadErrorTitle: "Couldn't load scouting report",
    generateReadyTitle: "Scouting report ready",
    cloudWarningTitle: "Report not saved to cloud",
    cloudWarningDesc:
      "You can still read it here; sign in and try again to persist.",
    generateErrorTitle: "Couldn't generate report",
    notesSavedTitle: "Notes saved",
    notesSavedDesc: "Your scouting notes were updated.",
    notesErrorTitle: "Couldn't save notes",
    notesErrorDesc: "Check your connection and try again.",
    aiUpdatedTitle: "Report updated",
    aiUpdatedDesc: "AI changes were applied and saved.",
    aiErrorTitle: "Couldn't update with AI",
    /** When `extendScoutingReportWithPrompt` throws a non-Error value */
    aiErrorFallbackBody: "Failed to update report with AI.",
  },
} as const;

/** Watchlist: “{name} is on your list.” */
export function watchlistAddedDesc(playerName: string): string {
  return `${playerName} is on your list.`;
}

/** Watchlist: “{name} is already saved.” */
export function watchlistAlreadyDesc(playerName: string): string {
  return `${playerName} is already saved.`;
}

/** Watchlist: “{name} was removed.” */
export function watchlistRemovedDesc(playerName: string): string {
  return `${playerName} was removed.`;
}

/** Watchlist priority: “{name} is now {priority}.” */
export function watchlistPriorityDesc(
  playerName: string,
  priority: string
): string {
  return `${playerName} is now ${priority}.`;
}

/** Scouting: “Generated for {name}.” */
export function scoutingGeneratedDesc(playerName: string): string {
  return `Generated for ${playerName}.`;
}

/** Notes: “Saved for {name}.” */
export function noteSavedDesc(playerName: string): string {
  return `Saved for ${playerName}.`;
}
