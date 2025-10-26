export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxVisible = 5; // Max page buttons to show
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  // Adjust start if near end
  start = Math.max(1, end - maxVisible + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex justify-center mt-6 gap-1 flex-wrap mb-4">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md font-medium transition ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-white hover:bg-gray-100 text-gray-800"
        }`}
      >
        &lt;
      </button>

      {/* First page + ellipsis */}
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded-md font-medium ${
              currentPage === 1
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100 text-gray-800"
            }`}
          >
            1
          </button>
          {start > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* Middle pages */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md font-medium transition ${
            page === currentPage
              ? "bg-black text-white"
              : "bg-white hover:bg-gray-100 text-gray-800"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last page + ellipsis */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded-md font-medium ${
              currentPage === totalPages
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100 text-gray-800"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md font-medium transition ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-white hover:bg-gray-100 text-gray-800"
        }`}
      >
        &gt;
      </button>
    </div>
  );
}
