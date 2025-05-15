"use client";
import Image from "next/image";
import Button from "@/components/Button";
import { FaEdit } from "react-icons/fa";
import { Player } from "@/_api/basketball-api";
import { MouseEvent } from "react";
import { watchListDB } from "@/_api/firebase-api";

type PlayerProfileModalProps = {
  player: Player | null;
};

const PlayerProfile = ({ player }: PlayerProfileModalProps) => {
  const handleAddToWatchList = async (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (player) {
      try {
        await watchListDB.add(player);
      } catch {
        console.error("Error adding to watchlist");
      }
    }
  };

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
    <div className="flex backdrop-blur-[10px] p-5 rounded-lg w-full bg-transparent border border-purplish text-white shadow-lg gap-4">
      <div className="relative h-auto flex-1">
        <Image
          // src={player?.image}
          src={"/images/players/player.png"}
          alt={player?.name ?? ""}
          layout="responsive"
          width={359}
          height={200}
        />
      </div>
      <div className="flex flex-col flex-1 gap-5 justify-between">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl">{player?.name}</h2>
          <div className="flex gap-4">
            <Button className="!p-2" onClick={handleAddToWatchList} label="Add to Watchlist"/>
            <Button className="!p-2 rounded" icon={<FaEdit size={18} />} />
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-2 justify-between">
          <TextItem label="Position" value={player?.position} />
          <TextItem label="Country" value={player?.country} />
          <TextItem label="Age" value={player?.age} />
          <TextItem label="Number" value={player?.number} />
          <TextItem label="Height" value={player?.height} />
          <TextItem label="Weight" value={player?.weight} />
          <TextItem label="Status" value={player?.salary} />
          <TextItem label="Contract" value={player?.contract} />
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
