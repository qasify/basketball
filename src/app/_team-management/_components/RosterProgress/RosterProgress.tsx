"use client";

type RosterProgressProps = {
  title: string;
  progress: number; // Value from 0 to 100
  totalLabel: string;
  totalValue: number; // Now a number
  remainingLabel: string;
  remainingValue: number; // Now a number
  currency?: string; // Currency symbol ($, €, etc.)
  containerClass?: string;
  progressBarClass?: string;
  labelClass?: string;
  handleClick?: () => void;
};

const RosterProgress = ({
  title,
  progress,
  totalLabel,
  totalValue,
  remainingLabel,
  remainingValue,
  currency = "$", // Default currency
  containerClass = "",
  progressBarClass = "",
  labelClass = "",
  handleClick,
}: RosterProgressProps) => {
  // Format numbers as currency
  const formatCurrency = (value: number) => {
    return `${currency}${value.toLocaleString()}`;
  };

  return (
    <div className="bg-tileBackground py-5 px-4 rounded-[10px]">
      <div
        onClick={handleClick}
        className={`cursor-pointer flex flex-col py-5 px-[10px] rounded-[5px] border border-dashed  border-textLight gap-3 w-full ${containerClass}`}
      >
        {/* Title */}
        <h2 className="text-white text-lg font-bold uppercase">{title}</h2>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-darkGray rounded-full">
          <div
            className={`h-3 bg-purpleFill rounded-full ${progressBarClass}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Labels */}
        <div
          className={`flex justify-between text-white text-sm ${labelClass}`}
        >
          <span>
            {totalLabel}: {formatCurrency(totalValue)}
          </span>
          <span>
            {remainingLabel}: {formatCurrency(remainingValue)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RosterProgress;
