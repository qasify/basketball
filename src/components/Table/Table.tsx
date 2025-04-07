"use client";

import { SortDirection, TableColumn } from "@/types/Table";
import TableHeader from "./TableHeader";

// Table Props Type
export type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  sortDirection?: SortDirection;
  sortBy?: keyof T;
  onSort?: (key?: keyof T) => void;
  tableClass?: string;
  headerClass?: string;
  bodyClass?: string;
  onRowClick?: (row: T) => void;
};

const Table = <T,>({
  columns,
  data,
  className = "",
  sortDirection,
  sortBy,
  onSort,
  tableClass = "",
  headerClass = "",
  bodyClass = "",
  onRowClick,
}: TableProps<T>) => {
  return (
    <div className={`overflow-auto rounded-lg ${className}`}>
      <table
        className={`w-full border-collapse relative ${tableClass}`}
        style={{ borderSpacing: 0 }}
      >
        {/* Table Header (Sticky) */}
        <thead
          className={`text-white ${headerClass}`}
          style={{ position: "sticky", top: 0, zIndex: 10 }}
        >
          <tr>
            {columns.map((column) => (
              <TableHeader
                key={String(column.key)}
                label={column.label}
                isSortable={column?.isSortable}
                sortDirection={
                  sortDirection ? sortDirection : column.sortDirection
                }
                onSort={onSort ? () => onSort(column.key) : column.onSort}
                headerRenderer={column.headerRenderer}
                headerStyle={column.headerStyle}
                isSortActive={sortBy === column.key}
              />
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className={`divide-y divide-gray-700 text-white ${bodyClass}`}>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-800 transition cursor-pointer"
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-4 py-3 font-[500] text-sm"
                >
                  {column.cellRenderer
                    ? column.cellRenderer(row[column.key], row, rowIndex)
                    : String(row[column.key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
