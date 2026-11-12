import React from 'react';
import { FileText, SearchX } from 'lucide-react';

interface EmptyStateProps {
  hasSearchQuery: boolean;
  onClearSearch: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearchQuery,
  onClearSearch,
}) => {
  if (hasSearchQuery) {
    return (
      <div className="text-center py-14 px-4 bg-[#1e2229]/50 border border-dashed border-[#323842] rounded-lg">
        <SearchX className="w-10 h-10 text-gray-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-gray-200 mb-1">
          No matching notes found
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mb-4">
          Try adjusting your search keywords or clear the search filter.
        </p>
        <button
          type="button"
          onClick={onClearSearch}
          className="px-3.5 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md border border-gray-700 transition-colors"
        >
          Clear search
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-14 px-4 bg-[#1e2229]/50 border border-dashed border-[#323842] rounded-lg">
      <FileText className="w-10 h-10 text-gray-500 mx-auto mb-3" />
      <h3 className="text-base font-semibold text-gray-200 mb-1">
        No notes yet
      </h3>
      <p className="text-xs sm:text-sm text-gray-400">
        Create your first note using the form above to get started!
      </p>
    </div>
  );
};
