import type { Player } from "@/_api/basketball-api";
import { watchListDB } from "@/_api/firebase-api";
import { notify } from "@/lib/notify";
import {
  toastMessage,
  watchlistAddedDesc,
  watchlistAlreadyDesc,
} from "@/utils/constants/toastMessage";

/** Add a player to the watchlist and show the appropriate toast (auth / duplicate / error). */
export async function addToWatchlistWithToast(player: Player): Promise<void> {
  try {
    const result = await watchListDB.add(player);
    if (result === "added") {
      notify.success(toastMessage.watchlist.addedTitle, {
        description: watchlistAddedDesc(player.name),
      });
    } else if (result === "duplicate") {
      notify.info(toastMessage.watchlist.alreadyTitle, {
        description: watchlistAlreadyDesc(player.name),
      });
    } else {
      notify.warning(toastMessage.watchlist.signInTitle, {
        description: toastMessage.watchlist.signInDesc,
      });
    }
  } catch {
    notify.error(toastMessage.watchlist.updateErrorTitle, {
      description: toastMessage.watchlist.updateErrorDesc,
    });
  }
}
