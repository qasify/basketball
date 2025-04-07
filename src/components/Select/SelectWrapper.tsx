import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { cn } from "@/utils/cn";
import { SelectOption } from "@/types/Select";

type SelectWrapperProps<T> = {
  className?: string;
  itemClassName?: string;
  contentWrapperClassName?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
};

function SelectWrapper<T>({
  className,
  itemClassName,
  contentWrapperClassName,
  placeholder = "Select",
  options = [],
  value,
  onChange,
}: SelectWrapperProps<T>) {
  return (
    <Select
      value={String(value ?? "")}
      onValueChange={(val) => {
        const selectedOption = options.find(
          (option) => String(option.value) === val
        );
        if (selectedOption) onChange(selectedOption.value);
      }}
    >
      <SelectTrigger
        className={cn(
          "w-[180px] border-purpleFill bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus:ring-0 focus:ring-transparent",
          "[&:focus::before]:ring-0 [&:focus::before]:ring-transparent !outline-none",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={cn(
          "bg-black backdrop-blur-70 border-searchBorder",

          contentWrapperClassName
        )}
      >
        {options.map((option) => (
          <SelectItem
            key={String(option.value)}
            value={String(option.value)}
            className={cn(
              "hover:bg-borderPurple/25 cursor-pointer",
              itemClassName
            )}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectWrapper;
