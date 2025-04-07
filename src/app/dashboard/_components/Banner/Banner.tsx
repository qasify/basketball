import React from "react";
import { Banner as BannerType } from "../../_types";

type BannerProps = BannerType;

const Banner: React.FC<BannerProps> = ({
  title,
  subTitle,
  imageUrl = "/images/home/banner1.png",
}) => {
  return (
    <div
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="relative w-full h-[312px] md:h-[312px] bg-bannerOverlay rounded-xl overflow-hidden"
    >
      {/* Text Content */}
      <div className="relative z-10 max-w-[50%] flex flex-col justify-center h-full px-6 md:px-12 text-white">
        <h1 className="text-2xl md:text-4xl font-bold uppercase">{title}</h1>
        <p className="mt-2 md:mt-4 text-sm md:text-lg max-w-lg">{subTitle}</p>
      </div>
    </div>
  );
};

export default Banner;
