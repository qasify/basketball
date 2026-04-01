import React from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
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

      <header className="w-full border-b border-white/10 pb-8">
        <h1 className="text-white text-2xl font-bold uppercase tracking-wide sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-2 max-w-2xl text-textGrey text-sm leading-relaxed sm:text-base">
          Manage your display name, password, and account information in one place.
        </p>
      </header>

      <ProfileView />
    </div>
  );
};

export default ProfilePage;
