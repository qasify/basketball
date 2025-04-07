"use client";
import Image from "next/image";
import { appConstants } from "@/utils/constants/app";
import { usePathname } from "next/navigation";
import React from "react";
import Input from "../Input";
import { IoIosSearch } from "react-icons/io";

const Header = () => {
  const pathname = usePathname();
  const pathList = pathname?.split("/") || [];
  const pathName = pathList[pathList.length - 1] ?? "";

  return (
    <div className="flex items-center justify-between w-full h-[80px] border-b-[1px] border-borderLight py-[20px] px-[32px] gap-3">
      <h3 className="font-medium text-2xl leading-8">
        {appConstants?.[(pathName ?? "defaultTitle") as string]}
      </h3>
      <div className="flex gap-3">
        <Input
          icon={<IoIosSearch size={20} />}
          iconPosition="left"
          placeholder="Search Here..."
        />
        <Image
          src="/icons/avatar-placeholder.png"
          alt="User"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
};

export default Header;
