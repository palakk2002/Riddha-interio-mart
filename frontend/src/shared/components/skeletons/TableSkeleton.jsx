import React from 'react';

const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full animate-pulse">
      <div className="bg-gray-50 border-b border-gray-100 rounded-t-xl h-12 w-full mb-2"></div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(TableSkeleton);
