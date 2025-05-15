import Image from "next/image";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useRef } from "react";
import Button from "@/components/Button";
import { FaEdit } from "react-icons/fa";
import { Player } from "@/_api/basketball-api";

type PlayerDetailsModalProps = {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
};

const PlayerDetailsModal = ({
  player,
  isOpen,
  onClose,
}: PlayerDetailsModalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, onClose);
  if (!isOpen || !player) return null;

  const TextItem = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number;
  }) => {
    return (
      <p className="flex justify-between items-center border-b border-tileBackground text-sm">
        <span>{label}:</span> {value ?? "N/A"}
      </p>
    );
  };

  return (
    <div className="fixed w-[100vw] h-[100vh] inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div
        ref={ref}
        className="backdrop-blur-[10px] p-5 rounded-lg w-[500px] bg-card-radial text-white shadow-lg relative flex flex-col gap-4"
      >
        <div className="relative h-auto">
          <Image
            // src={player?.image}
            src={"/images/players/player.png"}
            alt={player?.name}
            layout="responsive"
            width={359}
            height={200}
          />
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl">{player?.name}</h2>
          <Button className="!p-2 rounded" icon={<FaEdit size={18} />} />
        </div>
        <div className="flex flex-col gap-2">
          <TextItem label="Position" value={player?.position} />
          <TextItem label="Country" value={player?.country} />
          <TextItem label="Age" value={player?.age} />
          <TextItem label="Number" value={player?.number} />
          <TextItem label="Height" value={player?.height} />
          <TextItem label="Weight" value={player?.weight} />
          <TextItem label="Salary" value={player?.salary} />
          <TextItem label="Contract" value={player?.contract} />
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailsModal;
