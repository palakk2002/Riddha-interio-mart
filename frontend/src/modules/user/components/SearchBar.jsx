import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiArrowLeft, FiMic, FiTrendingUp, FiClock, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ className = '', variant = 'standard' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/search');
  };

  return (
    <div className={`relative flex-1 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={handleClick}
        className="relative flex-1 group cursor-pointer"
      >
        {variant === 'standard' ? (
          <>
            <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400 group-focus-within:text-[#189D91] transition-colors" />
            </span>
            <input
              type="text"
              readOnly
              placeholder="Search products or brands..."
              className="w-full pl-12 pr-12 py-2.5 md:py-3 bg-white border border-gray-100 rounded-full focus:outline-none focus:ring-4 focus:ring-[#189D91]/10 focus:border-[#189D91]/20 transition-all duration-500 placeholder:text-gray-400 text-gray-600 text-sm font-medium shadow-sm cursor-pointer"
            />
            <button className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-[#189D91]">
              <FiMic className="h-5 w-5" />
            </button>
          </>
        ) : (
          <div className="flex w-full">
            <input
              type="text"
              readOnly
              placeholder="Search for products or brands"
              className="w-full pl-6 pr-4 py-2.5 bg-white border-l border-t border-b border-gray-200 rounded-l-md focus:outline-none text-gray-700 text-sm font-medium cursor-pointer"
            />
            <button className="bg-white border-r border-t border-b border-gray-200 px-4 py-2.5 rounded-r-md transition-colors hover:bg-gray-50">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SearchBar;
