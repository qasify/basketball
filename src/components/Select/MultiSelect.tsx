"use client";
import React from "react";
import ReactSelect, { MultiValue, SingleValue } from "react-select";
import makeAnimated from "react-select/animated";
import { Option } from "@/types/Select";
import { cn } from "@/utils/cn";

const animatedComponents = makeAnimated();

interface Props {
  options: Option[];
  value?: Option | Option[];
  onValueChange: (newValue: Option[]) => void;
  isMulti?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  className?: string;
  placeholder?: string;
}

export const MultiSelect: React.FC<Props> = ({
  options,
  value,
  onValueChange,
  isMulti = false,
  isSearchable = true,
  isClearable = false,
  className = "",
  placeholder = "Select...",
}) => {
  const handleChange = (
    newValue: MultiValue<Option> | SingleValue<Option> | null
  ) => {
    if (Array.isArray(newValue)) {
      onValueChange(newValue);
    } else if (newValue) {
      onValueChange([newValue as Option]);
    } else {
      onValueChange([]);
    }
  };

  return (
    <ReactSelect
      components={animatedComponents}
      value={isMulti ? (value as Option[]) : (value as Option)}
      placeholder={placeholder}
      options={options}
      onChange={handleChange}
      className={cn("min-w-72 max-w-96", className)}
      isMulti={isMulti}
      isSearchable={isSearchable}
      isClearable={isClearable}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: "#F051FF33", // hover background
          primary: "#430A65", // selected item border
        },
      })}
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: "transparent",
          borderColor: state.isFocused ? "#F051FF33" : "#fff",
          boxShadow: state.isFocused ? "0 0 0 1px #430A65" : "none",
          padding: "2px 6px",
          borderRadius: "6px",
          cursor: "pointer",
          minHeight: "36px",
          maxHeight: "120px", // overall max height for the input
          overflowY: "auto", // allow scrolling when valueContainer overflows
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#222",
          borderRadius: "8px",
          marginTop: "4px",
          zIndex: 100,
        }),
        menuList: (base) => ({
          ...base,
          maxHeight: "300px",
          padding: "8px",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "#430A6533"
            : state.isFocused
            ? "#D9D9D933"
            : "transparent",
          ":active": {
            backgroundColor: "#430A6544", // slightly darker on click
          },
          color: "#fff",
          padding: "4px 6px",
          borderRadius: "6px",
          cursor: "pointer",
        }),
        valueContainer: (base) => ({
          ...base,
          flexWrap: "wrap",
          maxHeight: "72px", // restrict chips height
          overflowY: "auto",
          padding: "2px",
          gap: "4px",
          scrollbarWidth: "thin",
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: "#8E08DD33",
          borderRadius: "6px",
          padding: "2px",
          margin: "0 2px",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: "#fff",
          fontSize: "0.875rem",
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: "#fff",
          cursor: "pointer",
          padding: "2px",
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: "#F051FF33",
            color: "#fff",
          },
        }),
        singleValue: (base) => ({
          ...base,
          color: "#fff",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#FFFFFFB2",
        }),
        input: (base) => ({
          ...base,
          color: "#fff",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#aaa",
          "&:hover": {
            color: "#fff",
          },
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
      }}
    />
  );
};

export default MultiSelect;
