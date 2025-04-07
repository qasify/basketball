import React from "react";
import { Ranking } from "../../_types";
import { cn } from "@/utils/cn";

type RankingTypeProps = {
  ranking: Ranking;
  isSelected?: boolean;
  onClick?: (ranking: Ranking) => void;
};

const RankingType: React.FC<RankingTypeProps> = ({
  ranking,
  onClick,
  isSelected = false,
}) => {
  return (
    <div
      className={cn(
        "border border-transparent bg-rankingTypeBg px-2 py-1 rounded-sm cursor-pointer",
        isSelected ? "border-searchBorder" : "border-transparent"
      )}
      onClick={() => onClick?.(ranking)}
    >
      {ranking?.value}
    </div>
  );
};

export default RankingType;
