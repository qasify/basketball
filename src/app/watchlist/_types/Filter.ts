import { Option } from "@/types/Select";

export type Filters = {
  searchText: string;
  priorities: Option[];
  ageRange: [number, number];
  // 🔔 Add more filters here easily as needed
};
