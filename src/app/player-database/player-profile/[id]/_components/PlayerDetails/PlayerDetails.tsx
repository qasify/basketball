import {
  AccordionContainer,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import Table from "@/components/Table";
import React from "react";
import { playerStatsColumns, tableData } from "../../_utils/Table";

const PlayerDetails = () => {
  return (
    <div>
      {/* Stats Filters */}
      <AccordionContainer
        type="single"
        collapsible
        className="w-full border-0"
        defaultValue="Traditional Splits"
      >
        {/* Traditional Splits */}
        <AccordionItem
          value="Traditional Splits"
          className="border-0 !overflow-hidden"
        >
          <AccordionTrigger className="flex flex-row-reverse justify-end gap-4 hover:no-underline text-xl">
            Traditional Splits
          </AccordionTrigger>
          <AccordionContent className="flex gap-5 !overflow-hidden">
            <Table
              columns={playerStatsColumns}
              data={tableData}
              className="border-none rounded-lg w-full"
              tableClass=""
              headerClass="bg-borderPurple text-white"
              bodyClass="divide-y divide-transparent"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Advanced Splits */}
        <AccordionItem
          value="Advanced Splits"
          className="border-0 !overflow-hidden"
        >
          <AccordionTrigger className="flex flex-row-reverse justify-end gap-4 hover:no-underline text-xl">
            Advanced Splits
          </AccordionTrigger>
          <AccordionContent className="flex gap-5 !overflow-hidden">
            <Table
              columns={playerStatsColumns}
              data={tableData}
              className="border-none rounded-lg w-full"
              tableClass=""
              headerClass="bg-borderPurple text-white"
              bodyClass="divide-y divide-transparent"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Misc Splits */}
        <AccordionItem
          value="Misc Splits"
          className="border-0 !overflow-hidden"
        >
          <AccordionTrigger className="flex flex-row-reverse justify-end gap-4 hover:no-underline text-xl">
            Misc Splits
          </AccordionTrigger>
          <AccordionContent className="flex gap-5 !overflow-hidden">
            <Table
              columns={playerStatsColumns}
              data={tableData}
              className="border-none rounded-lg w-full"
              tableClass=""
              headerClass="bg-borderPurple text-white"
              bodyClass="divide-y divide-transparent"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Scoring Splits */}
        <AccordionItem
          value="Scoring Splits"
          className="border-0 !overflow-hidden"
        >
          <AccordionTrigger className="flex flex-row-reverse justify-end gap-4 hover:no-underline text-xl">
            Scoring Splits
          </AccordionTrigger>
          <AccordionContent className="flex gap-5 !overflow-hidden">
            <Table
              columns={playerStatsColumns}
              data={tableData}
              className="border-none rounded-lg w-full"
              tableClass=""
              headerClass="bg-borderPurple text-white"
              bodyClass="divide-y divide-transparent"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Usage Splits */}
        <AccordionItem
          value="Usage Splits"
          className="border-0 !overflow-hidden"
        >
          <AccordionTrigger className="flex flex-row-reverse justify-end gap-4 hover:no-underline text-xl">
            Usage Splits
          </AccordionTrigger>
          <AccordionContent className="flex gap-5 !overflow-hidden">
            <Table
              columns={playerStatsColumns}
              data={tableData}
              className="border-none rounded-lg w-full"
              tableClass=""
              headerClass="bg-borderPurple text-white"
              bodyClass="divide-y divide-transparent"
            />
          </AccordionContent>
        </AccordionItem>
      </AccordionContainer>
    </div>
  );
};

export default PlayerDetails;
