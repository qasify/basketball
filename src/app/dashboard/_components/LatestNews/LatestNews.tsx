import React from "react";

import Image from "next/image";

import { NewsItem } from "@/app/news/_types";
import { truncateText } from "@/utils/helpers/truncateText";

const newsItems: NewsItem[] = [
  {
    id: 1,
    image: "/images/news/1.png",
    title: "Team A Clinches Victory Match",
    description:
      "Team A won their latest game with a nail-biting finish. Find out how.............",
  },
  {
    id: 2,
    image: "/images/news/2.png",
    title: "Player X Breaks Scoring Record!",
    description:
      "Player X scored a career-high 45 points in a stunning performance against Team Y",
  },
  {
    id: 3,
    image: "/images/news/3.png",
    title: "MVP Candidates for This Season",
    description:
      "The league reveals the top MVP contenders, with Player X and Player Z ",
  },
  {
    id: 4,
    image: "/images/news/4.png",
    title: "john Doe Scores Career-High 45 Points",
    description:
      "In a thrilling game against The Warriors, John Doe led the team to victory....",
  },
  {
    id: 5,
    image: "/images/news/5.png",
    title: " Kevin Young for 3 Years Contract",
    description:
      "Kevin Young joins the team on a 3-year contract, expected to bring energy....",
  },
  {
    id: 6,
    image: "/images/news/6.png",
    title: "Your Team vs. The Lakers",
    description:
      "A much-anticipated matchup against The Lakers promises...............",
  },
  {
    id: 7,
    image: "/images/news/1.png",
    title: "Team A Clinches Victory Match",
    description:
      "Team A won their latest game with a nail-biting finish. Find out how.............",
  },
  {
    id: 8,
    image: "/images/news/2.png",
    title: "Player X Breaks Scoring Record!",
    description:
      "Player X scored a career-high 45 points in a stunning performance against Team Y",
  },
  {
    id: 9,
    image: "/images/news/3.png",
    title: "MVP Candidates for This Season",
    description:
      "The league reveals the top MVP contenders, with Player X and Player Z ",
  },
  {
    id: 10,
    image: "/images/news/4.png",
    title: "john Doe Scores Career-High 45 Points",
    description:
      "In a thrilling game against The Warriors, John Doe led the team to victory....",
  },
  {
    id: 11,
    image: "/images/news/5.png",
    title: " Kevin Young for 3 Years Contract",
    description:
      "Kevin Young joins the team on a 3-year contract, expected to bring energy....",
  },
  {
    id: 12,
    image: "/images/news/6.png",
    title: "Your Team vs. The Lakers",
    description:
      "A much-anticipated matchup against The Lakers promises...............",
  },
];

const LatestNews = () => {
  return (
    <div className="flex flex-col overflow-auto gap-4 flex-1">
      <h1 className="text-2xl">Latest News</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsItems?.slice(0, 6).map((item) => (
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

export default LatestNews;
