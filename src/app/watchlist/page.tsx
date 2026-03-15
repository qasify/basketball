import React from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import WatchlistContent from "./_components/WatchlistContent";

const Watchlist = () => {
  return (
    <div className="flex flex-col px-8 py-5 gap-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors w-fit"
        aria-label="Back to Dashboard"
      >
        <IoMdArrowRoundBack size={20} className="shrink-0" />
        Back to Dashboard
      </Link>
      <h2 className="text-white text-xl font-bold uppercase">Watchlist</h2>
      <WatchlistContent />
    </div>
  );
};

export default Watchlist;
