"use client";
import React, { useState } from "react";
import Table from "@/components/Table";
import {
  recentTransactionColumns,
  recentTransactionData,
} from "../../_utils/Transaction";
import SelectWrapper from "@/components/Select";
import Button from "@/components/Button";
import { ChevronRight } from "lucide-react";

const transactionOptions = [
  { value: "1", label: "All Account" },
  { value: "2", label: "Type 1" },
  { value: "3", label: "Type 2" },
];

const RecentTransaction = () => {
  const [selectedTransactionType, setSelectedTransaction] = useState<
    string | undefined
  >(transactionOptions?.[0]?.value);

  return (
    <div className="flex flex-col gap-4 p-5 bg-white/5 rounded-[10px]">
      <div className="flex justify-between items-center border-purpleFill">
        <h2 className="text-white text-xl font-bold">Recent Transaction</h2>
        <div className="flex gap-[10px]">
          <SelectWrapper
            options={transactionOptions}
            value={selectedTransactionType}
            onChange={setSelectedTransaction}
            placeholder="Select Year"
            className="w-[150px]"
          />
          <Button
            title={"See All"}
            icon={<ChevronRight size={14} />}
            iconAlignment="right"
            className="!px-3 !py-0 rounded-md border-purpleFill text-sm"
          />
        </div>
      </div>
      <Table
        columns={recentTransactionColumns}
        data={recentTransactionData}
        className="border-none rounded-lg max-h-[500px]"
        tableClass=""
        headerClass="bg-borderPurple text-white"
        bodyClass="divide-y divide-tileBackground bg-tileBackground bg-opacity-[0.5]"
      />
    </div>
  );
};

export default RecentTransaction;
