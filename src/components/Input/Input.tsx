import { cn } from "@/utils/cn";
import React from "react";

interface InputProps {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<
  InputProps &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">
> = ({ icon, iconPosition = "left", className, value, onChange, ...props }) => {
  return (
    <div
      className={cn(
        "flex items-center w-[470px] h-[40px] rounded-[5px] gap-[10px] p-[10px] text-inputText border text-sm border-searchBorder relative",
        className
      )}
    >
      {/* Left Icon */}
      {icon && iconPosition === "left" && (
        <span className="text-plcaeholderWhite">{icon}</span>
      )}

      {/* Input Field */}
      <input
        type="text"
        placeholder="Search Here......."
        className="bg-transparent text-white placeholder-plcaeholderWhite outline-none w-full"
        value={value}
        onChange={onChange}
        {...props}
      />

      {/* Right Icon */}
      {icon && iconPosition === "right" && (
        <span className="text-plcaeholderWhite">{icon}</span>
      )}
    </div>
  );
};

export default Input;
