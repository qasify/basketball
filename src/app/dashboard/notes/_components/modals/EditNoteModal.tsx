"use client";

import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Textarea } from "@/components/TextArea";
import { notesDB, type LatestNoteItem } from "@/_api/firebase-api";
import NoteModalLayout from "./NoteModalLayout";

type EditNoteModalProps = {
  row: LatestNoteItem | null;
  playerLabel: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const SAVE_FAILED =
  "Couldn’t save your note. Check your connection and try again.";

const EditNoteModal = ({
  row,
  playerLabel,
  isOpen,
  onClose,
  onSaved,
}: EditNoteModalProps) => {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && row) {
      setText(row.note ?? "");
      setSaveError(null);
    }
  }, [isOpen, row]);

  const handleSave = async () => {
    if (!row) return;
    setSaving(true);
    setSaveError(null);
    try {
      await notesDB.add(row.playerId, text, playerLabel);
      onSaved();
      onClose();
    } catch {
      setSaveError(SAVE_FAILED);
      console.error("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !row) return null;

  return (
    <NoteModalLayout
      isOpen
      onClose={onClose}
      titleId="edit-note-title"
      title={<>Edit note — {playerLabel}</>}
      closeBlocked={saving}
      maxWidthClassName="max-w-lg"
      footerBorderClassName="border-purpleFill/25"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex items-center justify-center min-w-[96px] rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600 transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!saving) void handleSave();
            }}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 min-w-[96px] rounded-lg bg-purpleFill px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purpleFill"
          >
            <Save className="w-4 h-4 shrink-0 opacity-90" aria-hidden />
            {saving ? "Saving…" : "Save"}
          </button>
        </>
      }
    >
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter notes here..."
        className="min-h-[200px] rounded-lg border border-purpleFill/30 bg-purplish/15 text-white placeholder:text-white/45 p-3 text-sm resize-y focus:border-purpleFill/55 focus:ring-1 focus:ring-purpleFill/30 outline-none transition-colors"
      />
      {saveError ? (
        <p role="alert" className="text-sm text-red-300/95 leading-relaxed">
          {saveError}
        </p>
      ) : null}
    </NoteModalLayout>
  );
};

export default EditNoteModal;
