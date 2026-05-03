"use client";

import React from "react";
import Link from "next/link";
import { List, Users } from "lucide-react";
import { Banner as BannerType } from "../../_types";
import { DASHBOARD_IMAGES } from "../../_utils/constants";
import { useAuth } from "@/hooks/useAuth";

const Banner: React.FC<BannerType> = (
  {
    // title,
    // subTitle,
    imageUrl,
  },
) => {
  const { user } = useAuth();
  const bannerImage = imageUrl ?? DASHBOARD_IMAGES.banner;

  return (
    // <div
    //   style={{
    //     backgroundImage: `url(${imageUrl})`,
    //     backgroundRepeat: "no-repeat",
    //     backgroundPosition: "center",
    //     backgroundSize: "cover",
    //   }}
    //   className="relative w-full h-[312px] md:h-[312px] bg-bannerOverlay rounded-xl overflow-hidden"
    // >
    //   {/* Text Content */}
    //   <div className="relative z-10 max-w-[50%] flex flex-col justify-center h-full px-6 md:px-12 text-white">
    //     <h1 className="text-2xl md:text-4xl font-bold uppercase">{title}</h1>
    //     <p className="mt-2 md:mt-4 text-sm md:text-lg max-w-lg">{subTitle}</p>
    //   </div>
    // </div>
    <div
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="relative w-full min-h-[280px] md:min-h-[320px] rounded-xl overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-[280px] md:min-h-[320px] px-6 py-8 md:px-12 md:py-10 max-w-xl">
        <p className="text-subtitle text-sm md:text-base uppercase tracking-wider mb-1">
          Your court. Your picks.
        </p>
        <h1 className="text-2xl md:text-4xl lg:text-[2.5rem] font-bold text-white tracking-tight">
          Welcome back
          {user ? (
            <span className="text-whiteLight">, {user.displayName?.split("@")[0]}</span>
          ) : null}
        </h1>
        <p className="text-whiteLight text-sm md:text-base mt-2 mb-6 max-w-md">
          Jump to your watchlist or explore the player database.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/watchlist"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-purplish/60 hover:bg-purpleFill/90 border border-purpleFill/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purpleFill focus:ring-offset-2 focus:ring-offset-borderPurple"
          >
            <List className="w-4 h-4" aria-hidden />
            View watchlist
          </Link>
          <Link
            href="/player-database"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-headerBg/60 hover:bg-headerBg/90 border-2 border-purpleFill transition-colors focus:outline-none focus:ring-2 focus:ring-purpleFill focus:ring-offset-2 focus:ring-offset-borderPurple"
          >
            <Users className="w-4 h-4" aria-hidden />
            Go to player database
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
