'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) pages.push(i)

      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">&laquo; Previous</span>
        <span className="sm:hidden">&laquo;</span>
      </button>

      {/* Page Numbers (hidden on mobile) */}
      <div className="hidden sm:flex items-center gap-1">
        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-2 text-sm text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-2 text-sm font-medium rounded-md border ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Mobile page indicator */}
      <span className="sm:hidden px-3 py-2 text-sm text-gray-600">
        {currentPage} / {totalPages}
      </span>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next &raquo;</span>
        <span className="sm:hidden">&raquo;</span>
      </button>
    </nav>
  )
}
