"use client";
import Image from "next/image";
import Button from "@/components/Button";
import { FaEdit } from "react-icons/fa";
import { Player } from "@/_api/basketball-api";
import { MouseEvent } from "react";
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

  const seasonColumns: TableColumn<any>[] = [
    { label: "Season", key: "season", isSortable: true },
    { label: "League", key: "league", isSortable: true },
    { label: "Team", key: "team", isSortable: true },
    { label: "GP", key: "gamesPlayed", isSortable: true },
    { label: "GS", key: "gamesStarted", isSortable: true },
    { label: "MIN", key: "minutesPerGame", isSortable: true },
    { label: "PTS", key: "pointsPerGame", isSortable: true },
    { label: "REB", key: "reboundsPerGame", isSortable: true },
    { label: "AST", key: "assistsPerGame", isSortable: true },
    { label: "STL", key: "stealsPerGame", isSortable: true },
    { label: "BLK", key: "blocksPerGame", isSortable: true },
    { label: "TOV", key: "turnoversPerGame", isSortable: true },
    { label: "TS%", key: "tsPercent", isSortable: true },
    { label: "eFG%", key: "efgPercent", isSortable: true },
    { label: "ORB%", key: "orbPercent", isSortable: true },
    { label: "DRB%", key: "drbPercent", isSortable: true },
    { label: "TRB%", key: "trbPercent", isSortable: true },
    { label: "AST%", key: "astPercent", isSortable: true },
    { label: "TOV%", key: "tovPercent", isSortable: true },
    { label: "STL%", key: "stlPercent", isSortable: true },
    { label: "BLK%", key: "blkPercent", isSortable: true },
    { label: "USG%", key: "usgPercent", isSortable: true },
    { label: "ORtg", key: "offensiveRating", isSortable: true },
    { label: "DRtg", key: "defensiveRating", isSortable: true },
    { label: "PER", key: "playerEfficiencyRating", isSortable: true },
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
            <TextItem label="Seasons Played" value={player?.seasons?.length || 0} />
          </div>
        </div>
      </div>

      {/* Seasons and Stats */}
      {player?.seasons && player.seasons.length > 0 && (
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
                  data={player.seasons}
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
    </div>
  );
};

export default PlayerProfile;
