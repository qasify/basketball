"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import React from "react";
import { IoIosSearch } from "react-icons/io";
import { Filters } from "../../_types/Filter";
import { Option } from "@/types/Select";
import Slider from "@/components/Slider";
import dynamic from "next/dynamic";

const MultiSelect = dynamic(() => import("@/components/Select/MultiSelect"), {
  ssr: false,
});

type WatchlistFiltersProps = {
  filters: Filters;
  clearFilters: ()=>void;
  handleFilterChange: (
    filterName: keyof Filters,
    newValues: Option[] | string | [number, number]
  ) => void;
};

export const priorityFilters: Option[] = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

const WatchListFilters: React.FC<WatchlistFiltersProps> = ({
  filters,
  clearFilters,
  handleFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-[9px]">
        <Input
          icon={<IoIosSearch size={20} />}
          iconPosition="left"
          placeholder="Search Player......."
          value={filters.searchText}
          onChange={(e) => handleFilterChange("searchText", e.target.value)}
          className="border-white/50 w-full border-white"
        />
        <Button
          label="Clear All Filters"
          className="!px-3 !py-0 rounded-md !min-w-max border-purpleFill flex !justify-center !items-center"
          onClick={clearFilters}
        />
      </div>

      <div className="flex gap-[9px] ">
        {/* age range */}
        <div className="space-y-4 flex-[4] min-h-full flex flex-col justify-between pb-3">
          <div className="flex items-center justify-between">
            <h2>Age (range)</h2>
            <div className="flex space-x-2">
              <Input
                type="number"
                min={14}
                max={filters?.ageRange[1]}
                value={filters?.ageRange[0]?.toString()}
                onChange={(e) =>
                  handleFilterChange("ageRange", [
                    parseInt(e.target.value),
                    filters?.ageRange[1],
                  ])
                }
                className="w-16 !p-0 !px-2 border-white"
              />
              <Input
                type="number"
                min={filters?.ageRange[0]}
                max={40}
                value={filters?.ageRange[1]?.toString()}
                onChange={(e) =>
                  handleFilterChange("ageRange", [
                    filters?.ageRange[0],
                    parseInt(e.target.value),
                  ])
                }
                className="w-16 !p-0 !px-2 border-white"
              />
            </div>
          </div>
          <Slider
            min={14}
            max={40}
            step={1}
            value={filters?.ageRange}
            onValueChange={(val) =>
              handleFilterChange("ageRange", val as [number, number])
            }
            className="w-full"
          />
        </div>

        {/* priority filter */}
        <div className="space-y-[10px] flex-1">
          <h2>Priorities</h2>
          <MultiSelect
            placeholder="Select Priorities..."
            value={filters.priorities}
            options={priorityFilters}
            className="min-w-full"
            onValueChange={(values) => handleFilterChange("priorities", values)}
            isMulti
          />
        </div>
      </div>
    </div>
  );
};

export default WatchListFilters;
