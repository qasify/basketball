import { FaEdit, FaTrash } from "react-icons/fa";
import { RosterItem } from "../_types";
import { TableColumn } from "@/types/Table";
import Button from "@/components/Button";
import { Player } from "@/_api/basketball-api";

export const rosterColumns: TableColumn<Player & { action?: string }>[] = [
  { label: "Name", key: "name" },
  { label: "Position", key: "position" },
  { label: "Age", key: "age" },
  { label: "Salary", key: "salary" },
  { label: "Current Year", key: "contract" },
  {
    label: "Action",
    key: "action",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cellRenderer: (_val, _row) => {
      return (
        <div className="flex gap-2">
          <Button
            className="!p-1 rounded bg-borderPurple/30"
            icon={<FaEdit className="text-white text-xs" size={10} />}
          />
          <Button
            className="!p-1 rounded bg-borderPurple/30"
            icon={<FaTrash className="text-white text-xs" size={10} />}
          />
        </div>
      );
    },
  },
];

export const rosterData: RosterItem[] = [
  {
    name: "Williams Trevion",
    position: "Center",
    age: 23,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "Mattisseck Jonas",
    position: "Guard",
    age: 24,
    salary: "N/A",
    currentYear: "N/A",
  },
  {
    name: "Koumadje Christ",
    position: "Center",
    age: 27,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "John C.",
    position: "Forward",
    age: 29,
    salary: "N/A",
    currentYear: "N/A",
  },
  {
    name: "Daniel I. Morris",
    position: "Center",
    age: 26,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "Koumadje Christ",
    position: "Center",
    age: 27,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "John C.",
    position: "Forward",
    age: 29,
    salary: "N/A",
    currentYear: "N/A",
  },
  {
    name: "Daniel I. Morris",
    position: "Center",
    age: 26,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "Koumadje Christ",
    position: "Center",
    age: 27,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "John C.",
    position: "Forward",
    age: 29,
    salary: "N/A",
    currentYear: "N/A",
  },
  {
    name: "Daniel I. Morris",
    position: "Center",
    age: 26,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "Koumadje Christ",
    position: "Center",
    age: 27,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "John C.",
    position: "Forward",
    age: 29,
    salary: "N/A",
    currentYear: "N/A",
  },
  {
    name: "Daniel I. Morris",
    position: "Center",
    age: 26,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "Koumadje Christ",
    position: "Center",
    age: 27,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "John C.",
    position: "Forward",
    age: 29,
    salary: "N/A",
    currentYear: "N/A",
  },
  {
    name: "Daniel I. Morris",
    position: "Center",
    age: 26,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "Koumadje Christ",
    position: "Center",
    age: 27,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "John C.",
    position: "Forward",
    age: 29,
    salary: "N/A",
    currentYear: "N/A",
  },
  {
    name: "Daniel I. Morris",
    position: "Center",
    age: 26,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "Koumadje Christ",
    position: "Center",
    age: 27,
    salary: "$5000",
    currentYear: "2 Years",
  },
  {
    name: "John C.",
    position: "Forward",
    age: 29,
    salary: "N/A",
    currentYear: "N/A",
  },
  {
    name: "Daniel I. Morris",
    position: "Center",
    age: 26,
    salary: "$5000",
    currentYear: "2 Years",
  },
];
