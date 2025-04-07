"use client";
import { SortDirection } from "@/types/Table";
import { CSSProperties } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa6";

type TableHeaderProps = {
  label: string;
  isSortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  headerRenderer?: (label: string) => React.ReactNode;
  isSortActive?: boolean;
  headerStyle?: CSSProperties;
};

const TableHeader = ({
  label,
  isSortable = false,
  sortDirection,
  onSort,
  headerRenderer,
  isSortActive,
  headerStyle,
}: TableHeaderProps) => {
  return (
    <th
      className={`px-4 py-3 text-sm text-left font-semibold select-none ${
        isSortable ? "cursor-pointer hover:text-purple-400" : ""
      }`}
      onClick={isSortable ? onSort : undefined}
      style={headerStyle}
    >
      <div className="flex items-center gap-2">
        {headerRenderer ? headerRenderer(label) : label}
        {isSortable && (
          <div className="flex flex-col items-center">
            <FaSortUp
              size={14}
              className={`transition-all ${
                isSortActive && sortDirection === "asc"
                  ? "text-purple-500"
                  : "text-gray-500"
              }`}
            />
            <FaSortDown
              size={14}
              className={`transition-all ${
                isSortActive && sortDirection === "desc"
                  ? "text-purple-500"
                  : "text-gray-500"
              }`}
            />
          </div>
        )}
      </div>
    </th>
  );
};

export default TableHeader;
