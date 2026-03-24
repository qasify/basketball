import { Option } from "@/types/Select";
import type { Filters, SortOption, SortState } from "../_types/Filter";

export const priorityFilters: Option[] = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

export const positionFilters: Option[] = [
  { label: "PG", value: "Point Guard" },
  { label: "SG", value: "Shooting Guard" },
  { label: "SF", value: "Small Forward" },
  { label: "PF", value: "Power Forward" },
  { label: "C", value: "Center" },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "age", label: "Age" },
  { value: "team", label: "Team" },
  { value: "position", label: "Position" },
];

export const initialFilters: Filters = {
  priorities: [],
  positions: [],
  ageRange: [14, 40],
  searchText: "",
};

export const defaultSortState: SortState = {
  sortBy: "name",
  sortOrder: "asc",
};
