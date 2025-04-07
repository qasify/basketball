import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { notesDB } from "@/_api/firebase-api";
import { Textarea } from "../TextArea";
import { Player } from "@/_api/basketball-api";

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
    if (player) {
      setNote("");
      const fetchedNote = await notesDB.get(player.id);
      setNote(fetchedNote);
    }
  };

  const handleSave = async () => {
    if (player) {
      try {
        await notesDB.add(player.id, note);
        onClose();
      } catch {
        console.error("Error adding note");
      }
    }
  };

  if (!isOpen || !player) return null;

  return (
    <div className="fixed w-[100vw] h-[100vh] inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div
        ref={ref}
        className="backdrop-blur-[10px] p-5 rounded-lg w-[500px] bg-card-radial text-white shadow-lg relative flex flex-col gap-4"
      >
        <div className="flex flex-col justify-between items-center gap-2">
          <h2 className="text-3xl">Notes for {player?.name}</h2>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter notes here..."
            className="min-h-[200px]"
          />
          <Button
            className="!py-2 rounded bg-white text-black"
            label="Save"
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
