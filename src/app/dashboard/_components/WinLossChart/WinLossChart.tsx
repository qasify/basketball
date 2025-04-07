"use client";
import React from "react";

type WinLossChartProps = {
  wins: number;
  losses: number;
};

const WinLossChart = ({ wins, losses }: WinLossChartProps) => {
  const total = wins + losses;
  const winPercentage = Math.round((wins / total) * 100);
  const lossPercentage = Math.round((losses / total) * 100);

  return (
    <div className="flex-1 flex flex-col gap-5 justify-between bg-tileBackground rounded-xl p-4 w-full">
      <h3 className="text-white font-bold uppercase text-2xl">Win/Losses</h3>

      {/* wins */}
      <div>
        <div className="flex justify-between text-white font-bold text-sm">
          <span>{wins} Wins</span>
          <span className="text-darkPurple">{winPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-darkGray rounded-full">
          <div
            className="bg-darkPurple h-2 rounded-full"
            style={{ width: `${winPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* losses */}
      <div>
        <div className="flex justify-between text-white font-bold text-sm">
          <span>{losses} Losses</span>
          <span className="text-purpleFill">{lossPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-darkGray rounded-full">
          <div
            className="bg-purpleFill h-2 rounded-full"
            style={{ width: `${lossPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-darkPurple"></div>
          <span className="text-white text-lg font-bold">{wins} Wins</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-purpleFill"></div>
          <span className="text-white text-lg font-bold">{losses} Losses</span>
        </div>
      </div>
    </div>
  );
};

export default WinLossChart;
