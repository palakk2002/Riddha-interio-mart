import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../data/categories';
import furnitureImg from '../../../assets/furniture.jpg';
import furniture2Img from '../../../assets/furniture2.jpg';
import lightingImg from '../../../assets/lighting.jpg';
import tapImg from '../../../assets/tap.jpg';

const CategoryQuickAccess = ({ isScrollable = false }) => {
  const [activeTab, setActiveTab] = useState('All');

  // Derive tabs from category names
  const tabs = ['All', ...categories.map(cat => cat.name)];

  const filteredCategories = activeTab === 'All'
    ? categories
    : categories.filter(cat => cat.name === activeTab);

  return (
    <section className="pt-1 pb-0 md:py-12 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Horizontal Category Tabs - Hidden when in scrollable mode (subcategory pages) */}
        {!isScrollable && (
          <div className="flex overflow-x-auto pb-4 mb-1 md:mb-10 gap-6 md:gap-8 no-scrollbar items-center border-b border-soft-oatmeal/20 whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative text-[10px] md:text-sm font-black uppercase tracking-[0.2em] pb-3 md:pb-4 transition-all duration-300 ${activeTab === tab ? 'text-black' : 'text-deep-espresso/40 hover:text-deep-espresso/60'
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-warm-sand"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Categories Grid/Scroll Area */}
        <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory px-0 md:px-0">
          <div
            className={`${isScrollable ? 'flex pb-2 pt-1' : 'flex md:grid md:grid-cols-5 lg:grid-cols-6 pb-6 md:pb-0'} gap-x-4 md:gap-12 min-h-[120px] md:min-h-[180px]`}
          >
            {/* Conditional Layout for Home vs Subcategory Page */}
            {!isScrollable ? (
              <div className="grid grid-rows-2 grid-flow-col gap-x-4 md:gap-x-12 gap-y-6 md:gap-y-12 md:contents px-2 md:px-0">
                {filteredCategories.map((category, index) => (
                  <CategoryItem key={category.id} category={category} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex gap-x-4 md:gap-x-12 px-4 md:px-0">
                {filteredCategories.map((category, index) => (
                  <CategoryItem key={category.id} category={category} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryItem = ({ category, index }) => (
  <div
    className="snap-start shrink-0"
  >
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-2 md:gap-4 w-16 md:w-40"
    >
      <div className="relative aspect-square w-full rounded-xl md:rounded-[2rem] overflow-hidden bg-soft-oatmeal/5 shadow-sm group-hover:shadow-lg transition-all duration-500">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-deep-espresso/0 group-hover:bg-deep-espresso/5 transition-colors duration-300" />
      </div>
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-tight text-deep-espresso/60 group-hover:text-warm-sand text-center transition-colors leading-tight min-h-[2em] flex items-center justify-center">
        {category.name}
      </span>
    </Link>
  </div>
);

export default CategoryQuickAccess;
