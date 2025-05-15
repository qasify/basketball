import { TableColumn } from "@/types/Table";
import { CategoryBreakDownItem } from "../_types";

export const categoryBreakDownColumns: TableColumn<CategoryBreakDownItem>[] = [
  { label: "Category", key: "category" },
  { label: "Total Budget", key: "totalBudget" },
  { label: "Spent", key: "spent" },
  { label: "Remaining", key: "remaining" },
];

export const categoryBreakDownData: CategoryBreakDownItem[] = [
  {
    category: "Salaries",
    totalBudget: 6000.0,
    spent: 4500.0,
    remaining: 1500.0,
  },
  {
    category: "Marketing",
    totalBudget: 3000.0,
    spent: 2000.0,
    remaining: 1000.0,
  },
  { category: "Travel", totalBudget: 2500.0, spent: 1200.0, remaining: 1300.0 },
  {
    category: "Equipment",
    totalBudget: 4000.0,
    spent: 540.0,
    remaining: 3460.0,
  },
  {
    category: "Remaining Budget",
    totalBudget: 16058.94,
    spent: 6240.28,
    remaining: 2910.28,
  },
];
