import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiMic, FiTrendingUp, FiClock, FiSearch, FiX, FiPackage, FiChevronRight } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const SearchEntryPage = () => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const popularSearches = [
    "3 Seater Sofas",
    "Shoe Cabinets",
    "Sofa Cum Beds",
    "Centre Tables",
    "Queen Size Beds",
    "TV Units",
    "Marble Tiles"
  ];

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
    document.getElementById('main-search-input')?.focus();
  }, []);

  // Debounced Search Logic
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(query);
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchSuggestions = async (searchTerm) => {
    try {
      setLoading(true);
      const res = await api.get(`/products?search=${encodeURIComponent(searchTerm)}&limit=6`);
      setSuggestions(res.data.data);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

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
          className="p-2 -ml-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <FiArrowLeft size={24} />
        </button>
        
        <div className="flex-1 relative">
          <input
            id="main-search-input"
            type="text"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search products or brands..."
            className="w-full py-2 border-b-2 border-gray-100 focus:border-[#189D91] focus:outline-none text-lg font-medium placeholder:text-gray-300 transition-all"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FiX size={18} />
            </button>
          )}
          <button className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#189D91] transition-colors">
            <FiMic size={22} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 md:p-6 max-w-2xl mx-auto overflow-y-auto max-h-[calc(100vh-80px)] no-scrollbar">
        <AnimatePresence mode="wait">
          {query.trim() ? (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-1">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#127F75]">Suggested Products</h3>
                 {loading && <div className="w-4 h-4 border-2 border-[#189D91]/20 border-t-[#189D91] rounded-full animate-spin" />}
              </div>
              
              <div className="space-y-1">
                {suggestions.length > 0 ? (
                  suggestions.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-[#F0F9F8] rounded-2xl transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                          <img 
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200&q=80'} 
                            alt="" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-gray-800 leading-tight line-clamp-1">{product.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-wider text-warm-sand mt-1">{product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-[#189D91]">₹{product.discountPrice || product.price}</span>
                        <FiChevronRight className="text-gray-300 group-hover:text-[#189D91] transition-colors" />
                      </div>
                    </button>
                  ))
                ) : !loading && (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                       <FiSearch size={32} />
                    </div>
                    <p className="text-gray-400 text-sm font-medium italic">No matches found for "{query}"</p>
                  </div>
                )}

                <button 
                  onClick={() => handleSearch(query)}
                  className="w-full flex items-center gap-4 py-4 px-4 mt-2 bg-[#189D91]/5 text-[#189D91] hover:bg-[#189D91]/10 rounded-2xl transition-all group"
                >
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <FiSearch size={16} />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">Search for "{query}"</span>
                  <FiChevronRight className="ml-auto opacity-40 group-hover:opacity-100" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {recentSearches.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#127F75]">Recent Searches</h3>
                    <button onClick={clearRecent} className="text-[10px] font-bold text-gray-400 hover:text-red-400 uppercase tracking-widest transition-colors">Clear All</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(s)}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F0F9F8] rounded-xl text-xs font-bold text-gray-600 transition-all border border-gray-100 hover:border-[#189D91]/30 shadow-sm"
                      >
                        <FiClock className="h-3.5 w-3.5 text-gray-400" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#127F75]">Trending Now</h3>
                <div className="flex flex-wrap gap-3">
                  {popularSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(s)}
                      className="flex items-center gap-2 md:gap-3 px-4 py-3 md:px-5 md:py-4 bg-white border border-gray-100 hover:border-[#189D91]/30 hover:bg-[#F0F9F8] rounded-2xl text-[11px] md:text-[13px] font-bold text-gray-700 transition-all shadow-sm group"
                    >
                      <FiTrendingUp className="h-4 w-4 text-gray-400 group-hover:text-[#189D91] transition-colors" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchEntryPage;
