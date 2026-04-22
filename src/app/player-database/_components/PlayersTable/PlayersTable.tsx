"use client";
import React, { FC, MouseEvent, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Player } from "@/_api/basketball-api";
import { SortDirection, TableColumn } from "@/types/Table";
import Link from "next/link";
import TooltipIconButton from "@/components/TooltipIconButton";
import { FaEdit, FaStar, FaTrash, FaStickyNote } from "react-icons/fa";
import { TooltipProvider } from "@/components/Tooltip";
import Note from "@/components/Note";
import { watchListDB } from "@/_api/firebase-api";
import { notify } from "@/lib/notify";
import {
  toastMessage,
  watchlistAddedDesc,
  watchlistAlreadyDesc,
} from "@/utils/constants/toastMessage";
import { getAuth } from "firebase/auth";
import { deleteCatalogPlayerAction } from "@/_api/catalog-player-actions";
import CatalogPlayerEditModal from "../CatalogPlayerEditModal";

interface PlayerTableProps {
  players: Player[];
  /** Firestore catalog CRUD (admin + USE_FIRESTORE_CATALOG) */
  catalogCrud?: {
    enabled: boolean;
    onInvalidate: () => void;
  };
}

const PlayersTable: FC<PlayerTableProps> = ({ players, catalogCrud }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Player | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notePlayer, setNotePlayer] = useState<Player | null>(null);
  const [catalogEditPlayer, setCatalogEditPlayer] = useState<Player | null>(
    null
  );
  const [catalogEditOpen, setCatalogEditOpen] = useState(false);

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
  const totalPages = Math.max(1, Math.ceil(players?.length / itemsPerPage));

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
      const result = await watchListDB.add(player);
      if (result === "added") {
        notify.success(toastMessage.watchlist.addedTitle, {
          description: watchlistAddedDesc(player.name),
        });
      } else if (result === "duplicate") {
        notify.info(toastMessage.watchlist.alreadyTitle, {
          description: watchlistAlreadyDesc(player.name),
        });
      } else {
        notify.warning(toastMessage.watchlist.signInTitle, {
          description: toastMessage.watchlist.signInDesc,
        });
      }
    } catch {
      notify.error(toastMessage.watchlist.updateErrorTitle, {
        description: toastMessage.watchlist.updateErrorDesc,
      });
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

  const handleCatalogEdit = (player: Player) => {
    setCatalogEditPlayer(player);
    setCatalogEditOpen(true);
  };

  const handleCatalogDelete = async (player: Player) => {
    if (!catalogCrud?.enabled) return;
    if (
      !window.confirm(
        `Delete "${player.name}" from the Firestore catalog? This removes all season rows for this player.`
      )
    ) {
      return;
    }
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        alert("Sign in required.");
        return;
      }
      const res = await deleteCatalogPlayerAction(token, player);
      if (!res.ok) {
        alert(res.error);
        return;
      }
      catalogCrud.onInvalidate();
    } catch {
      alert("Delete failed.");
    }
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
    // {
    //   label: "Seasons Played",
    //   key: "seasons",
    //   cellRenderer: (val) => (Array.isArray(val) ? val.length : 0),
    // },
    {
      label: "",
      key: "action",
      cellRenderer: (_, player) => {
        return (
          <TooltipProvider>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <TooltipIconButton
                tooltip="Add note"
                icon={<FaStickyNote className="text-white text-xs" size={10} />}
                handleClick={() => handleNoteClick(player)}
              />
              <TooltipIconButton
                tooltip="Add to watchlist"
                icon={<FaStar className="text-white text-xs" size={10} />}
                handleClick={(e) => handleAddToWatchList(e, player)}
              />
              {catalogCrud?.enabled && (
                <>
                  <TooltipIconButton
                    tooltip="Edit player"
                    icon={<FaEdit className="text-white text-xs" size={10} />}
                    handleClick={() => handleCatalogEdit(player)}
                  />
                  <TooltipIconButton
                    tooltip="Delete from catalog"
                    icon={<FaTrash className="text-red-300 text-xs" size={10} />}
                    handleClick={() => handleCatalogDelete(player)}
                  />
                </>
              )}
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
      <CatalogPlayerEditModal
        player={catalogEditPlayer}
        isOpen={catalogEditOpen}
        onClose={() => {
          setCatalogEditOpen(false);
          setCatalogEditPlayer(null);
        }}
        onSaved={() => catalogCrud?.onInvalidate()}
      />
    </div>
  );
};

export default PlayersTable;
