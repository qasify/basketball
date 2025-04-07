import React from "react";
import WatchlistContent from "./_components/WatchlistContent";

const Watchlist = () => {
  return (
    <div className="flex flex-col px-8 py-5 gap-6">
      <h2 className="text-white text-xl font-bold uppercase">Watchlist</h2>
      <WatchlistContent />
    </div>
  );
};

export default Watchlist;
