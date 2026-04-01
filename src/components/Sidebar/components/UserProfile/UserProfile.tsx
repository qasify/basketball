"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";

interface UserProfileProps {
  name: string;
  email: string;
  handleLogout: () => void | Promise<void>;
}

export default function UserProfile({
  name,
  email,
  handleLogout,
}: UserProfileProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const isLoggedIn = Boolean(email);

  const displayName = name || email?.split("@")[0] || "User";

  const onLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await Promise.resolve(handleLogout());
    } finally {
      setLoggingOut(false);
    }
  };

  const profileHref = isLoggedIn ? "/profile" : "/login";

  return (
    <div className="flex w-full flex-col gap-3 border-t border-borderLight p-3 pt-6">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={profileHref}
              className="group flex w-full cursor-pointer items-center gap-3 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-purpleFill/50"
              aria-label="My Profile"
            >
              <Image
                src="/icons/avatar.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-sm font-medium capitalize text-white">
                  {isLoggedIn ? displayName : "Guest"}
                </p>
                <p className="truncate text-xs text-textGrey">
                  {isLoggedIn ? email : "Not signed in"}
                </p>
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={8}
            className="border border-white/15 bg-nav-gradient text-xs text-white shadow-lg"
          >
            My Profile
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isLoggedIn ? (
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="group flex w-full items-center justify-center gap-2 rounded-lg border border-borderPurple bg-purplish/10 px-3 py-2 text-sm text-white transition-colors hover:border-purpleFill/60 hover:bg-purplish/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut
            className="h-4 w-4 shrink-0 text-textGrey transition-colors group-hover:text-purpleFill"
            aria-hidden
          />
          {loggingOut ? "Signing out…" : "Log out"}
        </button>
      ) : (
        <Link
          href="/login"
          className="flex w-full items-center justify-center rounded-lg border border-borderPurple bg-purplish/10 px-3 py-2 text-sm text-white transition-colors hover:border-purpleFill/60 hover:bg-purplish/20"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}
