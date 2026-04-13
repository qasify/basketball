"use client";

import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";
import Button from "@/components/Button";
import { notesDB } from "@/_api/firebase-api";
import { Textarea } from "../TextArea";
import { Player } from "@/_api/basketball-api";
import { notify } from "@/lib/notify";
import {
  noteSavedDesc,
  toastMessage,
} from "@/utils/constants/toastMessage";

type NoteModalProps = {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
};

const NoteModal = ({
  player,
  isOpen,
  onClose,
}: NoteModalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, onClose);

  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen && player) fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, player]);

  const fetchNote = async () => {
    if (!player) return;
    try {
      const notes = await notesDB.get(player.id);
      const existing = Array.isArray(notes) && notes.length > 0 ? notes[0] : null;
      setNote((existing as { note?: string })?.note ?? "");
    } catch {
      setNote("");
      notify.error(toastMessage.notes.loadErrorTitle, {
        description: toastMessage.notes.loadErrorDesc,
      });
    }
  };

  const handleSave = async () => {
    if (player) {
      try {
        await notesDB.add(player.id, note, player.name);
        notify.success(toastMessage.notes.savedTitle, {
          description: noteSavedDesc(player.name),
        });
        onClose();
      } catch {
        notify.error(toastMessage.notes.saveErrorTitle, {
          description: toastMessage.notes.saveErrorDesc,
        });
      }
    }
  };

  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={ref}
        className="backdrop-blur-[10px] p-6 rounded-xl w-[500px] max-w-[calc(100vw-2rem)] border border-purplish bg-card-radial text-white shadow-xl flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-3">
          Notes for {player?.name}
        </h2>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter notes here..."
          className="min-h-[200px] rounded-lg border border-white/30 bg-white/5 text-white placeholder:text-white/50 p-3 text-sm resize-y focus:border-purplish focus:ring-1 focus:ring-purplish/50 outline-none transition-colors"
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button
            icon={<Save className="w-4 h-4 shrink-0" aria-hidden />}
            label="Save"
            onClick={handleSave}
            className="!px-5 !py-2.5 !bg-purplish hover:!bg-purpleFill !text-white !border-purpleFill/50 rounded-lg transition-colors w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
