"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import SelectWrapper from "@/components/Select";
import Input from "@/components/Input";

const categoryOptions = [
  { value: "1", label: "Category 1" },
  { value: "2", label: "Category 2" },
  { value: "3", label: "Category 3" },
];

const QuickTransaction = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-col gap-4 px-[10px] py-[15px] bg-white/5 rounded-[10px] text-white">
      <h1 className="font-[500] ">QuickTransaction</h1>

      {/* values */}
      <div className="space-y-4">
        <SelectWrapper
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Catgeory........"
          className="w-full border-white/50"
        />
        <Input
          placeholder="Amount Here........."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border-white/50 w-full"
        />
      </div>

      {/* add button */}
      <Button
        title={"Add"}
        className="!p-2 rounded-md border-searchBorder !justify-center !items-center bg-headerBg/20 text-xs"
      />
    </div>
  );
};

export default QuickTransaction;
