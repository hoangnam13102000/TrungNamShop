import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange, maxVisible = 5 }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-4 flex-wrap px-4">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 sm:p-2.5 rounded-lg border border-gray-300 text-gray-700 transition-all hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronLeft size={16} />
      </button>

      {/* First + ellipsis */}
      {pages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-10 h-10 rounded-lg border border-gray-300 text-gray-700 font-medium transition-all hover:border-blue-500 hover:bg-blue-50">
            1
          </button>
          {pages[0] > 2 && <span className="px-2 text-gray-500">...</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg font-medium transition-all ${
            page === currentPage ? "bg-blue-500 text-white border border-blue-500 shadow-md" : "border border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last + ellipsis */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-10 h-10 rounded-lg border border-gray-300 text-gray-700 font-medium transition-all hover:border-blue-500 hover:bg-blue-50">
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 sm:p-2.5 rounded-lg border border-gray-300 text-gray-700 transition-all hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;