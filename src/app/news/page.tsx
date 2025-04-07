import React from "react";
import NewsGrid from "./_components/NewsGrid";
import { NewsItem } from "./_types";

const News = () => {
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

  return <NewsGrid newsItems={newsItems} />;
};

export default News;
