"use client";
import React from "react";
import BudgetCard from "./BudgetCard";

const spentGraphData = [
  { value: 120 },
  { value: 80 },
  { value: 140 },
  { value: 60 },
  { value: 150 },
  { value: 90 },
  { value: 160 },
  { value: 70 },
  { value: 130 },
  { value: 110 },
];

const remainingGraphData = [
  { value: 50 },
  { value: 80 },
  { value: 100 },
  { value: 90 },
  { value: 120 },
  { value: 110 },
  { value: 130 },
  { value: 125 },
  { value: 140 },
  { value: 180 },
];

const BudgetTiles = () => {
  return (
    <div className="flex gap-4">
      <BudgetCard
        title="Total Budget"
        amount="$16,058.94"
        positiveTrend={true}
      />
      <BudgetCard
        title="Spent Amount"
        amount="$6,240.28"
        percentage="-2%"
        isIncrease={false}
        positiveTrend={true}
        data={spentGraphData}
      />
      <BudgetCard
        title="Remaining Budget"
        amount="$2,910.28"
        percentage="+18%"
        isIncrease={true}
        positiveTrend={false}
        data={remainingGraphData}
      />
    </div>
  );
};

export default BudgetTiles;
