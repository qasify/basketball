import React from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { User } from "lucide-react";
import ProfileView from "./_components/ProfileView";

const ProfilePage = () => {
  return (
    <div className="w-full min-w-0 flex flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
      <Link
        href="/settings"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
        aria-label="Back to Settings"
      >
        <IoMdArrowRoundBack size={20} className="shrink-0" />
        Back to Settings
      </Link>

      <header className="w-full border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purpleFill/30 bg-gradient-to-br from-purplish/25 to-white/[0.06] text-purpleFill sm:h-11 sm:w-11">
            <User className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={2} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-white text-xl font-bold uppercase tracking-wide sm:text-2xl">
              My Profile
            </h1>
            <p className="mt-1 max-w-2xl text-textGrey text-xs leading-snug sm:text-sm">
              Manage your display name, password, and account information in one place.
            </p>
          </div>
        </div>
      </header>

      <ProfileView />
    </div>
  );
};

export default ProfilePage;
