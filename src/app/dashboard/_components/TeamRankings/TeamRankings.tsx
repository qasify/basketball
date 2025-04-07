"use client";
import Table from "@/components/Table";
import {
  rankingColumns,
  rankingData,
  rankingsTypes,
} from "../../_utils/RankingsTable";
import RankingType from "./RankingType";
import { useState } from "react";
import { Ranking } from "../../_types";

const TeamRankings = () => {
  const [selectedRankingType, setSelectedRankingType] = useState<Ranking>(
    rankingsTypes?.[0]
  );

  const handleRankingTypeChange = (ranking: Ranking) => {
    setSelectedRankingType(ranking);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-2xl font-bold ">Team Rankings</h2>
        <div className="flex gap-3">
          {rankingsTypes?.map((ranking) => (
            <RankingType
              key={ranking?.id}
              ranking={ranking}
              isSelected={selectedRankingType?.id === ranking?.id}
              onClick={handleRankingTypeChange}
            />
          ))}
        </div>
      </div>
      <Table
        columns={rankingColumns}
        data={rankingData}
        className="border border-searchBorder rounded-lg"
        tableClass=""
        headerClass="bg-buttonBg text-white"
        bodyClass="divide-y divide-tileBackground bg-black bg-opacity-[0.5]"
      />
    </div>
  );
};

export default TeamRankings;
