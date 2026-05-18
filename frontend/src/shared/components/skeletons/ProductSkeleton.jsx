import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 sm:h-56 bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductSkeleton);
