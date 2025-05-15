"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ExpenseItem } from "../../_types/Expense";
import { getRandomNumber } from "@/utils/helpers/getRandomNumber";
import Button from "@/components/Button";
import { ChevronRight } from "lucide-react";

type ExpensesChartProps = {
  title?: string;
  data?: ExpenseItem[];
  total?: number;
  currency?: string;
  detailsButton?: React.ReactNode;
};

const ExpensesChart: React.FC<ExpensesChartProps> = ({
  title = "Most Expenses",
  data,
  total,
  currency = "$",
  detailsButton,
}) => {
  const [randomizedData, setRandomizedData] = useState<ExpenseItem[]>([]);

  useEffect(() => {
    const generatedData =
      data?.map((item) => ({
        ...item,
        value: getRandomNumber(400, 1000),
      })) || [];
    setRandomizedData(generatedData);
  }, [data]);

  const totalValue =
    total ?? randomizedData.reduce((acc, item) => acc + (item?.value ?? 0), 0);
  const topExpense = randomizedData?.[0];
  const topExpensePercentage = topExpense?.value
    ? ((topExpense?.value / totalValue) * 100).toFixed(0)
    : "-";

  //   // Handle loading state before random data is set
  //   if (!randomizedData.length) {
  //     return null; // or add a loading skeleton here
  //   }

  return (
    <div className="flex-1 flex flex-col justify-between gap-4 px-[10px] py-[15px] bg-white/5 rounded-[10px] text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-[500] ">{title}</h1>
        {detailsButton ?? (
          <Button
            title={"Details"}
            icon={<ChevronRight size={14} />}
            iconAlignment="right"
            className="!p-[5px] rounded-md border-purpleFill text-sm"
          />
        )}
      </div>

      {/* Chart */}
      <div className="relative flex justify-center items-center">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={randomizedData}
              dataKey="value"
              innerRadius={70}
              outerRadius={100}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {randomizedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute text-center">
          <div className="text-3xl font-bold">{topExpensePercentage}%</div>
          <div className="text-sm text-white/60">{topExpense?.name ?? ""}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {randomizedData.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm border-b border-white/20"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              {item.name}
            </div>
            <div>
              {item.value && currency}
              {item.value ?? "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensesChart;
