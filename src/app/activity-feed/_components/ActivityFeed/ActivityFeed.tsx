"use client";

import React from "react";
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
  RefreshCw as ReportRefreshIcon,
} from "lucide-react";

const ACTION_ICONS: Record<Activity["actionType"], React.ReactNode> = {
  WATCHLIST_ADDED: <UserPlus className="w-4 h-4" />,
  WATCHLIST_REMOVED: <UserPlus className="w-4 h-4" />,
  NOTE_SAVED: <StickyNote className="w-4 h-4" />,
  SCOUTING_REPORT_GENERATED: <FileText className="w-4 h-4" />,
  SCOUTING_REPORT_UPDATED: <ReportRefreshIcon className="w-4 h-4" />,
  SCOUTING_REPORT_NOTES_SAVED: <ClipboardList className="w-4 h-4" />,
};

function ActivityRowSkeleton() {
  return (
    <li className="border-b border-white/10 last:border-b-0 py-2 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-9 w-9 shrink-0 rounded-xl bg-white/10 mt-0.5" />
        <div className="flex-1 min-w-0 space-y-2 py-2">
          <div className="h-3.5 w-full max-w-md rounded bg-white/10" />
          <div className="h-3 w-24 rounded bg-white/5" />
        </div>
      </div>
    </li>
  );
}

type ActivityFeedProps = {
  activities: Activity[];
  pageIndex: number;
  pageSize: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPageChange: (index: number) => void;
  listLoading?: boolean;
};

const ActivityFeed = ({
  activities,
  pageIndex,
  pageSize,
  hasPrev,
  hasNext,
  onPageChange,
  listLoading = false,
}: ActivityFeedProps) => {
  const showPagination = hasPrev || hasNext;
  const showCaughtUp =
    !listLoading && activities.length > 0 && !hasNext;

  return (
    <div className="flex flex-col gap-4">
      <ul className="space-y-1">
        {listLoading
          ? Array.from({ length: pageSize }, (_, i) => (
              <ActivityRowSkeleton key={`sk-${i}`} />
            ))
          : activities.map((activity) => {
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
              className="border-b border-white/10 last:border-b-0 py-2 last:pb-2"
            >
              <div className="group flex items-start gap-4">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purplish/15 text-purpleFill border border-purpleFill/25 mt-0.5"
                  aria-hidden
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0 rounded-xl px-3 py-2 transition-colors group-hover:bg-purplish/10">
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

                  <p className="text-textGrey text-xs mt-0.5">{time}</p>
                </div>
              </div>
            </li>
          );
            })}
      </ul>

      {showCaughtUp && (
        <p className="text-textGrey text-xs text-center sm:text-left pt-1">
          You&apos;re all caught up — no older activity to load.
        </p>
      )}

      {showPagination && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-white/10">
          <div className="text-textGrey text-xs">
            Page <span className="text-white/90">{pageIndex + 1}</span>
            <span className="text-textGrey/80"> · older updates on next pages</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(pageIndex - 1)}
              disabled={!hasPrev || listLoading}
              className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-colors"
              aria-label="Newer activity"
            >
              Newer
            </button>
            <button
              type="button"
              onClick={() => onPageChange(pageIndex + 1)}
              disabled={!hasNext || listLoading}
              className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-colors"
              aria-label="Older activity"
            >
              Older
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
