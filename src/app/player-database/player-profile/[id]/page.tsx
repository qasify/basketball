"use client";
import React, { useEffect, useState } from "react";
import PlayerProfile from "./_components/PlayerProfile";
// import PlayerDetails from "./_components/PlayerDetails";
import { useParams } from "next/navigation";
import { getPlayer, Player } from "@/_api/basketball-api";

const PlayerDatabase = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    fetchPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPlayer = async () => {
    const foundPlayer = await getPlayer(parseInt(id as string));
    setPlayer(foundPlayer);
  };

  return (
    <div className="flex flex-col gap-5 m-5 p-5 bg-white/5 rounded-lg">
      {player ? (
        <>
          {/* show top player content component here */}
          <PlayerProfile player={player} />

          {/* Tables here */}
          {/* <PlayerDetails /> */}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PlayerDatabase;
