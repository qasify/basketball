"use client";

import React, { MouseEvent, useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import Button from "@/components/Button";
import { RiPushpin2Fill } from "react-icons/ri";
import { FBPlayer, teamRosterDB, watchListDB } from "@/_api/firebase-api";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Priority } from "@/types/Player";
import TooltipIconButton from "@/components/TooltipIconButton";
import { TooltipProvider } from "@/components/Tooltip";
import Note from "@/components/Note";

export interface Player {
  id: string | number;
  name: string;
  type?: string;
  status?: string;
  team?: string;
  position?: string;
  age?: number;
  country?: string;
  image?: string;
  number?: number;
  height?: number;
  weight?: number;
  salary?: number;
  contract?: string;
}

// const players: Player[] = [
//   {
//     id: 1,
//     name: "Hermannsson Martin",
//     status: "Live",
//     type: "Medium",
//     image: "/images/players/1.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 2,
//     name: "Koumadje Christ",
//     status: "Schedule",
//     type: "Medium",
//     image: "/images/players/2.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 3,
//     name: "Mattisseck Jonas",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/3.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 4,
//     name: "Dorian Grosber",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/4.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 5,
//     name: "Delow Marte",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/5.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 6,
//     name: "Hermannsson Martin",
//     status: "Live",
//     type: "Medium",
//     image: "/images/players/1.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 7,
//     name: "Koumadje Christ",
//     status: "Schedule",
//     type: "Medium",
//     image: "/images/players/2.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 8,
//     name: "Mattisseck Jonas",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/3.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 9,
//     name: "Dorian Grosber",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/4.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 10,
//     name: "Delow Marte",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/5.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 11,
//     name: "Hermannsson Martin",
//     status: "Live",
//     type: "Medium",
//     image: "/images/players/1.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 12,
//     name: "Koumadje Christ",
//     status: "Schedule",
//     type: "Medium",
//     image: "/images/players/2.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 13,
//     name: "Mattisseck Jonas",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/3.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 14,
//     name: "Dorian Grosber",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/4.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 15,
//     name: "Delow Marte",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/5.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 16,
//     name: "Hermannsson Martin",
//     status: "Live",
//     type: "Medium",
//     image: "/images/players/1.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 17,
//     name: "Koumadje Christ",
//     status: "Schedule",
//     type: "Medium",
//     image: "/images/players/2.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 18,
//     name: "Mattisseck Jonas",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/3.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 19,
//     name: "Dorian Grosber",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/4.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
//   {
//     id: 20,
//     name: "Delow Marte",
//     status: "Upcoming",
//     type: "Medium",
//     image: "/images/players/5.png",
//     team: "Alba Berlin",
//     position: "Guard",
//     age: 29,
//     country: "USA",
//   },
// ];

interface Props {
  players: FBPlayer[];
  refreshPlayers: () => void;
}

const PlayerList: React.FC<Props> = ({ players, refreshPlayers }) => {
  const PLACEHOLDER_IMAGE =
    "https://img.freepik.com/premium-photo/basketball-player-logo-single-color-vector_1177187-50594.jpg";
  const [expandedId, setExpandedId] = useState<number | string | null>(null); // First item opened by default
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notePlayer, setNotePlayer] = useState<FBPlayer | null>(null);

  // eslint-disable-next-line
  const handleToggle = (id: number | string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handlePriorityChange = async (player: FBPlayer, priority: Priority) => {
    try {
      if (player) {
        const priorities: Priority[] = ["High", "Medium", "Low"];
        const currentIndex = priorities.indexOf(priority);
        const nextPriority = priorities[(currentIndex + 1) % priorities.length];

        await watchListDB.update({
          ...player,
          priority: nextPriority,
        });
        refreshPlayers();
      }
    } catch {
      console.error("Error updating Priority");
    }
  };

  const handleRemove = async (
    event: MouseEvent<HTMLDivElement>,
    player: FBPlayer
  ) => {
    event.stopPropagation();
    try {
      await watchListDB.remove(player.documentId);
      refreshPlayers();
    } catch {
      console.error("Error removing from watchlist");
    }
  };

  const handleAddToTeam = async (
    event: MouseEvent<HTMLDivElement>,
    player: FBPlayer
  ) => {
    event.stopPropagation();
    try {
      await teamRosterDB.add(player);
      // handleRemove(event, player);
      refreshPlayers();
    } catch {
      console.error("Error updating Priority");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNotePlayer(null);
  };

  const handleNoteClick = (player: FBPlayer) => {
    setNotePlayer(player);
    setIsModalOpen(true);
  };

  return (
    <div className="py-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.map((player) => {
        const isExpanded = player.id === expandedId;

        return (
          <div
            key={player.id}
            className={cn(
              "relative border border-borderDarkPurple rounded-lg bg-transparent text-white transition-all p-3",
              isExpanded && "bg-tileBackground"
            )}
          >
            {/* <button
              onClick={() => handleToggle(player?.id ?? "")}
              className="absolute text-purple-400 font-bold right-5"
            >
              {isExpanded ? <IoMdRemove size={22} /> : <IoMdAdd size={22} />}
            </button> */}
            <div className="flex items-center gap-3">
              <Image
                src={player?.image ?? PLACEHOLDER_IMAGE}
                alt={player.name}
                width={isExpanded ? 85 : 50}
                height={isExpanded ? 85 : 50}
                className="rounded border border-borderDarkPurple"
              />
              <div className="flex flex-row justify-between w-full">
                {/* <div className="flex gap-2">
                  <span
                    className={cn(
                      "text-[8px] border border-borderDarkPurple bg-borderPurple/20 px-2 py-0.5 rounded",
                      isExpanded && "text-lg"
                    )}
                  >
                    {player.status}
                  </span>
                  <span
                    className={cn(
                      "text-[8px] border border-borderDarkPurple bg-borderPurple/20 px-2 py-0.5 rounded",
                      isExpanded && "text-lg"
                    )}
                  >
                    {player.type}
                  </span>
                </div> */}
                <h3
                  className={cn(
                    "text-lg font-bold text-wrap break-words",
                    isExpanded && "text-[28px]"
                  )}
                >
                  {player.name}
                </h3>
                <TooltipProvider>
                  <div className="flex gap-2 items-center">
                    <Button
                      className="!py-1 !px-2 rounded bg-borderPurple/30 mr-4"
                      title={player.priority ?? "Medium"}
                      onClick={() =>
                        handlePriorityChange(
                          player,
                          player.priority ?? "Medium"
                        )
                      }
                    />
                    <TooltipIconButton
                      icon={<FaPlus className="text-white text-xs" size={10} />}
                      handleClick={(e) => handleAddToTeam(e, player)}
                      tooltip="Add to team"
                    />
                    <TooltipIconButton
                      icon={<FaEdit className="text-white text-xs" size={10} />}
                      handleClick={() => handleNoteClick(player)}
                      tooltip="Add note"
                    />
                    <TooltipIconButton
                      icon={
                        <FaTrash className="text-white text-xs" size={10} />
                      }
                      handleClick={(e) => handleRemove(e, player)}
                      tooltip="Remove from team"
                    />
                  </div>
                </TooltipProvider>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-5">
                <div className="flex flex-col gap-3 text-lg">
                  <div className="flex items-center justify-between border-b border-tileBackground">
                    <p className="text-gray-400">Team</p>
                    <p>{player.team}</p>
                  </div>
                  <div className="flex items-center justify-between border-b border-tileBackground">
                    <p className="text-gray-400">Position</p>
                    <p>{player.position}</p>
                  </div>
                  <div className="flex items-center justify-between border-b border-tileBackground">
                    <p className="text-gray-400">Age</p>
                    <p>{player.age}</p>
                  </div>
                  <div className="flex items-center justify-between border-b border-tileBackground">
                    <p className="text-gray-400">Country</p>
                    <p>{player.country}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400">Actions</p>
                    <div className="flex gap-2 items-center">
                      <Button
                        icon={<IoMdAdd size={18} />}
                        className="!p-2 h-[30px] w-[30px] flex justify-center items-center rounded"
                      />
                      <Button
                        icon={<IoMdRemove size={18} />}
                        className="!p-2 h-[30px] w-[30px] flex justify-center items-center rounded"
                      />
                      <Button
                        icon={<RiPushpin2Fill size={18} />}
                        className="!p-2 h-[30px] w-[30px] flex justify-center items-center rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <Note
        player={notePlayer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PlayerList;
