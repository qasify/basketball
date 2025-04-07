"use client"
import { appConstants } from "@/utils/constants/app";
import React from "react";
import NavItem from "./components/NavItem";
import SupportBox from "./components/SupportBox";
import UserProfile from "./components/UserProfile";
import { bottomNavItems, navItems } from "@/utils/constants/navItems";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const pathList = pathname?.split("/") || [];
  const pathName = pathList[pathList.length - 1] ?? "";

  return (
    <div className="flex flex-col w-[272px] h-[100vh] border-r-[1px] border-borderLight">
      <div className="text-xl font-normal tracking-normal border-b-[1px] border-borderLight text-white uppercase p-1 h-[80px] flex items-center justify-center">
        {appConstants?.appName}
      </div>

      {/* content of sidebar */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Main Navigation */}
        <nav className="space-y-2">
          <h2 className="text-textLight text-standard font-[500] uppercase">
            Main
          </h2>
          <div className="flex flex-col gap-1">
            {navItems.map((item, index) => (
              <NavItem
                key={`${item?.key}_${index}`}
                icon={item?.icon}
                height={item?.height}
                width={item?.width}
                label={item?.label}
                active={item?.url === `/${pathName}`}
                url={item?.url}
              />
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-[6px]">
          {/* Support Box */}
          <SupportBox />

          {/* Settings & Support */}
          <div className="flex flex-col gap-1">
            {bottomNavItems.map((item, index) => (
              <NavItem
                key={`${item?.key}_${index}`}
                icon={item?.icon}
                height={item?.height}
                width={item?.width}
                label={item?.label}
                active={item?.url === `/${pathName}`}
                url={item?.url}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="flex p-3 pt-0">
        <UserProfile name="Wei Chen" email="wei@gmail.com" />
      </div>
    </div>
  );
};

export default Sidebar;
