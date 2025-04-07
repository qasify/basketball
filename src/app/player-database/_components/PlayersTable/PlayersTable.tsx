"use client";
import React, { FC, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Player } from "@/_api/basketball-api";
import { TableColumn } from "@/types/Table";
import Link from "next/link";
import TooltipIconButton from "@/components/TooltipIconButton";
import { FaEdit, FaPlus, FaStar } from "react-icons/fa";
import { TooltipProvider } from "@/components/Tooltip";

interface PlayerTableProps {
  players: Player[];
}

const PlayersTable: FC<PlayerTableProps> = ({ players }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(players?.length / itemsPerPage);

  const paginatedPlayers = players?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const playerColumns: TableColumn<Player & { action?: string }>[] = [
    {
      label: "Name",
      key: "name",
      cellRenderer: (val, row) => (
        <Link href={`/player-database/player-profile/${row.id}`}>{val}</Link>
      ),
    },
    { label: "Position", key: "position" },
    { label: "Age", key: "age" },
    { label: "Country", key: "country" },
    { label: "Team", key: "team" },
    {
      label: "Action",
      key: "action",
      cellRenderer: () => {
        return (
          <TooltipProvider>
            <div className="flex gap-2">
              <TooltipIconButton
                tooltip="Add to team"
                icon={<FaPlus className="text-white text-xs" size={10} />}
                handleClick={() => {}}
              />
              <TooltipIconButton
                tooltip="Add note"
                icon={<FaEdit className="text-white text-xs" size={10} />}
                handleClick={() => {}}
              />
              <TooltipIconButton
                tooltip="Add to watchlist"
                icon={<FaStar className="text-white text-xs" size={10} />}
                handleClick={() => {}}
              />
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  return (
    <div className="mt-8 space-y-5">
      <Table
        columns={playerColumns}
        data={paginatedPlayers}
        className="border-none rounded-lg"
        tableClass=""
        headerClass="bg-borderPurple text-white"
        bodyClass="divide-y divide-transparent"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default PlayersTable;
