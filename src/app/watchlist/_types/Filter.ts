import { Option } from "@/types/Select";

export type Filters = {
  searchText: string;
  priorities: Option[];
  positions: Option[];
  ageRange: [number, number];
};

export type SortOption = "name" | "age" | "team" | "position";
export type SortOrder = "asc" | "desc";

export type SortState = {
  sortBy: SortOption;
  sortOrder: SortOrder;
};
