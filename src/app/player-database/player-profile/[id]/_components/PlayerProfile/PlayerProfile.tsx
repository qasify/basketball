"use client";
import Image from "next/image";
import Button from "@/components/Button";
import { FaEdit, FaStickyNote } from "react-icons/fa";
import { Player } from "@/_api/basketball-api";
import { MouseEvent, useMemo, useState } from "react";
import { watchListDB } from "@/_api/firebase-api";
import {
  AccordionContainer,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import Table from "@/components/Table";
import { TableColumn } from "@/types/Table";
import ScoutingReport from "../ScoutingReport";
import Note from "@/components/Note";

/** Parse season string "2024-25" or "2021-22 *" to year number for sorting. */
function parseSeasonYear(season: string): number {
  const match = /^(\d{4})/.exec(String(season || "").trim());
  return match ? parseInt(match[1], 10) : 0;
}

type PlayerProfileModalProps = {
  player: Player | null;
};

const PlayerProfile = ({ player }: PlayerProfileModalProps) => {
  const [isNoteOpen, setIsNoteOpen] = useState(false);

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

  /** Seasons sorted latest (e.g. 2024-25) to oldest (e.g. 2020-21). */
  const sortedSeasons = useMemo(() => {
    if (!player?.seasons?.length) return [];
    return [...player.seasons].sort(
      (a, b) => parseSeasonYear(b.season) - parseSeasonYear(a.season)
    );
  }, [player?.seasons]);

  const seasonColumns: TableColumn<any>[] = [
    { label: "Season", key: "season", isSortable: true },
    { label: "League", key: "league", isSortable: true },
    { label: "Team", key: "team", isSortable: true },
    { label: "GP", key: "gamesPlayed", isSortable: true },
    { label: "GS", key: "gamesStarted", isSortable: true },
    { label: "MIN", key: "minutesPerGame", isSortable: true },
    { label: "PTS", key: "pointsPerGame", isSortable: true },
    { label: "FGM", key: "fieldGoalsMade", isSortable: true },
    { label: "FGA", key: "fieldGoalsAttempted", isSortable: true },
    { label: "FG%", key: "fieldGoalPercent", isSortable: true },
    { label: "3PM", key: "threePointersMade", isSortable: true },
    { label: "3PA", key: "threePointersAttempted", isSortable: true },
    { label: "3P%", key: "threePointPercent", isSortable: true },
    { label: "FTM", key: "freeThrowsMade", isSortable: true },
    { label: "FTA", key: "freeThrowsAttempted", isSortable: true },
    { label: "FT%", key: "freeThrowPercent", isSortable: true },
    { label: "OFF", key: "offensiveRebounds", isSortable: true },
    { label: "DEF", key: "defensiveRebounds", isSortable: true },
    { label: "TRB", key: "reboundsPerGame", isSortable: true },
    { label: "AST", key: "assistsPerGame", isSortable: true },
    { label: "STL", key: "stealsPerGame", isSortable: true },
    { label: "BLK", key: "blocksPerGame", isSortable: true },
    { label: "TOV", key: "turnoversPerGame", isSortable: true },
    { label: "PF", key: "personalFouls", isSortable: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex backdrop-blur-[10px] p-5 rounded-lg w-full bg-transparent border border-purplish text-white shadow-lg gap-4">
        {player?.image && (
          <div className="relative h-auto flex-1">
            <Image
              src={player.image}
              alt={player?.name ?? ""}
              layout="responsive"
              width={359}
              height={200}
            />
          </div>
        )}
        <div className="flex flex-col flex-1 gap-5 justify-between">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl">{player?.name}</h2>
            <div className="flex gap-4 flex-wrap">
              <Button className="!p-2 rounded-lg" onClick={handleAddToWatchList} label="Add to Watchlist" />
              <Button
                className="!p-2 rounded-lg"
                icon={<FaStickyNote size={18} />}
                label="Notes"
                onClick={() => setIsNoteOpen(true)}
              />
              <Button className="!p-2 rounded-lg" icon={<FaEdit size={18} />} />
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-2 justify-between">
            <TextItem label="Position" value={player?.position} />
            <TextItem label="Country" value={player?.country} />
            <TextItem label="Age" value={player?.age} />
            {/* <TextItem label="Number" value={player?.number} /> */}
            <TextItem label="Height" value={player?.height} />
            <TextItem label="Weight" value={player?.weight} />
            {/* <TextItem label="Status" value={player?.salary} /> */}
            <TextItem label="Contract" value={player?.contract} />
            <TextItem label="Agency" value={player?.agency} />
            {/* Task 10: Seasons Played commented out */}
            {/* <TextItem label="Seasons Played" value={player?.seasons?.length || 0} /> */}
          </div>
        </div>
      </div>

      {/* Seasons and Stats */}
      {sortedSeasons.length > 0 && (
        <div className="backdrop-blur-[10px] p-5 rounded-lg w-full bg-transparent border border-purplish text-white shadow-lg">
          <AccordionContainer
            type="single"
            collapsible
            className="w-full border-0"
            defaultValue="seasons"
          >
            <AccordionItem value="seasons" className="border-0">
              <AccordionTrigger className="flex flex-row-reverse justify-end gap-4 hover:no-underline text-xl">
                Career Seasons & Statistics
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Table
                  columns={seasonColumns}
                  data={sortedSeasons}
                  className="border-none rounded-lg min-w-full"
                  tableClass="min-w-max"
                  headerClass="bg-borderPurple text-white"
                  bodyClass="divide-y divide-transparent"
                />
              </AccordionContent>
            </AccordionItem>
          </AccordionContainer>
        </div>
      )}

      {/* AI Scouting Report */}
      <ScoutingReport player={player} />

      <Note
        player={player}
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
      />
    </div>
  );
};

export default PlayerProfile;
