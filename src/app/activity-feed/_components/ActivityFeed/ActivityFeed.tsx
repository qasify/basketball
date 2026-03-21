"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Activity } from "../../_types/Activity";
import {
  formatRelativeTime,
  getActionLabel,
} from "../../_utils/formatActivity";
import {
  UserPlus,
  FileText,
  StickyNote,
  ClipboardList,
  RefreshCw,
} from "lucide-react";

const ACTION_ICONS: Record<Activity["actionType"], React.ReactNode> = {
  WATCHLIST_ADDED: <UserPlus className="w-4 h-4" />,
  WATCHLIST_REMOVED: <UserPlus className="w-4 h-4" />,
  NOTE_SAVED: <StickyNote className="w-4 h-4" />,
  SCOUTING_REPORT_GENERATED: <FileText className="w-4 h-4" />,
  SCOUTING_REPORT_UPDATED: <RefreshCw className="w-4 h-4" />,
  SCOUTING_REPORT_NOTES_SAVED: <ClipboardList className="w-4 h-4" />,
};

type ActivityFeedProps = {
  activities: Activity[];
};

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const PAGE_SIZE = 6;
  const [pageIndex, setPageIndex] = useState(0);

  const totalItems = activities.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  useEffect(() => {
    setPageIndex(0);
  }, [totalItems]);

  const currentPageActivities = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return activities.slice(start, end);
  }, [activities, pageIndex]);

  const visiblePageNumbers = useMemo(() => {
    // Show a compact pagination: current ±2, clamped to [1..pageCount]
    const pages: number[] = [];
    const start = Math.max(1, pageIndex + 1 - 2);
    const end = Math.min(pageCount, pageIndex + 1 + 2);
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }, [pageIndex, pageCount]);

  return (
    <div className="flex flex-col gap-4">
      <ul className="space-y-0">
        {currentPageActivities.map((activity) => {
          const who =
            activity.userDisplayName ?? activity.userEmail ?? "Someone";
          const actionLabel =
            activity.description ?? getActionLabel(activity.actionType);
          const time = formatRelativeTime(activity.createdAt);
          const icon = ACTION_ICONS[activity.actionType];
          const playerLink =
            activity.playerId != null
              ? `/player-database/player-profile/${activity.playerId}`
              : null;

        return (
          <li
            key={activity.id}
            className="group flex gap-3 py-3 border-b border-white/10 last:border-b-0 transition-colors hover:bg-purplish/10"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purplish/15 text-purpleFill border border-purpleFill/25 transition-colors group-hover:bg-purplish/20">
              {icon}
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-purpleFill font-semibold text-sm">
                  {who}
                </span>
                <span className="text-white/90 text-sm">{actionLabel}</span>

                {activity.playerName && (
                  <>
                    {playerLink ? (
                      <Link
                        href={playerLink}
                        className="ml-1 text-purpleFill hover:underline font-semibold text-sm"
                      >
                        {activity.playerName}
                      </Link>
                    ) : (
                      <span className="ml-1 text-white/80 text-sm font-medium">
                        {activity.playerName}
                      </span>
                    )}
                  </>
                )}
              </div>

              {activity.description && (
                <p className="text-textGrey text-xs">{activity.description}</p>
              )}

              <p className="text-textGrey/90 text-xs mt-0.5">{time}</p>
            </div>
          </li>
        );
        })}
      </ul>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-textGrey text-xs">
            Page <span className="text-white/90">{pageIndex + 1}</span> of{" "}
            <span className="text-white/90">{pageCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0}
              className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-colors"
              aria-label="Previous page"
            >
              Prev
            </button>

            <div className="hidden sm:flex items-center gap-2">
              {visiblePageNumbers.map((p) => {
                const isActive = p - 1 === pageIndex;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPageIndex(p - 1)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      isActive
                        ? "bg-purplish/20 border-purpleFill/40 text-white"
                        : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                setPageIndex((p) => Math.min(pageCount - 1, p + 1))
              }
              disabled={pageIndex >= pageCount - 1}
              className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-colors"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
