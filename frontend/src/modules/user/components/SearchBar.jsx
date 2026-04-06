import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ className = '', variant = 'standard' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative flex-1 group ${className}`}
    >
      {variant === 'standard' ? (
        <>
          <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400 group-focus-within:text-warm-sand transition-colors" />
          </span>
          <input
            type="text"
            placeholder="Search products or brands..."
            className="w-full pl-12 pr-6 py-2.5 md:py-3.5 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-white transition-all duration-500 placeholder:text-gray-400 text-gray-600 text-sm font-medium shadow-sm"
          />
        </>
      ) : (
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search for products or brands"
            className="w-full pl-6 pr-4 py-2.5 bg-white border-l border-t border-b border-gray-200 rounded-l-md focus:outline-none text-gray-700 text-sm font-medium"
          />
          <button className="bg-white border-r border-t border-b border-gray-200 px-4 py-2.5 rounded-r-md transition-colors hover:bg-gray-50">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SearchBar;
