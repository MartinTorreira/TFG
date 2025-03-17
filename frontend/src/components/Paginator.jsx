import React from "react";

const Paginator = ({ page, totalPages, onPageChange }) => {
  const handleNextPage = () => {
    if (page < totalPages - 1) {
      onPageChange(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      onPageChange(page - 1);
    }
  };

  return (
    <nav aria-label="Page navigation example" className="mt-4">
      <ul className="flex items-center -space-x-px h-8 text-sm">
        <li>
          <button
            onClick={handlePreviousPage}
            disabled={page === 0}
            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-accent-darker bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-opacity-80 transition-all"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </button>
        </li>
        {[...Array(totalPages).keys()].map((pageIndex) => (
          <li key={pageIndex}>
            <button
              onClick={() => onPageChange(pageIndex)}
              className={`flex items-center justify-center px-3 h-8 leading-tight ${
                pageIndex === page
                  ? "text-accent-darker border border-accent-light bg-accent-light/90 hover:bg-accent-light hover:accent-darker"
                  : "text-accent-darker bg-gray-50 border border-accent-light hover:bg-opacity-80 "
              }`}
            >
              {pageIndex + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            className="flex items-center justify-center px-3 h-8 leading-tight text-accent-darker bg-white border border-accent-light rounded-e-lg hover:bg-opacity-80 transition-all"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Paginator;