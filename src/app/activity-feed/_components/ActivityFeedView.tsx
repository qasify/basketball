"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { RefreshCw, User } from "lucide-react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import ActivityFeed from "./ActivityFeed";
import type { Activity } from "../_types/Activity";
import {
  fetchActivitiesPage,
  type ActivitiesPageResult,
} from "@/_api/activity-api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

const PAGE_SIZE = 6;

export default function ActivityFeedView() {
  const { user, loading: authLoading } = useAuth();
  const pageCacheRef = useRef<Map<number, ActivitiesPageResult>>(new Map());
  const [pageIndex, setPageIndex] = useState(0);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [displayActivities, setDisplayActivities] = useState<Activity[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [feedLoading, setFeedLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = useCallback(() => {
    pageCacheRef.current = new Map();
    setIsRefreshing(true);
    setPageIndex(0);
    setError(null);
    setRefreshNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    pageCacheRef.current = new Map();
    setPageIndex(0);
    setRefreshNonce(0);
    setError(null);
    setIsRefreshing(false);
  }, [user?.uid]);

  useEffect(() => {
    if (authLoading || !user?.uid) {
      if (!authLoading && !user?.uid) setFeedLoading(false);
      return;
    }

    let cancelled = false;
    const cache = pageCacheRef.current;

    if (cache.has(pageIndex)) {
      const e = cache.get(pageIndex)!;
      setDisplayActivities(e.activities);
      setHasNext(e.hasMore);
      setFeedLoading(false);
      setError(null);
      setIsRefreshing(false);
      return;
    }

    setFeedLoading(true);
    setError(null);

    (async () => {
      try {
        let startP = 0;
        for (let i = pageIndex - 1; i >= 0; i--) {
          if (cache.has(i)) {
            startP = i + 1;
            break;
          }
        }

        for (let p = startP; p <= pageIndex; p++) {
          const cursor: QueryDocumentSnapshot<DocumentData> | null =
            p === 0 ? null : (cache.get(p - 1)?.lastDoc ?? null);
          if (p > 0 && cursor === null) {
            console.error("Activity feed: missing cursor for page", p);
            break;
          }
          const res = await fetchActivitiesPage(PAGE_SIZE, cursor);
          if (cancelled) return;
          cache.set(p, res);
        }

        const entry = cache.get(pageIndex);
        if (cancelled || !entry) return;
        setDisplayActivities(entry.activities);
        setHasNext(entry.hasMore);
      } catch (err) {
        console.error("Activity feed:", err);
        if (!cancelled) setError("load-failed");
      } finally {
        if (!cancelled) {
          setFeedLoading(false);
          setIsRefreshing(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.uid, pageIndex, refreshNonce]);

  const cardClass =
    "rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-[10px]";

  if (authLoading) {
    return (
      <div
        className={`${cardClass} flex flex-col items-center justify-center py-16 gap-3 text-textGrey`}
      >
        <FaSpinner className="animate-spin text-purple-400" size={28} />
        <p className="text-sm">Checking session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cardClass}>
        <p className="text-textGrey text-sm py-6 text-center max-w-md mx-auto leading-relaxed">
          Sign in to see the team feed — watchlist, notes, and scouting updates
          from your staff show up here.
        </p>
      </div>
    );
  }

  const who =
    user.displayName?.trim() ||
    user.email?.split("@")[0] ||
    "You";

  const showEmpty =
    !feedLoading &&
    !error &&
    displayActivities.length === 0 &&
    pageIndex === 0;

  return (
    <div className={cardClass}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <h3 className="text-white/90 font-semibold text-sm order-2 sm:order-1">
          Recent updates
        </h3>
        <div className="flex items-center gap-3 self-end sm:self-auto order-1 sm:order-2 shrink-0">
          <div
            className="flex items-center gap-2 text-white/90 text-sm min-w-0"
            title={user.email ?? undefined}
          >
            <User
              className="w-4 h-4 text-purpleFill shrink-0"
              aria-hidden
            />
            <span className="truncate max-w-[200px]">{who}</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={feedLoading}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white transition-colors",
              "disabled:opacity-45 disabled:pointer-events-none"
            )}
            aria-label="Refresh activity feed"
          >
            <RefreshCw
              className={cn("w-4 h-4", isRefreshing && "animate-spin")}
              aria-hidden
            />
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-textGrey text-sm py-4 text-center max-w-md mx-auto leading-relaxed">
          Couldn&apos;t load activity. Try{" "}
          <button
            type="button"
            onClick={handleRefresh}
            className="text-purpleFill underline-offset-2 hover:underline font-medium"
          >
            refreshing
          </button>{" "}
          or reload the page.
        </p>
      ) : showEmpty ? (
        <p className="text-textGrey text-sm py-6 text-center">
          No activity yet. Actions on watchlist, notes, and scouting reports will
          show up here for your team.
        </p>
      ) : (
        <ActivityFeed
          activities={displayActivities}
          pageIndex={pageIndex}
          pageSize={PAGE_SIZE}
          hasPrev={pageIndex > 0}
          hasNext={hasNext}
          onPageChange={setPageIndex}
          listLoading={feedLoading}
        />
      )}
    </div>
  );
}
