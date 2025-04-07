// components/NewsGrid.tsx
import React from "react";
import Image from "next/image";
import { truncateText } from "@/utils/helpers/truncateText";
import { NewsItem } from "../../_types";

interface NewsGridProps {
  newsItems: NewsItem[];
}

const NewsGrid: React.FC<NewsGridProps> = ({ newsItems }) => {
  return (
    <div className="flex flex-col gap-5 p-6 text-white">
      <h2 className="text-2xl">Latest News</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsItems.map((item) => (
          <div key={item.id} className="overflow-hidden flex flex-col gap-3">
            <div className="relative h-auto">
              <Image
                src={item.image}
                alt={item.title}
                // width={359}
                // height={0}
                // style={{ height: "auto" }}
                layout="responsive"
                width={359}
                height={200}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-normal text-[22px] uppercase text-center">
                {item.title}
              </h3>
              <p className="text-lg text-subtitle text-center">
                {truncateText(item.description, 70)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;
