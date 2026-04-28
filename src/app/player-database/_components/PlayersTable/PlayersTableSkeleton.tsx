"use client";

import React from "react";

const SKELETON_ROWS = 10;

const HEADERS = [
  "Name",
  "Position",
  "Age",
  "Country",
  "Height",
  "Weight",
  "",
] as const;

/** Pulse bars with slightly different widths so rows don’t look identical. */
function CellBar({ className }: { className?: string }) {
  return (
    <div
      className={`h-3.5 rounded-md bg-white/10 animate-pulse ${className ?? ""}`}
    />
  );
}

export default function PlayersTableSkeleton() {
  return (
    <div className="mt-8 space-y-5 overflow-x-auto" aria-busy aria-label="Loading players">
      <div className="overflow-auto rounded-lg border-none min-w-full">
        <table
          className="w-full border-collapse min-w-max"
          style={{ borderSpacing: 0 }}
        >
          <thead
            className="text-white bg-borderPurple"
            style={{ position: "sticky", top: 0, zIndex: 10 }}
          >
            <tr>
              {HEADERS.map((label, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-sm font-semibold select-none"
                >
                  {label || <span className="sr-only">Actions</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent text-white">
            {Array.from({ length: SKELETON_ROWS }, (_, row) => (
              <tr key={row}>
                <td className="px-4 py-3">
                  <CellBar className="w-[min(220px,55vw)]" />
                </td>
                <td className="px-4 py-3">
                  <CellBar className="w-14" />
                </td>
                <td className="px-4 py-3">
                  <CellBar className="w-8" />
                </td>
                <td className="px-4 py-3">
                  <CellBar className="w-24" />
                </td>
                <td className="px-4 py-3">
                  <CellBar className="w-12" />
                </td>
                <td className="px-4 py-3">
                  <CellBar className="w-14" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <div className="h-7 w-7 rounded bg-white/10 animate-pulse" />
                    <div className="h-7 w-7 rounded bg-white/10 animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center gap-2 flex-wrap">
        <div className="h-[38px] w-[38px] rounded-md border border-searchBorder/50 bg-white/5 animate-pulse" />
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[38px] w-[38px] rounded-md bg-white/10 animate-pulse"
            />
          ))}
        </div>
        <div className="h-[38px] w-[38px] rounded-md border border-searchBorder/50 bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
