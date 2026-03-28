import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import furnitureImg from '../../../assets/furniture.jpg';
import furniture2Img from '../../../assets/furniture2.jpg';
import mattressImg from '../../../assets/mattress_premium.png';
import wallDecorImg from '../../../assets/wall_decor_premium.png';
import vasesImg from '../../../assets/vases_premium.png';
import mirrorsImg from '../../../assets/mirrors_premium.png';
import lightingImg from '../../../assets/lighting.jpg';
import tapImg from '../../../assets/tap.jpg';

import { manageFavouriteCategoriesData } from '../../admin/data/manageFavouriteCategoriesData';

const FavouriteCategories = () => {
  const [data, setData] = useState({ tabs: [], categories: [] });
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('admin_favourite_categories');
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed);
      if (parsed.tabs.length > 0) setActiveTab(parsed.tabs[0]);
    } else {
      setData(manageFavouriteCategoriesData);
      if (manageFavouriteCategoriesData.tabs.length > 0) setActiveTab(manageFavouriteCategoriesData.tabs[0]);
    }
  }, []);

  const filteredCategories = data.categories.filter(cat => cat.category === activeTab);

  return (
    <section className="bg-soft-oatmeal/10 py-4 md:py-8 border-y border-soft-oatmeal/20">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
      {/* Title Section */}
      <div className="text-center mb-10 md:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-5xl font-display font-bold text-[var(--color-header-red)] tracking-tight mb-8 md:mb-16"
        >
          Our Favourite Categories
        </motion.h2>

        {/* Filter Tabs */}
        <div className="flex justify-start md:justify-center gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-2 px-4 md:px-0">
          {data.tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full border-2 transition-all duration-300 whitespace-nowrap text-xs md:text-sm font-bold ${activeTab === tab
                  ? 'border-[var(--color-header-red)] text-[var(--color-header-red)]'
                  : 'border-soft-oatmeal/20 text-deep-espresso/40 hover:border-soft-oatmeal/40'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Section */}
      <div className="min-h-[400px]"> {/* Prevents layout shift when filtering */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <motion.div
                  layout
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative flex flex-col bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-soft-oatmeal/10"
                >
                  <Link to={`/category/${cat.slug}`} className="block h-full">
                    {/* Image Container (Portrait aspect ratio like reference) */}
                    <div className="aspect-square md:aspect-[3/4] overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Category Label at bottom */}
                    <div className="py-3 px-2 text-center bg-white border-t border-soft-oatmeal/5">
                      <span className="text-[11px] md:text-sm font-medium text-deep-espresso/80 group-hover:text-warm-sand transition-colors tracking-tight">
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-deep-espresso/30"
              >
                <p className="text-lg font-medium italic">Coming Soon...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      </div>
    </section>
  );
};

export default FavouriteCategories;
