'use client'
import React, { useEffect, useState } from "react";
import RosterTable from "./_components/RosterManagement";
import RosterProgress from "./_components/RosterProgress";
import { redirect } from "next/navigation";
import Watchlist from "./_components/WatchList";
import { filters } from "./_utils/Watchlist";
import { FBPlayer, teamRosterDB, watchListDB } from "@/_api/firebase-api";

const progressData = {
  total: 125000,
  remaining: 15000,
};

const TeamManagement = () => {
  const [teamList, setTeamList] = useState<FBPlayer[]>([]);
  const [watchlist, setWatchlist] = useState<FBPlayer[]>([]);

  useEffect(() => {
    getPlayers();
  }, []);

  const getPlayers = async () => {
    const teamPlayers = await teamRosterDB.getAll();
    setTeamList(teamPlayers);
    const watchLsitPlayers = await watchListDB.getAll();
    setWatchlist(watchLsitPlayers);
  };

  const handleClick = async () => {
    redirect("/team-management/budget-tracking"); // Redirects to "/new-page"
  };

  return (
    <div className="flex flex-col px-8 py-5 gap-[30px]">
      <RosterTable players={teamList} refreshPlayers={getPlayers}/>
      <RosterProgress
        title="Team Roster"
        progress={
          ((progressData?.total - progressData?.remaining) /
            progressData?.total) *
          100
        } // Dynamic progress
        totalLabel="Total Salary"
        totalValue={progressData?.total} // Now a number
        remainingLabel="Remaining Salary"
        remainingValue={progressData?.remaining} // Now a number
        currency="$" // Pass any currency
        handleClick={handleClick} // Pass any function to handle click event
      />
      <Watchlist title="Watchlist" filters={filters} players={watchlist} refreshPlayers={getPlayers}/>
    </div>
  );
};

export default TeamManagement;
