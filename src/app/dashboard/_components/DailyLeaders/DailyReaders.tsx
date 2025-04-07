"use client";
import { useMemo, useState } from "react";
import DailyLeadersCard from "./DailyReadersCard";
import { Leader, StatCategory } from "../../_types";

const statCategories: StatCategory[] = [
  { label: "PTS", key: "points" },
  { label: "REB", key: "rebounds" },
  { label: "AST", key: "assists" },
];

const leadersData: Record<string, Leader[]> = {
  points: [
    {
      name: "Milenko Veljkovic",
      team: "Serhedci",
      value: 50,
      rebounds: 22,
    },
    {
      name: "Bubnys",
      team: "Marijampoles",
      value: 49,
      rebounds: 20,
    },
    { name: "Sinkevicius", team: "Zalgiris II", value: 35, rebounds: 10 },
  ],
  rebounds: [
    { name: "Cockfield Jr.", team: "Koblenz", value: 34, rebounds: 24 },
    { name: "Yilmaz", team: "Aliaga Petkim", value: 33, rebounds: 22 },
    {
      name: "Milenko Veljkovic",
      team: "Serhedci",
      value: 27,
      rebounds: 21,
    },
  ],
  assists: [
    { name: "Smith", team: "Lakers", value: 22, rebounds: 25 },
    {
      name: "Milenko Veljkovic",
      team: "Serhedci",
      value: 20,
      rebounds: 21,
    },
    { name: "Johnson", team: "Warriors", value: 18, rebounds: 21 },
  ],
};

const DailyReaders = () => {
  const [activeCategory, setActiveCategory] = useState("rebounds");

  const leaders = useMemo(
    () => leadersData[activeCategory]?.sort((a, b) => b?.value - a?.value),
    [activeCategory]
  );

  const topPlayer = useMemo(
    () =>
      leaders?.sort((a, b) =>
        a?.rebounds && b?.rebounds
          ? b?.rebounds - a?.rebounds
          : a?.value - b?.value
      )?.[0],
    [leaders]
  );

  return (
    <DailyLeadersCard
      title="Daily Leaders"
      imageUrl="/images/home/dailyLeader.png"
      playerName={topPlayer?.name}
      playerInfo={`${topPlayer?.team} | 218-C-1995 | Rebounds: ${topPlayer?.rebounds}`}
      statCategories={statCategories}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      leaders={leaders}
      date="January 23, 2025"
    />
  );
};

export default DailyReaders;
