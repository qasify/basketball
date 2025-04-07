import { CSSProperties, ReactNode } from "react";

export type SortDirection = "asc" | "desc" | null;

// Table Column Type
export type TableColumn<T> = {
  key: keyof T;
  label: string;
  headerRenderer?: (label?: string) => ReactNode;
  cellRenderer?: (value: T[keyof T], row: T, index: number) => ReactNode;
  isSortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  headerStyle?: CSSProperties;
};



