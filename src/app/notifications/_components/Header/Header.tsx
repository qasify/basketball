"use client";
import Button from "@/components/Button";
import React from "react";

import { FaFilter } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { LuCheckCheck } from "react-icons/lu";

const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-2xl uppercase text-white">Your Notifications</h3>
      <div className="flex gap-[10px]">
        <Button
          title="Filter"
          icon={
            <FaFilter
              size={10}
              onClick={() => {
                // TODO: Filter click
              }}
            />
          }
        />
        <Button
          title="Mark All as Read"
          icon={<LuCheckCheck size={16} />}
          onClick={() => {
            // TODO: Read click
          }}
        />
        <Button
          title="Cancel All"
          icon={<IoMdClose size={16} />}
          onClick={() => {
            // TODO: Cancel click
          }}
        />
      </div>
    </div>
  );
};

export default Header;
