import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';
import { SortOption } from '../types/note';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalNotes: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalNotes,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-gray-200">Your Notes</h2>
        <span className="px-2 py-0.5 text-xs font-medium bg-gray-800 text-gray-300 rounded-full border border-gray-700">
          {totalNotes}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-8 py-1.5 bg-[#1e2229] border border-[#323842] rounded-md text-xs sm:text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#6366f1] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative flex items-center">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            aria-label="Sort notes"
            className="w-full sm:w-auto pl-8 pr-7 py-1.5 bg-[#1e2229] border border-[#323842] rounded-md text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-[#6366f1] transition-colors cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="updated">Recently updated</option>
            <option value="alphabetical">Title (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
