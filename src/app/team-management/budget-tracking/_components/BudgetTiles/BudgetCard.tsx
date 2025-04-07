import { cn } from "@/utils/cn";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface BudgetCardProps {
  title: string;
  amount: string;
  percentage?: string;
  positiveTrend?: boolean;
  isIncrease?: boolean;
  data?: { value: number }[];
  className?: string;
}

export default function BudgetCard({
  title,
  amount,
  percentage,
  isIncrease,
  data,
  positiveTrend,
  className,
}: BudgetCardProps) {
  return (
    <div
      className={cn(
        "border border-borderDarkPurple rounded-2xl p-4 flex-1 min-h-[200px]",
        "flex flex-col justify-between",
        className
      )}
    >
      {/* chart */}
      <div className="flex justify-between">
        <div
          className={cn(
            "flex items-center justify-center h-12 w-12 rounded-full",
            positiveTrend ? "bg-positive/10" : "bg-negative/10"
          )}
        >
          {positiveTrend ? (
            <FiArrowDownLeft className="text-positive" size={24} />
          ) : (
            <FiArrowUpRight className="text-negative" size={24} />
          )}
        </div>
        {data && (
          <div className="w-[150px] h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#A020F0"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* amount */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-white">
          {title}
        </div>
        <div className="flex items-center gap-3 text-white text-3xl font-bold">
          {amount}
          {percentage && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isIncrease ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {percentage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
