// src/Components/admin/DataTable.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, Search, ChevronsLeft, ChevronsRight } from 'lucide-react';

const DataTable = ({ 
  columns, 
  data, 
  loading, 
  pagination,    // object: { currentPage, totalPages, totalItems, itemsPerPage }
  onPageChange   // function: (pageNumber) => void
}) => {

  // --- 1. Skeleton Loader Component ---
  // Renders 5 fake rows while data is loading
  const TableSkeleton = () => (
    <tbody className="bg-white divide-y divide-slate-100">
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          {columns.map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // --- 2. Empty State Component ---
  const EmptyState = () => (
    <tr>
      <td colSpan={columns.length} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center text-slate-400">
          <div className="bg-slate-50 p-4 rounded-full mb-3">
            <Search size={24} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No records found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search.</p>
        </div>
      </td>
    </tr>
  );

  // --- 3. Pagination Logic ---
  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
    
    // Calculate "Showing X to Y of Z"
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{startItem}</span> to <span className="font-semibold text-slate-700">{endItem}</span> of <span className="font-semibold text-slate-700">{totalItems}</span> results
            </p>
          </div>
          
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>
              
              {/* Page Number Indicator */}
              <span className="relative inline-flex items-center px-4 py-2 border border-slate-200 bg-white text-sm font-medium text-slate-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronsRight size={16} />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          
          {loading ? (
            <TableSkeleton />
          ) : (
            <tbody className="bg-white divide-y divide-slate-100">
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <tr 
                    key={item._id || index} 
                    className="hover:bg-slate-50 transition-colors duration-150 group"
                  >
                    {columns.map((col) => (
                      <td 
                        key={col.key} 
                        className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 group-hover:text-slate-900"
                      >
                        {col.render ? col.render(item) : (item[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <EmptyState />
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination Footer - Only show if data exists and not loading */}
      {!loading && data.length > 0 && renderPagination()}
    </div>
  );
};

export default DataTable;