"use client";
import { ReactNode, useState } from "react";
import { CgChevronDown, CgChevronUp } from "react-icons/cg";
import Button from "../Button";

type AccordionProps = {
  title: string;
  children: ReactNode;
  viewButtonText?: string;
  defaultOpen?: boolean;
  containerClass?: string;
  headerClass?: string;
  contentClass?: string;
  iconSize?: number;
};

const Accordion = ({
  title,
  children,
  viewButtonText = "View All",
  defaultOpen = true,
  containerClass = "",
  headerClass = "",
  contentClass = "",
  iconSize = 18,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`w-full flex flex-col gap-3 ${containerClass}`}>
      {/* Header Section */}
      <div className={`flex items-center justify-between ${headerClass}`}>
        <h2 className="text-white text-xl font-bold uppercase">{title}</h2>
        <Button
          title={viewButtonText}
          className="!border-none text-white"
          iconAlignment="right"
          icon={
            isOpen ? (
              <CgChevronDown size={iconSize} />
            ) : (
              <CgChevronUp size={iconSize} />
            )
          }
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </div>

      {/* Content Section */}
      {isOpen && <div className={`${contentClass}`}>{children}</div>}
    </div>
  );
};

export default Accordion;
