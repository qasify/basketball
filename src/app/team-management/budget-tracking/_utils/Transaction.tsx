import { TableColumn } from "@/types/Table";
import { Transaction } from "../_types/Transaction";
import Button from "@/components/Button";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

export const recentTransactionColumns: TableColumn<
  Transaction & { action?: string }
>[] = [
  { label: "Date", key: "date" },
  { label: "Category", key: "category" },
  { label: "Amount", key: "amount" },
  { label: "Description", key: "description" },
  {
    label: "Action",
    key: "action",
    cellRenderer: () => {
      return (
        <div className="flex gap-2">
          <Button
            className="!p-1 rounded bg-borderPurple/30"
            icon={<FaPlus className="text-white text-xs" size={10} />}
          />
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

export const recentTransactionData: Transaction[] = [
  {
    date: "2025-01-01",
    category: "Player Salaries",
    amount: 500,
    description: "Monthly Payment",
  },
  {
    date: "2025-01-05",
    category: "Travel",
    amount: 120,
    description: "Flight For Game",
  },
  {
    date: "2025-01-10",
    category: "Equipment",
    amount: 300,
    description: "New Training Gear",
  },
  {
    date: "2025-01-15",
    category: "Miscellaneous",
    amount: 50,
    description: "Office Supplies",
  },
  {
    date: "2025-01-20",
    category: "Marketing",
    amount: 200,
    description: "Social Media Ads",
  },
  {
    date: "2025-01-25",
    category: "Player Bonuses",
    amount: 400,
    description: "Bonuses",
  },
  {
    date: "2025-01-20",
    category: "Travel",
    amount: 150,
    description: "Hotel Accommodation",
  },
  {
    date: "2025-01-15",
    category: "Miscellaneous",
    amount: 29,
    description: "N/A",
  },
  {
    date: "2025-01-15",
    category: "Miscellaneous",
    amount: 29,
    description: "N/A",
  },
  {
    date: "2025-01-15",
    category: "Miscellaneous",
    amount: 29,
    description: "N/A",
  },
  {
    date: "2025-01-15",
    category: "Miscellaneous",
    amount: 29,
    description: "Hotel Accommodation",
  },
];
