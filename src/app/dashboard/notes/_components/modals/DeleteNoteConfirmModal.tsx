"use client";

import React from "react";
import NoteModalLayout from "./NoteModalLayout";

type DeleteNoteConfirmModalProps = {
  isOpen: boolean;
  playerName: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  /** Shown when delete fails (e.g. network). */
  errorMessage?: string | null;
};

const DeleteNoteConfirmModal = ({
  isOpen,
  playerName,
  onClose,
  onConfirm,
  loading = false,
  errorMessage = null,
}: DeleteNoteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <NoteModalLayout
      isOpen
      onClose={onClose}
      titleId="delete-note-title"
      title={<>Delete note for {playerName}?</>}
      closeBlocked={loading}
      maxWidthClassName="max-w-md"
      footerBorderClassName="border-white/10"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center min-w-[96px] rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/[0.1] transition-colors disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purpleFill/40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!loading) void onConfirm();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center min-w-[96px] rounded-lg border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/25 transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400/40"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </>
      }
    >
      <p className="text-sm text-textGrey leading-relaxed">
        This removes your saved note. You can&apos;t undo it.
      </p>
      {errorMessage ? (
        <p role="alert" className="text-sm text-red-300/95 leading-relaxed">
          {errorMessage}
        </p>
      ) : null}
    </NoteModalLayout>
  );
};

export default DeleteNoteConfirmModal;
