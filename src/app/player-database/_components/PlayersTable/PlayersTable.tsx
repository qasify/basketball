"use client";
import React, { FC, MouseEvent, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Player } from "@/_api/basketball-api";
import { SortDirection, TableColumn } from "@/types/Table";
import Link from "next/link";
import TooltipIconButton from "@/components/TooltipIconButton";
import {
  FaEdit,
  // FaPlus,
  FaStar,
} from "react-icons/fa";
import { TooltipProvider } from "@/components/Tooltip";
import Note from "@/components/Note";
import { watchListDB } from "@/_api/firebase-api";

interface PlayerTableProps {
  players: Player[];
}

const PlayersTable: FC<PlayerTableProps> = ({ players }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Player | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notePlayer, setNotePlayer] = useState<Player | null>(null);

  const handleSort = (key?: keyof Player) => {
    if (!key) return; // no key, do nothing
    if (sortBy === key) {
      // Same key clicked → toggle direction
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // New key clicked → set sortBy and reset direction to ascending
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  const sortedPlayers = React.useMemo(() => {
    if (!sortBy) return players;
    const sorted = [...players].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
    return sorted;
  }, [players, sortBy, sortDirection]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(players?.length / itemsPerPage);

  const paginatedPlayers = sortedPlayers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleAddToWatchList = async (
    event: MouseEvent<HTMLDivElement>,
    player: Player
  ) => {
    event.stopPropagation();
    try {
      await watchListDB.add(player);
    } catch {
      console.error("Error adding to watchlist");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNotePlayer(null);
  };

  const handleNoteClick = (player: Player) => {
    setNotePlayer(player);
    setIsModalOpen(true);
  };

  const playerColumns: TableColumn<Player & { action?: string }>[] = [
    {
      label: "Name",
      key: "name",
      isSortable: true,
      cellRenderer: (val, row) => (
        <Link href={`/player-database/player-profile/${row.id}`}>{String(val)}</Link>
      ),
    },
    { label: "Position", key: "position", isSortable: true },
    { label: "Age", key: "age", isSortable: true },
    { label: "Country", key: "country", isSortable: true },
    { label: "Height", key: "height", isSortable: true },
    { label: "Weight", key: "weight", isSortable: true },
    {
      label: "Seasons Played",
      key: "seasons",
      isSortable: false,
      cellRenderer: (val) => (Array.isArray(val) ? val.length : 0),
    },
    {
      label: "Action",
      key: "action",
      cellRenderer: (_, player) => {
        return (
          <TooltipProvider>
            <div className="flex gap-2">
              <TooltipIconButton
                tooltip="Add note"
                icon={<FaEdit className="text-white text-xs" size={10} />}
                handleClick={() => handleNoteClick(player)}
              />
              <TooltipIconButton
                tooltip="Add to watchlist"
                icon={<FaStar className="text-white text-xs" size={10} />}
                handleClick={(e) => handleAddToWatchList(e, player)}
              />
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  return (
    <div className="mt-8 space-y-5 overflow-x-auto">
      <Table
        columns={playerColumns}
        data={paginatedPlayers}
        className="border-none rounded-lg min-w-full"
        tableClass="min-w-max"
        headerClass="bg-borderPurple text-white"
        bodyClass="divide-y divide-transparent"
        onSort={handleSort}
        sortBy={sortBy}
        sortDirection={sortDirection}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
      <Note
        player={notePlayer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PlayersTable;
