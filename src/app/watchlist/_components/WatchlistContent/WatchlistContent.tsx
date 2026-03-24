"use client";
import React, { useEffect, useMemo, useState } from "react";
import WatchListFilters from "../WatchlistFilters";
import { Filters, SortOption, SortOrder } from "../../_types/Filter";
import { Option } from "@/types/Select";
import PlayerList from "../PlayerList";
import { FBPlayer, watchListDB } from "@/_api/firebase-api";
import { initialFilters, defaultSortState } from "../../_utils/constants";

const WatchlistContent = () => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sort, setSort] = useState(defaultSortState);
  const [watchlist, setWatchlist] = useState<FBPlayer[]>([]);

  const handleFilterChange = (
    filterName: keyof Filters,
    newValues: Option[] | string | [number, number]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: newValues,
    }));
  };

  const handleSortChange = (newSortBy: SortOption, newSortOrder: SortOrder) => {
    setSort({ sortBy: newSortBy, sortOrder: newSortOrder });
  };

  useEffect(() => {
    getWatchlistPlayers();
  }, []);

  const getWatchlistPlayers = async () => {
    const players = await watchListDB.getAll();
    setWatchlist(players);
  };

  const filteredAndSortedWatchlist = useMemo(() => {
    const filtered = watchlist.filter(
      (player) =>
        (player.name
          .toLowerCase()
          .includes(filters.searchText.toLowerCase()) ||
          player.team
            ?.toLowerCase()
            .includes(filters.searchText.toLowerCase())) &&
        (!player.age ||
          (player.age >= filters.ageRange[0] &&
            player.age <= filters.ageRange[1])) &&
        (filters.priorities.length === 0 ||
          filters.priorities.some((p) => p.value === player.priority)) &&
        (filters.positions.length === 0 ||
          filters.positions.some(
            (p) =>
              String(p.value).toLowerCase() ===
                String(player.position || "").toLowerCase() ||
              String(p.label).toLowerCase() ===
                String(player.position || "").toLowerCase()
          ))
    );

    return [...filtered].sort((a, b) => {
      let aVal: string | number | undefined;
      let bVal: string | number | undefined;
      switch (sort.sortBy) {
        case "name":
          aVal = a.name ?? "";
          bVal = b.name ?? "";
          break;
        case "age":
          aVal = a.age ?? 0;
          bVal = b.age ?? 0;
          break;
        case "team":
          aVal = a.team ?? "";
          bVal = b.team ?? "";
          break;
        case "position":
          aVal = a.position ?? "";
          bVal = b.position ?? "";
          break;
        default:
          return 0;
      }
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      const cmp =
        sort.sortBy === "age"
          ? (Number(aVal) - Number(bVal)) * (sort.sortOrder === "asc" ? 1 : -1)
          : aStr.localeCompare(bStr) * (sort.sortOrder === "asc" ? 1 : -1);
      return cmp;
    });
  }, [watchlist, filters, sort]);

  return (
    <div>
      <WatchListFilters
        filters={filters}
        sortBy={sort.sortBy}
        sortOrder={sort.sortOrder}
        handleFilterChange={handleFilterChange}
        clearFilters={() => setFilters(initialFilters)}
        onSortChange={handleSortChange}
      />
      <PlayerList
        players={filteredAndSortedWatchlist}
        refreshPlayers={getWatchlistPlayers}
      />
    </div>
  );
};

export default WatchlistContent;
