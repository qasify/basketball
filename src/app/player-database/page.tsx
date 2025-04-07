"use server";
import React from "react";
import dynamic from "next/dynamic";

const PlayerDatabaseContent = dynamic(
  () => import("./_components/PlayerDatabaseContent"),
  {
    ssr: true,
    loading: () => <>Loading...</>,
  }
);

const PlayerDatabase = () => {
  return (
    <div className="flex flex-col gap-5 m-5 p-5 bg-white/5 rounded-lg">
      <h2 className="text-white text-xl font-bold uppercase">
        Player Database
      </h2>
      <PlayerDatabaseContent />
    </div>
  );
};

export default PlayerDatabase;
