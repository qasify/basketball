"use client";

import React, { MouseEvent, useMemo, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import { PositionFilter } from "../../_types";
import Accordion from "@/components/Accordion";
import { FaMinus } from "react-icons/fa";
import PlayerDetailsModal from "./PlayerDetailsModal";
import { FBPlayer, watchListDB } from "@/_api/firebase-api";
import { PLACEHOLDER_IMAGE } from "@/utils/constants/PlaceHolderImage";

interface WatchlistProps {
  title: string;
  filters: PositionFilter[];
  players: FBPlayer[];
  refreshPlayers: () => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ title, filters, players, refreshPlayers }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const [selectedPlayer, setSelectedPlayer] = useState<FBPlayer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPlayers = useMemo(() => {
    return selectedFilter
      ? players.filter((player) => player.position === selectedFilter)
      : players;
  }, [players, selectedFilter]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

  const handlePlayerClick = (player: FBPlayer) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  
  const handleRemove = async (
    event: MouseEvent<HTMLDivElement>,
    player: FBPlayer
  ) => {
    event.stopPropagation();
    try {
      await watchListDB.remove(player.documentId);
      refreshPlayers()
    } catch {
      console.error("Error removing from watchlist");
    }
  };

  return (
    <div className="bg-black p-5 rounded-lg shadow-lg bg-tileBackground border border-searchBorder">
      <Accordion
        title={title}
        containerClass="w-full"
        headerClass="text-white"
        contentClass=" rounded-lg"
      >
        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {filters.map((filter) => (
            <Button
              key={filter?.label}
              title={filter?.label as string}
              className={`!p-[6px] flex items-center justify-center w-10 h-9 text-white border border-buttonBorder rounded ${
                selectedFilter === filter?.value
                  ? "bg-purple-600"
                  : "border-buttonBorder"
              }`}
              onClick={() =>
                setSelectedFilter(
                  selectedFilter === filter?.value
                    ? null
                    : (filter?.value as string)
                )
              }
            />
          ))}
        </div>
        {/* Player List */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPlayers.map((player, index) => (
            <div
              key={`${index}${player?.id}`}
              className="flex items-center p-3 border border-borderDarkPurple rounded-lg gap-3 bg-gray-900 cursor-pointer"
              onClick={() => handlePlayerClick(player)}
            >
              <Image
                src={player?.image ?? PLACEHOLDER_IMAGE}
                alt={player?.name}
                height={48}
                width={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col text-white w-full">
                <div className="flex justify-between items-center w-full">
                  <h3 className="font-bold break-all break-words">
                    {player?.name}
                  </h3>
                  <Button
                    className="!p-2 text-white border-none text-xl"
                    icon={<FaMinus />}
                    onClick={(e) => handleRemove(e, player)}
                  />
                </div>
                <p className="text-sm text-wrap break-all break-words">
                  {player?.position} | Age: {player?.age} | Country:{" "}
                  {player?.country}
                </p>
              </div>
            </div>
          ))}
        </div>
        <PlayerDetailsModal
          player={selectedPlayer}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </Accordion>
    </div>
  );
};

export default Watchlist;
