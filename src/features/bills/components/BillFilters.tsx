import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, X } from 'lucide-react';
import type { BillFilterBarProps } from '../types';

export const BillFilterBar: React.FC<BillFilterBarProps> = ({
  filters,
  categories,
  onFilterChange,
  onReset,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [prevFilterSearch, setPrevFilterSearch] = useState(filters.search);

  if (filters.search !== prevFilterSearch) {
    setPrevFilterSearch(filters.search);
    setSearchTerm(filters.search || '');
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentQuery = filters.search || '';
      const newQuery = searchTerm.trim();
      if (currentQuery !== newQuery) {
        onFilterChange({ search: newQuery || undefined });
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, filters.search, onFilterChange]);

  const handleClearSearch = () => {
    setSearchTerm('');
    onFilterChange({ search: undefined });
  };

  const handleResetAll = () => {
    setSearchTerm('');
    onReset();
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
    { value: 'OVERDUE', label: 'Overdue' },
    { value: 'UPCOMING', label: 'Upcoming' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-4">
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, description or notes..."
          className="w-full pl-9 pr-8 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder-slate-400 transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium transition-all"
          aria-label="Filter by status"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={filters.categoryId || ''}
          onChange={(e) => onFilterChange({ categoryId: e.target.value })}
          className="px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium transition-all"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => {
            const catId = cat.id || cat._id || '';
            return (
              <option key={catId} value={catId}>
                {cat.name}
              </option>
            );
          })}
        </select>

        <select
          value={filters.isRecurring === undefined ? '' : filters.isRecurring ? 'true' : 'false'}
          onChange={(e) => {
            const val = e.target.value;
            onFilterChange({
              isRecurring: val === '' ? undefined : val === 'true',
            });
          }}
          className="px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium transition-all"
          aria-label="Filter by recurrence"
        >
          <option value="">All Types</option>
          <option value="true">Recurring Only</option>
          <option value="false">One-Time Only</option>
        </select>

        <button
          type="button"
          onClick={handleResetAll}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Reset filters"
          aria-label="Reset filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
