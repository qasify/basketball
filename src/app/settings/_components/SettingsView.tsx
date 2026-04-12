"use client";

import Link from "next/link";
import { User, ChevronRight } from "lucide-react";

export default function SettingsView() {
  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <Link
        href="/profile"
        className="group flex w-full max-w-md items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-left transition-colors hover:border-purpleFill/35 hover:bg-purplish/10"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purplish/20 border border-purpleFill/25">
          <User className="w-4 h-4 text-purpleFill" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white font-medium text-xs">My Profile</p>
          <p className="text-textGrey text-[11px] mt-0.5 leading-snug">
            Name, password, account details
          </p>
        </div>
        <ChevronRight
          className="w-4 h-4 shrink-0 text-textGrey transition-transform group-hover:translate-x-0.5 group-hover:text-purpleFill"
          aria-hidden
        />
      </Link>
    </div>
  );
}
