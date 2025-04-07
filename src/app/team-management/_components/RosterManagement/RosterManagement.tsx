"use client";
import Table from "@/components/Table";
import Accordion from "@/components/Accordion";
import { FBPlayer, teamRosterDB } from "@/_api/firebase-api";
import { TableColumn } from "@/types/Table";
import { Player } from "@/_api/basketball-api";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MouseEvent, useState } from "react";
import TooltipIconButton from "@/components/TooltipIconButton";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Note from "@/components/Note";
import PlayerDetailsModal from "../WatchList/PlayerDetailsModal";

interface RosterTableProps {
  players: FBPlayer[];
  refreshPlayers: () => void;
}

const RosterTable: React.FC<RosterTableProps> = ({
  players,
  refreshPlayers,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notePlayer, setNotePlayer] = useState<Player | null>(null);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPlayer(null);
  };

  const handleNoteClick = (event: MouseEvent<HTMLDivElement>, player: Player) => {
    event.stopPropagation();
    setNotePlayer(player);
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
    setNotePlayer(null);
  };

  const handleRemove = async (
    event: MouseEvent<HTMLDivElement>,
    player: FBPlayer
  ) => {
    event.stopPropagation();
    try {
      await teamRosterDB.remove(player.documentId);
      refreshPlayers();
    } catch {
      console.error("Error removing from team");
    }
  };

  const rosterColumns: TableColumn<Player & { action?: string }>[] = [
    { label: "Name", key: "name" },
    { label: "Position", key: "position" },
    { label: "Age", key: "age" },
    { label: "Salary", key: "salary" },
    { label: "Current Year", key: "contract" },
    {
      label: "Action",
      key: "action",
      cellRenderer: (_, row) => {
        return (
          <TooltipProvider>
            <div className="flex gap-2">
              <TooltipIconButton
                icon={<FaEdit className="text-white text-xs" size={10} />}
                handleClick={(e) => handleNoteClick(e, row as FBPlayer)}
                tooltip="Add note"
              />
              <TooltipIconButton
                icon={<FaTrash className="text-white text-xs" size={10} />}
                handleClick={(e) => handleRemove(e, row as FBPlayer)}
                tooltip="Remove from watchlist"
              />
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  return (
    <>
      <Accordion
        title="Roster Management"
        containerClass="w-full"
        headerClass="text-white"
        contentClass="border border-searchBorder rounded-lg"
      >
        <Table
          columns={rosterColumns}
          data={players}
          className="border border-searchBorder rounded-lg max-h-[500px]"
          tableClass=""
          headerClass="bg-borderPurple text-white"
          bodyClass="divide-y divide-tileBackground bg-tileBackground bg-opacity-[0.5]"
          onRowClick={handlePlayerClick}
        />
      </Accordion>
      <Note
        player={notePlayer}
        isOpen={isNoteModalOpen}
        onClose={handleCloseNoteModal}
      />
      <PlayerDetailsModal
        player={selectedPlayer}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </>
  );
};

export default RosterTable;
