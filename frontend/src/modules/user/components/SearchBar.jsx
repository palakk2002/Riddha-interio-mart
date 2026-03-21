import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ className = '' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative flex-1 ${className}`}
    >
      <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-400 group-focus-within:text-warm-sand transition-colors" />
      </span>
      <input
        type="text"
        placeholder="Search collections..."
        className="w-full pl-12 pr-6 py-2.5 md:py-3.5 bg-soft-oatmeal/10 border border-soft-oatmeal/20 rounded-full focus:outline-none focus:ring-4 focus:ring-warm-sand/10 focus:bg-white focus:border-warm-sand transition-all duration-500 placeholder:text-gray-400 text-sm font-medium"
      />
    </motion.div>
  );
};

export default SearchBar;
