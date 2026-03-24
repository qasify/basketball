import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

const PlayerDatabaseContent = dynamic(
  () => import("./_components/PlayerDatabaseContent"),
  {
    ssr: true,
    loading: () => <div className="min-h-[500px]" />,
  }
);

const PlayerDatabase = () => {
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
      <h2 className="text-white text-xl font-bold uppercase">
        Player Database
      </h2>
      <PlayerDatabaseContent />
    </div>
  );
};

export default PlayerDatabase;
