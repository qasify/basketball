"use client";
import React, { useState } from "react";
import Table from "@/components/Table";
import {
  categoryBreakDownColumns,
  categoryBreakDownData,
} from "../../_utils/Category";
import SelectWrapper from "@/components/Select";

const yearOptions = [
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
];

const monthOptions = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const CategoryBreakDown = () => {
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    yearOptions?.[0]?.value
  );
  const [selectedmonth, setSelectedMonth] = useState<string | undefined>(
    monthOptions?.[0]?.value
  );

  return (
    <div className="flex flex-col gap-4 p-5 bg-white/5 rounded-[10px]">
      <div className="flex justify-between items-center border-purpleFill">
        <h2 className="text-white text-xl font-bold">Category Breakdown</h2>
        <div className="flex gap-[10px]">
          <SelectWrapper
            options={monthOptions}
            value={selectedmonth}
            onChange={setSelectedMonth}
            placeholder="Select Month"
            className="w-[150px]"
          />
          <SelectWrapper
            options={yearOptions}
            value={selectedYear}
            onChange={setSelectedYear}
            placeholder="Select Year"
            className="w-[130px]"
          />
        </div>
      </div>
      <Table
        columns={categoryBreakDownColumns}
        data={categoryBreakDownData}
        className="border-none rounded-lg max-h-[500px]"
        tableClass=""
        headerClass="bg-borderPurple text-white"
        bodyClass="divide-y divide-tileBackground bg-tileBackground bg-opacity-[0.5]"
      />
    </div>
  );
};

export default CategoryBreakDown;
