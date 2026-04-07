"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  /** From server: `USE_FIRESTORE_CATALOG` — catalog CRUD only when true */
  catalogCrudEnabled: boolean;
};

/**
 * Title row: "Player Database" + optional Add player (admin + Firestore catalog).
 * CTA styling aligned with dashboard Banner primary actions (violet / purpleFill).
 */
export default function PlayerDatabaseCatalogHeader({
  catalogCrudEnabled,
}: Props) {
  const { role, loading } = useAuth();
  const showAdd =
    catalogCrudEnabled && !loading && role === "admin";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <h2 className="text-white text-xl font-bold uppercase tracking-wide m-0">
        Player Database
      </h2>
      {showAdd && (
        <Link
          href="/player-database/add-player"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white border border-purpleFill/45 bg-purplish/35 hover:bg-purplish/55 hover:border-purpleFill/70 transition-colors focus:outline-none focus:ring-1 focus:ring-purpleFill focus:ring-offset-1 focus:ring-offset-borderPurple"
        >
          <UserPlus className="w-3.5 h-3.5 opacity-95 shrink-0" strokeWidth={2} aria-hidden />
          Add player
        </Link>
      )}
    </div>
  );
}
