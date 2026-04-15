"use client";

import React, { MouseEvent, useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";
// import { IoMdAdd, IoMdRemove } from "react-icons/io";
// import Button from "@/components/Button";
// import { RiPushpin2Fill } from "react-icons/ri";
import { FBPlayer, notesDB, watchListDB } from "@/_api/firebase-api";
import {
  FaEdit,
  FaRegTrashAlt,
  FaTrash,
} from "react-icons/fa";
import { Priority } from "@/types/Player";
import TooltipIconButton from "@/components/TooltipIconButton";
import { TooltipProvider } from "@/components/Tooltip";
// import Note from "@/components/Note";
import iso3166 from "iso-3166-1";
import Link from "next/link";
import { COUNTRY_FLAG_ALIASES } from "@/utils/constants/countryFlagAliases";
import { useRouter } from "next/navigation";
import Note from "@/components/Note";
import type { Player } from "@/_api/basketball-api";

// export interface Player {
//   id: string | number;
//   name: string;
//   type?: string;
//   status?: string;
//   team?: string;
//   position?: string;
//   age?: number;
//   country?: string;
//   image?: string;
//   number?: number;
//   height?: number;
//   weight?: number;
//   salary?: number;
//   contract?: string;
// }

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
  const router = useRouter();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const PLACEHOLDER_IMAGE =
    "https://img.freepik.com/premium-photo/basketball-player-logo-single-color-vector_1177187-50594.jpg";

  // const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
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

  // const handleAddToTeam = async (
  //   event: MouseEvent<HTMLDivElement>,
  //   player: FBPlayer
  // ) => {
  //   event.stopPropagation();
  //   try {
  //     await teamRosterDB.add(player);
  //     // handleRemove(event, player);
  //     refreshPlayers();
  //   } catch {
  //     console.error("Error updating Priority");
  //   }
  // };

  const handleNoteClick = (event: MouseEvent<HTMLDivElement>, player: FBPlayer) => {
    event.stopPropagation();
    setSelectedPlayer(player);
    setIsNoteOpen(true);
  };

  const handleDeleteNote = async (
    event: MouseEvent<HTMLDivElement>,
    player: FBPlayer
  ) => {
    event.stopPropagation();
    try {
      await notesDB.remove(player.id);
      refreshPlayers();
    } catch {
      console.error("Error deleting note");
    }
  };

  /**
   * Normalize catalog country labels to a 2-letter code for flagcdn.
   * Handles aliases and multi-country strings like "USA / Nigeria".
   */
  const getCountryCode = (countryName?: string | null): string | null => {
    if (!countryName) return null;
    const primaryCountry = countryName.split(/[\/,]/)[0]?.trim();
    if (!primaryCountry) return null;
    const normalized = primaryCountry.toLowerCase().trim();
    const aliasCode =
      COUNTRY_FLAG_ALIASES[normalized] ??
      COUNTRY_FLAG_ALIASES[normalized.replace(/\./g, "")];
    if (aliasCode) return aliasCode.toLowerCase();

    const fromName = iso3166.whereCountry(primaryCountry)?.alpha2;
    if (fromName) return fromName.toLowerCase();

    // Support when source already stores "US"/"GB" or "USA"/"GBR".
    const fromAlpha2 = iso3166.whereAlpha2(primaryCountry.toUpperCase())?.alpha2;
    if (fromAlpha2) return fromAlpha2.toLowerCase();
    const fromAlpha3 = iso3166.whereAlpha3(primaryCountry.toUpperCase())?.alpha2;
    return fromAlpha3?.toLowerCase() ?? null;
  };

  return (
    <div className="flex flex-col gap-4 pt-4">
      {players.map((player) => (
        <div
          key={player.id}
          className="relative border border-borderDarkPurple rounded-lg bg-transparent transition-all p-4 cursor-pointer"
          onClick={() => router.push(`/player-database/player-profile/${player.id}`)}
        >
          <div className="flex items-start gap-4">
            <Image
              src={player?.image ?? PLACEHOLDER_IMAGE}
              alt={player.name}
              width={60}
              height={60}
              className="rounded-full border-2 border-borderDarkPurple"
            />
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-start w-full mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-white">
                      {player.name}
                    </h3>

                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-full cursor-pointer",
                        player.priority === "High"
                          ? "bg-red-500/20 text-red-400"
                          : player.priority === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : player.priority === "Low"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray/20 text-gray"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePriorityChange(player, player.priority ?? "Medium");
                      }}
                    >
                      •{player.priority && " "}
                      {player.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const countryCode = getCountryCode(player.country);
                      if (!countryCode) return null;
                      return (
                        <Image
                          src={`https://flagcdn.com/w20/${countryCode}.png`}
                          width={20}
                          height={15}
                          alt={countryCode.toUpperCase()}
                        />
                      );
                    })()}
                    <span className="text-sm font-bold">{player.position}</span>
                    <span className="text-sm">•</span>
                    <span className="text-sm">{player.country}</span>
                    <span className="text-sm">•</span>
                    <span className="text-sm">{player.age}</span>
                  </div>
                </div>
                <TooltipProvider>
                  <div className="flex gap-2">
                    {/* <TooltipIconButton
                      icon={<FaPlus className="text-white" size={14} />}
                      handleClick={(e) => handleAddToTeam(e, player)}
                      tooltip="Add to team"
                    /> */}
                    <TooltipIconButton
                      icon={<FaEdit className="text-white" size={14} />}
                      handleClick={(e) => handleNoteClick(e, player)}
                      tooltip={player.notes?.length ? "Edit note" : "Add note"}
                    />
                    <TooltipIconButton
                      icon={<FaTrash className="text-red-500" size={14} />}
                      handleClick={(e) => handleRemove(e, player)}
                      tooltip="Remove from watchlist"
                    />
                  </div>
                </TooltipProvider>
              </div>

              {player.notes &&
                player.notes.map((note, index) => (
                  <div
                    className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-[10px]"
                    key={index}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm leading-relaxed text-textGrey">
                        {note.note}
                      </p>
                      <TooltipProvider>
                        <TooltipIconButton
                          icon={
                            <FaRegTrashAlt className="text-red-300" size={13} />
                          }
                          handleClick={(e) => handleDeleteNote(e, player)}
                          tooltip="Delete note"
                        />
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
      {players.length === 0 && (
        <div className="items-center w-full flex flex-col gap-2">
          No players found. Try adjusting filters or adding players from the
          Player Database
          <Link
            href="player-database"
            className="flex justify-between gap-[10px] bg-borderPurple/30 items-center py-[10px] px-[15px] border border-borderPurple cursor-pointer"
          >
            Browse player database
          </Link>
        </div>
      )}
      <Note
        isOpen={isNoteOpen}
        onClose={() => {
          setIsNoteOpen(false);
          setSelectedPlayer(null);
          refreshPlayers();
        }}
        player={selectedPlayer}
      />
    </div>
  );
};

export default PlayerList;
