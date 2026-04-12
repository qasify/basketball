import React from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import ActivityFeedView from "./_components/ActivityFeedView";

const ActivityFeedPage = () => {
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
      <h2 className="text-white text-xl font-bold uppercase tracking-wide">
        Activity Feed
      </h2>
      <p className="text-textGrey text-sm max-w-xl leading-relaxed -mt-2">
        Catch the team feed — see who updated watchlists, saved notes, or
        touched scouting reports. Stay in the loop and keep yourself up to date.
      </p>
      <ActivityFeedView />
    </div>
  );
};

export default ActivityFeedPage;
