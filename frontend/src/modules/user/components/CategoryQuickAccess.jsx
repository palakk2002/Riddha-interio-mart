import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../data/categories';
import furnitureImg from '../../../assets/furniture.jpg';
import furniture2Img from '../../../assets/furniture2.jpg';
import lightingImg from '../../../assets/lighting.jpg';
import tapImg from '../../../assets/tap.jpg';

const CategoryQuickAccess = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Furniture', 'Luxury', 'Living Room', 'Bed Room', 'Decor'];
  
  // Combined categories with specific tab tags for filtering
  const allCategories = [
    { ...categories[0], tabs: ['Luxury'] }, // Tiles
    { ...categories[1], tabs: ['Decor'] }, // Paints
    { ...categories[2], tabs: ['Luxury', 'Decor'] }, // Electricals
    { ...categories[3], tabs: ['Furniture', 'Living Room', 'Bed Room'] }, // Furniture
    { id: 101, name: 'Home Decor', slug: 'decor', image: furniture2Img, tabs: ['Decor', 'Living Room'] },
    { id: 102, name: 'Kitchen', slug: 'kitchen', image: furnitureImg, tabs: ['Decor'] },
    { id: 103, name: 'Lamps', slug: 'lighting', image: lightingImg, tabs: ['Luxury', 'Decor'] },
    { id: 104, name: 'Furnishings', slug: 'furnishings', image: furniture2Img, tabs: ['Furniture', 'Decor'] },
    { id: 105, name: 'Bath', slug: 'bath', image: tapImg, tabs: ['Luxury'] },
    { id: 106, name: 'Curtains', slug: 'curtains', image: furnitureImg, tabs: ['Decor', 'Living Room'] }
  ];

  const filteredCategories = activeTab === 'All' 
    ? allCategories 
    : allCategories.filter(cat => cat.tabs.includes(activeTab));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <section className="pt-6 pb-0 md:py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Horizontal Category Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-2 md:mb-10 gap-6 md:gap-8 no-scrollbar items-center border-b border-soft-oatmeal/20 whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative text-[10px] md:text-xs font-black uppercase tracking-[0.2em] pb-3 md:pb-4 transition-all duration-300 ${
                activeTab === tab ? 'text-warm-sand' : 'text-deep-espresso/40 hover:text-deep-espresso/60'
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

        {/* Categories Grid/Scroll Area */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <motion.div 
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex md:grid md:grid-cols-5 lg:grid-cols-6 gap-x-6 md:gap-10 pb-4 md:pb-0 min-h-[140px] md:min-h-[200px]"
          >
            {/* 2-row grid for mobile scrolling, standard grid for desktop */}
            <div className="grid grid-rows-2 grid-flow-col gap-x-6 md:gap-x-10 gap-y-6 md:gap-y-10 md:contents">
              {filteredCategories.map((category) => (
                <motion.div key={category.id} variants={itemVariants} layout>
                  <Link
                    to={`/category/${category.slug}`}
                    className="group flex flex-col items-center gap-2 md:gap-4 w-20 md:w-auto shrink-0"
                  >
                    <div className="relative aspect-square w-full rounded-xl md:rounded-[2rem] overflow-hidden bg-soft-oatmeal/5 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-deep-espresso/0 group-hover:bg-deep-espresso/10 transition-colors duration-300" />
                    </div>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] text-deep-espresso/60 group-hover:text-warm-sand text-center transition-colors leading-tight">
                      {category.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CategoryQuickAccess;
