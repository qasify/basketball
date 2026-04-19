"use client";

import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { RefreshCw, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import {
  NOTES_USER_LIST_MAX,
  notesDB,
  type LatestNoteItem,
} from "@/_api/firebase-api";
import { displayNotePlayerName } from "../../_utils/notes";
import { useUserNotes } from "@/hooks/useUserNotes";
import NoteRowFull from "./rows/NoteRowFull";
import EditNoteModal from "./modals/EditNoteModal";
import DeleteNoteConfirmModal from "./modals/DeleteNoteConfirmModal";
import { TooltipProvider } from "@/components/Tooltip";

const DELETE_FAILED =
  "Couldn't delete this note. Check your connection and try again.";

const cardClass =
  "rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-[10px]";

export default function NotesPageView() {
  const { user, loading: authLoading } = useAuth();
  const { items, playerMetaById, loading, refresh } = useUserNotes(
    NOTES_USER_LIST_MAX
  );
  const [editing, setEditing] = useState<LatestNoteItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<LatestNoteItem | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const editLabel = editing
    ? displayNotePlayerName(editing, playerMetaById)
    : "";

  const pendingDeleteName = pendingDelete
    ? displayNotePlayerName(pendingDelete, playerMetaById)
    : "";

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await notesDB.remove(pendingDelete.firestoreId);
      refresh();
      setPendingDelete(null);
    } catch {
      setDeleteError(DELETE_FAILED);
      console.error("Failed to delete note");
    } finally {
      setDeleteLoading(false);
    }
  };

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
          Sign in to view and manage your notes.
        </p>
      </div>
    );
  }

  const who =
    user.displayName?.trim() ||
    user.email?.split("@")[0] ||
    "You";

  return (
    <>
      <div className={cardClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div>
            <h3 className="text-white/90 font-semibold text-sm">
              All notes
              {!loading && (
                <span className="text-textGrey font-normal ml-2">
                  ({items.length})
                </span>
              )}
            </h3>
            <p className="text-textGrey text-xs mt-1 max-w-xl leading-relaxed">
              Last saved time is stored when you save from here or from a player
              profile. Edit or delete any note below.
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
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
              onClick={() => refresh()}
              disabled={loading}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white transition-colors",
                "disabled:opacity-45 disabled:pointer-events-none"
              )}
              aria-label="Refresh notes list"
            >
              <RefreshCw className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-textGrey">
            <FaSpinner className="animate-spin text-purple-400" size={28} />
            <p className="text-sm">Loading notes…</p>
          </div>
        ) : items.length === 0 ? (
          <p className="text-textGrey text-sm py-6 text-center leading-relaxed">
            No notes yet. Add them from any player profile or your watchlist.
          </p>
        ) : (
          <TooltipProvider>
            <ul className="divide-y divide-white/10" role="list">
              {items.map((row) => (
                <NoteRowFull
                  key={row.firestoreId}
                  row={row}
                  playerMetaById={playerMetaById}
                  onEdit={() => setEditing(row)}
                  onRequestDelete={() => {
                    setDeleteError(null);
                    setPendingDelete(row);
                  }}
                />
              ))}
            </ul>
          </TooltipProvider>
        )}
      </div>

      <EditNoteModal
        row={editing}
        playerLabel={editLabel}
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        onSaved={refresh}
      />

      <DeleteNoteConfirmModal
        isOpen={Boolean(pendingDelete)}
        playerName={pendingDeleteName}
        onClose={() => {
          if (!deleteLoading) {
            setPendingDelete(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        errorMessage={deleteError}
      />
    </>
  );
}
