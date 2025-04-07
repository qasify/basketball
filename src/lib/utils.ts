import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function SortFunction(a:string|number|string[]|undefined, b:string|number|string[]|undefined, sortDirection:'asc'|'desc'|undefined='asc', arrayOrder?:string[]){
  if (
    typeof a === "number" &&
    typeof b === "number"
  )
    return sortDirection === "asc"
      ? a - b
      : b - a;
  if (
    typeof a === "string" &&
    typeof b === "string"
  )
    return sortDirection === "asc"
      ? a.localeCompare(b)
      : b.localeCompare(a);

  if (Array.isArray(a) && Array.isArray(b) && arrayOrder) {
    const aPosition = a[0];
    const bPosition = b[0];

    const aIndex = arrayOrder.indexOf(aPosition);
    const bIndex = arrayOrder.indexOf(bPosition);

    if (aIndex === -1 || bIndex === -1) {
      return 0; // If the position is not found, keep the original order
    }

    return sortDirection === "asc" ? aIndex - bIndex : bIndex - aIndex;
  }
  if(a === undefined && b !== undefined)
    return 1
  if(a !== undefined && b === undefined)
    return -1

  return 0;
}