"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
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
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors w-fit"
        aria-label="Back to Dashboard"
      >
        <IoMdArrowRoundBack size={20} className="shrink-0" />
        Back to Dashboard
      </Link>
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
