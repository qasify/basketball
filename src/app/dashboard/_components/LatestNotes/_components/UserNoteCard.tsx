"use client";

import React from "react";
import Link from "next/link";
import type { LatestNoteItem } from "@/_api/firebase-api";
import type { NotePlayerMeta } from "../../../_types";
import {
  displayNotePlayerName,
  formatNoteTimestamp,
  noteInitials,
} from "../../../_utils/notes";
import NoteIdCountryBadges from "./NoteIdCountryBadges";

type UserNoteCardProps = {
  row: LatestNoteItem;
  playerMetaById: Record<number, NotePlayerMeta>;
  excerptClamp?: 2 | 3;
  maxChars?: number;
};

const UserNoteCard = ({
  row,
  playerMetaById,
  excerptClamp = 2,
  maxChars = 120,
}: UserNoteCardProps) => {
  const href = `/player-database/player-profile/${row.playerId}`;
  const displayName = displayNotePlayerName(row, playerMetaById);
  const meta = playerMetaById[row.playerId];
  const when = formatNoteTimestamp(row.dateTime);
  const initials = noteInitials(displayName, row.playerId);
  const raw = row.note.trim();
  const preview =
    raw.length > maxChars ? `${raw.slice(0, maxChars).trim()}…` : raw;

  const timeLine = when ?? "No date saved";

  const ariaLabel = `${displayName}. Player ID ${row.playerId}. ${timeLine}. Open profile.`;

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      title={preview || undefined}
      className="group flex gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-purpleFill/50"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purplish/40 text-xs font-semibold text-white ring-1 ring-white/10"
        aria-hidden
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate group-hover:text-purpleFill transition-colors">
          {displayName}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <NoteIdCountryBadges
            playerId={row.playerId}
            countryRaw={meta?.country}
            flagWidth={20}
            flagHeight={14}
          />
        </div>

        <p className="text-xs text-textGrey mt-1.5 tabular-nums">{timeLine}</p>

        {preview ? (
          <p
            className={`text-sm text-white/70 leading-snug mt-1.5 ${
              excerptClamp === 2 ? "line-clamp-2" : "line-clamp-3"
            }`}
          >
            {preview}
          </p>
        ) : null}
      </div>
    </Link>
  );
};

export default UserNoteCard;
