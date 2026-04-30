import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMic, FiTrendingUp, FiClock, FiSearch, FiX } from 'react-icons/fi';

const SearchEntryPage = () => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  const popularSearches = [
    "3 Seater Sofas",
    "Shoe Cabinets",
    "Sofa Cum Beds",
    "Centre Tables",
    "Queen Size Beds",
    "TV Units",
    "bed"
  ];

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
    
    // Auto-focus input on mount
    document.getElementById('main-search-input')?.focus();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    const updatedRecent = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm)
    ].slice(0, 5);
    
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-3 py-2 md:px-4 md:py-3 flex items-center gap-3 md:gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-800"
        >
          <FiArrowLeft size={24} />
        </button>
        
        <div className="flex-1 relative">
          <input
            id="main-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search products or brands..."
            className="w-full py-2 border-b-2 border-gray-200 focus:border-[#189D91] focus:outline-none text-lg font-medium placeholder:text-gray-300 transition-colors"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <FiX size={18} />
            </button>
          )}
          <button className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400">
            <FiMic size={22} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 space-y-6 md:space-y-10 max-w-2xl mx-auto">
        {recentSearches.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#127F75]">Recent Searches</h3>
              <button onClick={clearRecent} className="text-[10px] font-bold text-gray-400 hover:text-[#189D91] uppercase">Clear All</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(s)}
                  className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-[10px] md:text-xs font-bold text-gray-600 transition-colors border border-gray-100"
                >
                  <FiClock className="h-3 w-3 text-gray-400" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-5">
           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#127F75]">Popular Searches</h3>
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((s, i) => (
              <button
                key={i}
                 onClick={() => handleSearch(s)}
                 className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 bg-white border border-gray-100 hover:border-[#189D91]/30 hover:bg-gray-50 rounded-xl text-[11px] md:text-[13px] font-bold text-gray-700 transition-all shadow-sm group"
               >
                 <FiTrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400 group-hover:text-[#189D91] transition-colors" />
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestion List (if typing) */}
        {query && (
          <div className="pt-4 space-y-2 border-t border-gray-50">
             <button 
              onClick={() => handleSearch(query)}
              className="w-full flex items-center gap-4 py-3 text-gray-700 hover:bg-gray-50 px-2 rounded-lg transition-colors"
            >
              <FiSearch className="text-gray-300" />
              <span className="font-medium">Search for "{query}"</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchEntryPage;
