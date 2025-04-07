import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  const PaginationButton = ({
    handlePageChange,
    icon,
    disabled,
  }: {
    handlePageChange: () => void;
    icon: React.ReactNode;
    disabled: boolean;
  }) => (
    <button
      className="flex items-center justify-center h-[38px] w-[38px] p-2 border border-searchBorder rounded-md bg-card-radial disabled:opacity-50"
      onClick={handlePageChange}
      disabled={disabled}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex justify-end items-center gap-[10px]">
      <span className="font-[500] text-page">
        {currentPage} of {totalPages}
      </span>
      <PaginationButton
        handlePageChange={() => handlePageChange(Math.max(currentPage - 1, 1))}
        icon={<FaChevronLeft />}
        disabled={currentPage === 1}
      />
      <PaginationButton
        handlePageChange={() =>
          handlePageChange(Math.min(currentPage + 1, totalPages))
        }
        icon={<FaChevronRight />}
        disabled={currentPage === totalPages}
      />
    </div>
  );
};

export default Pagination;
