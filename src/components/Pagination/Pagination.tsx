import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

/** Build page numbers and ellipsis for modern pagination, e.g. [1, "...", 4, 5, 6, "...", 20]. */
function getPaginationPages(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [];
  const showLeft = currentPage > 3;
  const showRight = currentPage < totalPages - 2;

  pages.push(1);
  if (showLeft) pages.push("ellipsis");

  const start = showLeft ? Math.max(2, currentPage - 1) : 2;
  const end = showRight ? Math.min(totalPages - 1, currentPage + 1) : totalPages - 1;
  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages) pages.push(i);
  }

  if (showRight) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  const pageItems = getPaginationPages(currentPage, totalPages);

  return (
    <div className="flex justify-end items-center gap-2 flex-wrap">
      <button
        className="flex items-center justify-center h-[38px] w-[38px] p-2 border border-searchBorder rounded-md bg-card-radial disabled:opacity-50 hover:enabled:opacity-90"
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      <div className="flex items-center gap-1">
        {pageItems.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex items-center justify-center h-[38px] min-w-[38px] px-2 text-page"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={item}
              className={`flex items-center justify-center h-[38px] min-w-[38px] px-2 border rounded-md font-[500] transition-colors ${
                item === currentPage
                  ? "border-purplish bg-purple-500/20"
                  : "border-searchBorder bg-card-radial hover:opacity-90"
              }`}
              onClick={() => handlePageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        className="flex items-center justify-center h-[38px] w-[38px] p-2 border border-searchBorder rounded-md bg-card-radial disabled:opacity-50 hover:enabled:opacity-90"
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
