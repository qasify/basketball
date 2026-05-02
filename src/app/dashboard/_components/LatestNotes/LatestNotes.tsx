"use client";

import React from "react";
import Link from "next/link";
import UserNoteCard from "./_components/UserNoteCard";
import { useUserNotes } from "@/hooks/useUserNotes";

/** Number of note rows on the dashboard preview (see also `/dashboard/notes`). */
export const DASHBOARD_NOTES_PREVIEW_LIMIT = 5;

const LatestNotes = () => {
  const { items, playerMetaById, loading } = useUserNotes(
    DASHBOARD_NOTES_PREVIEW_LIMIT,
  );

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-white text-xl font-bold uppercase tracking-wide">
            Latest notes
          </h2>
          <p className="text-xs text-textGrey mt-1">
            Showing up to {DASHBOARD_NOTES_PREVIEW_LIMIT} most recent
          </p>
        </div>
        <Link
          href="/dashboard/notes"
          className="text-sm font-medium text-purpleFill hover:text-purpleFill/90 hover:underline shrink-0 w-fit"
        >
          See all
        </Link>
      </header>

      <div className="max-h-[min(260px,38vh)] overflow-y-auto rounded-lg border border-white/10 bg-white/[0.03]">
        {loading ? (
          <div className="divide-y divide-white/10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 px-4 py-3 animate-pulse">
                <div className="h-9 w-9 shrink-0 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2 pt-0.5">
                  <div className="h-3.5 w-36 rounded bg-white/10" />
                  <div className="h-3 w-48 rounded bg-white/5" />
                  <div className="h-8 w-full rounded bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-textGrey text-sm">No notes yet</p>
            <Link
              href="/player-database"
              className="mt-3 inline-block text-sm font-medium text-purpleFill hover:underline"
            >
              Browse players
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/10" role="list">
            {items.map((row) => (
              <li key={row.firestoreId}>
                <UserNoteCard
                  row={row}
                  playerMetaById={playerMetaById}
                  excerptClamp={2}
                  maxChars={100}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default LatestNotes;
