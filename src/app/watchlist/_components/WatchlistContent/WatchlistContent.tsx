"use client";
import React, { useEffect, useState } from "react";
import WatchListFilters from "../WatchlistFilters";
import { Filters } from "../../_types/Filter";
import { Option } from "@/types/Select";
import PlayerList from "../PlayerList";
import { FBPlayer, watchListDB } from "@/_api/firebase-api";

const initialFilters: Filters = {
  priorities: [],
  ageRange: [14, 40],
  searchText: "",
  // �� Add more filters here easily as needed
};
const WatchlistContent = () => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
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

  useEffect(() => {
    getWatchlistPlayers();
  }, []);

  const getWatchlistPlayers = async () => {
    const players = await watchListDB.getAll();
    setWatchlist(players);
  };

  const filteredWatchlist = watchlist.filter(
    (player) =>
      (player.name.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        player.team
          ?.toLowerCase()
          .includes(filters.searchText.toLowerCase())) &&
      (!player.age ||
        (player.age >= filters.ageRange[0] &&
          player.age <= filters.ageRange[1])) &&
      (filters.priorities.length === 0 ||
        filters.priorities.find((p) => p.value === player.priority))
  );

  return (
    <div>
      <WatchListFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        clearFilters={() => setFilters(initialFilters)}
      />
      <PlayerList players={filteredWatchlist} refreshPlayers={getWatchlistPlayers}/>
    </div>
  );
};

export default WatchlistContent;
