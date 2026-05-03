"use client";

import React from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { LatestNoteItem } from "@/_api/firebase-api";
import type { NotePlayerMeta } from "../../../_types";
import {
  displayNotePlayerName,
  formatNotePlayerExtras,
  formatNoteTimestamp,
} from "../../../_utils/notes";
import NoteIdCountryBadges from "../../../_components/LatestNotes/_components/NoteIdCountryBadges";
import NotePlayerAvatar from "../../../_components/LatestNotes/_components/NotePlayerAvatar";
import TooltipIconButton from "@/components/TooltipIconButton";

type Props = {
  row: LatestNoteItem;
  playerMetaById: Record<number, NotePlayerMeta>;
  onEdit: () => void;
  /** Opens app confirmation modal — parent performs delete */
  onRequestDelete: () => void;
};

const NoteRowFull = ({
  row,
  playerMetaById,
  onEdit,
  onRequestDelete,
}: Props) => {
  const profileHref = `/player-database/player-profile/${row.playerId}`;
  const displayName = displayNotePlayerName(row, playerMetaById);
  const meta = playerMetaById[row.playerId];
  const when = formatNoteTimestamp(row.dateTime);
  const extras = formatNotePlayerExtras(meta);

  return (
    <li className="py-4 first:pt-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between gap-y-3">
        <div className="flex gap-3 min-w-0 flex-1">
          <NotePlayerAvatar
            imageUrl={meta?.image}
            alt={displayName}
            size="md"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2 gap-y-1">
              <Link
                href={profileHref}
                className="text-sm font-semibold text-purpleFill hover:underline truncate"
              >
                {displayName}
              </Link>
              <NoteIdCountryBadges
                playerId={row.playerId}
                countryRaw={meta?.country}
                flagWidth={20}
                flagHeight={15}
                countryPillClassName="max-w-[14rem]"
              />
            </div>
            {extras ? (
              <p className="text-xs text-textGrey leading-relaxed">{extras}</p>
            ) : null}
            <p className="text-xs text-textGrey">
              <span className="text-white/60">Last saved:</span>{" "}
              {when ?? "Not on file — edit and save to add a timestamp"}
            </p>
            {row.note?.trim() ? (
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white/85 whitespace-pre-wrap break-words">
                {row.note}
              </div>
            ) : (
              <p className="text-sm text-textGrey italic">Empty note</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 sm:pt-0.5">
          <TooltipIconButton
            tooltip="Edit note"
            icon={
              <FaEdit className="text-white text-xs" size={12} aria-hidden />
            }
            handleClick={onEdit}
          />
          <TooltipIconButton
            tooltip="Delete note"
            icon={
              <FaTrash
                className="text-red-300/90 text-xs"
                size={12}
                aria-hidden
              />
            }
            handleClick={onRequestDelete}
          />
        </div>
      </div>
    </li>
  );
};

export default NoteRowFull;
