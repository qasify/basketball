"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartData } from "../../_types";

type PerformanceChartProps = { data: ChartData[] };

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <div className="flex-[2] flex flex-col gap-5 bg-tileBackground rounded-xl p-4 w-full">
      <h3 className="text-white font-bold uppercase text-2xl">
        Team Performance
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="date" tick={{ fill: "#fff" }} />
          <YAxis tick={{ fill: "#fff" }} />
          <Tooltip
            cursor={{ fill: "transparent" }} // Removes hover effect on bars
            contentStyle={{
              backgroundColor: "#1E1E2E", // Dark tooltip background
              borderRadius: "8px",
              border: "none",
              color: "#FFFFFF", // Tooltip text color
              padding: "10px",
            }}
            itemStyle={{ color: "#B037FF" }} // Tooltip item text color
          />
          {/* Single Bar with dynamic colors */}
          <Bar dataKey="performance" barSize={40} radius={[5, 5, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                style={{ cursor: "pointer" }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
