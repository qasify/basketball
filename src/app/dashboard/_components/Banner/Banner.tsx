import React from "react";
import { Banner as BannerType } from "../../_types";
import Link from "next/link";

type BannerProps = BannerType;

const Banner: React.FC<BannerProps> = ({
  // title,
  // subTitle,
  // imageUrl = "/images/home/banner1.png",
}) => {
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
        // backgroundImage: `url(${imageUrl})`,
        backgroundImage: 'url(/images/home/banner3.png)',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      //h-[312px] md:h-[312px]
      className="relative w-full h-[312px] bg-bannerOverlay rounded-xl overflow-hidden"
    >
      {/* Text Content */}
      <div className="relative z-10 max-w-[50%] flex flex-col justify-center h-full px-6 md:px-12 text-white">
        <h1 className="text-2xl md:text-4xl font-bold uppercase">
          Welcome back, (user name)
        </h1>
        <div className="flex gap-4 flex-wrap">
          <Link href='/watchlist' className="px-4 border border-searchBorder bg-buttonBg hover:bg-purple-600 text-white py-1 rounded-md">
            View watchlist
          </Link>
          <Link href='/player-database' className="px-4 border border-searchBorder bg-buttonBg hover:bg-purple-600 text-white py-1 rounded-md">
            Go to player database
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
