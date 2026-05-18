import React from 'react';

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#001B4E] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-[#001B4E]">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;
