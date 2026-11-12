import React from 'react';

interface NoteSkeletonProps {
  count?: number;
}

export const NoteSkeleton: React.FC<NoteSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-[#1e2229] border border-[#323842] rounded-lg p-4 h-44 flex flex-col justify-between animate-pulse"
        >
          <div>
            <div className="h-5 bg-gray-700/60 rounded w-2/3 mb-3" />
            <div className="space-y-2">
              <div className="h-3.5 bg-gray-700/40 rounded w-full" />
              <div className="h-3.5 bg-gray-700/40 rounded w-5/6" />
              <div className="h-3.5 bg-gray-700/40 rounded w-3/4" />
            </div>
          </div>
          <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
            <div className="h-3 bg-gray-700/40 rounded w-20" />
            <div className="flex gap-1.5">
              <div className="w-6 h-6 bg-gray-700/40 rounded" />
              <div className="w-6 h-6 bg-gray-700/40 rounded" />
              <div className="w-6 h-6 bg-gray-700/40 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
