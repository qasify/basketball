import React from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import ActivityFeed from "./_components/ActivityFeed";
import { MOCK_ACTIVITIES } from "./_utils/mockActivities";

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
      <p className="text-textGrey text-sm max-w-xl">
        Who updated, scouted, or edited what — and when. Dummy data for now;
        later we&apos;ll connect Firestore.
      </p>
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-[10px]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
          <div className="text-white/90 font-semibold text-sm">
            Recent updates
          </div>
          <div className="text-textGrey text-xs">
            Showing {MOCK_ACTIVITIES.length} items
          </div>
        </div>
        <ActivityFeed activities={MOCK_ACTIVITIES} />
      </div>
    </div>
  );
};

export default ActivityFeedPage;
