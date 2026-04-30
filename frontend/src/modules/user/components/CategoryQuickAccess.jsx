import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../../shared/utils/api';

// Custom Minimalist SVG Icons for Interior Design
const Icons = {
  Furniture: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-1.5">
      <path d="M3 11V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11" />
      <path d="M21 11a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2" />
      <path d="M12 9V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4" />
      <path d="M18 9V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    </svg>
  ),
  Lighting: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-1.5">
      <path d="M12 2v2M12 18v4M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  WallPanels: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-1.5">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
  ),
  Decor: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Hardware: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-1.5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" />
    </svg>
  ),
  Flooring: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-1.5">
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  ),
  Default: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
};

// Fixed color sequence for alternating look
const CATEGORY_COLORS = [
  'bg-[#289E8E]', // Teal
  'bg-[#F06292]', // Pink
  'bg-[#7E57C2]', // Purple
  'bg-[#D81B60]', // Magenta
  'bg-[#FFA726]', // Orange
  'bg-[#00ACC1]', // Cyan
  'bg-[#EC407A]', // Soft Pink
  'bg-[#1EA499]', // Light Teal
];

const getCategoryIcon = (name) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('furniture') || normalized.includes('living')) return Icons.Furniture;
  if (normalized.includes('lighting') || normalized.includes('lamp')) return Icons.Lighting;
  if (normalized.includes('wall') || normalized.includes('panel') || normalized.includes('tile')) return Icons.WallPanels;
  if (normalized.includes('decor') || normalized.includes('access')) return Icons.Decor;
  if (normalized.includes('hardware') || normalized.includes('tool')) return Icons.Hardware;
  if (normalized.includes('floor') || normalized.includes('rug')) return Icons.Flooring;
  return Icons.Default;
};

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const CategoryQuickAccess = ({ isScrollable = false }) => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const tabs = ['All', ...categories.map(cat => cat.name)];

  if (loading) {
    return (
      <div className="py-20 text-center font-display text-[#189D91] animate-pulse uppercase tracking-[0.2em] text-xs">
        Loading Collections...
      </div>
    );
  }

  return (
    <section className="pt-1 pb-0 md:py-12 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Horizontal Category Tabs */}
        {!isScrollable && (
          <div className="flex overflow-x-auto pb-1 mb-0 md:mb-4 gap-6 md:gap-8 no-scrollbar items-center border-b border-soft-oatmeal/20 whitespace-nowrap px-4 md:px-0 -mx-4 md:mx-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative text-[11px] md:text-sm font-semibold pb-3 md:pb-4 transition-all duration-300 ${activeTab === tab ? 'text-black' : 'text-deep-espresso/40 hover:text-deep-espresso/60'
                  }`}
              >
                {toTitleCase(tab)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#189D91]"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Categories Grid/Scroll Area */}
        <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory px-0 pt-0 pb-2 -mx-4 md:mx-0">
          <div className="flex flex-nowrap md:grid md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-12 px-4 md:px-0">
            {categories.slice(0, showAll ? categories.length : 6).map((category, index) => {
              const bg = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
              const IconComponent = getCategoryIcon(category.name);
              return (
                <div key={category._id} className={`snap-start shrink-0 ${index === 0 ? 'pl-5' : ''}`}>
                  <Link
                    to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group flex flex-col items-center gap-1.5 md:gap-4 w-14 md:w-40"
                  >
                    <div className={`relative aspect-square w-full rounded-full overflow-hidden ${bg} shadow-sm group-hover:shadow-lg transition-all duration-500 flex items-center justify-center p-3 md:p-8`}>
                      <div className="text-white w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <IconComponent />
                      </div>
                    </div>
                    <span className="text-[9px] md:text-sm font-medium text-deep-espresso/80 group-hover:text-[#189D91] text-center transition-colors leading-tight min-h-[2.2em] flex items-center justify-center px-0.5 tracking-tighter">
                      {toTitleCase(category.name)}
                    </span>
                  </Link>
                </div>
              );
            })}

            {/* Show More Button */}
            {!showAll && categories.length > 6 && (
              <div className="snap-start shrink-0">
                <button
                  onClick={() => setShowAll(true)}
                  className="group flex flex-col items-center gap-1.5 md:gap-4 w-14 md:w-40"
                >
                  <div className="relative aspect-square w-full rounded-full overflow-hidden bg-soft-oatmeal/20 flex items-center justify-center shadow-inner group-hover:bg-soft-oatmeal/40 transition-all duration-500 p-3 md:p-8">
                    <div className="text-[#189D91] group-hover:scale-125 transition-transform duration-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </div>
                  </div>
                  <span className="text-[9px] md:text-sm font-semibold text-[#189D91] text-center tracking-tighter">More</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryQuickAccess;
