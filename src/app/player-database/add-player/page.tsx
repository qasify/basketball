import React from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { UserPlus } from "lucide-react";
import AddCatalogPlayerForm from "../_components/AddCatalogPlayerForm";

const catalogOn =
  process.env.USE_FIRESTORE_CATALOG === "true" ||
  process.env.USE_FIRESTORE_CATALOG === "1";

export default function AddPlayerPage() {
  return (
    <div className="w-full min-w-0 flex flex-col gap-5 py-4 sm:py-5 px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
      <Link
        href="/player-database"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
        aria-label="Back to Player Database"
      >
        <IoMdArrowRoundBack size={20} className="shrink-0" />
        Back to Player Database
      </Link>

      <header className="w-full border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purpleFill/30 bg-gradient-to-br from-purplish/25 to-white/[0.06] text-purpleFill sm:h-11 sm:w-11">
            <UserPlus className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={2} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-white text-xl font-bold uppercase tracking-wide sm:text-2xl">
              Add player
            </h1>
            <p className="mt-1 text-textGrey text-xs leading-snug sm:text-sm sm:max-w-3xl">
              League, team, and profile. Import stats merge when RealGM ID matches your Excel rows.
            </p>
          </div>
        </div>
      </header>

      {!catalogOn ? (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-950/20 px-4 py-3 text-sm text-amber-100/90 max-w-2xl">
          Firestore catalog is disabled on the server (
          <code className="text-white/90">USE_FIRESTORE_CATALOG</code>). Enable
          it to create catalog players.
        </div>
      ) : (
        <AddCatalogPlayerForm />
      )}
    </div>
  );
}
