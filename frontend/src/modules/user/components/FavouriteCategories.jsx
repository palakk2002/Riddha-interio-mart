import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import furnitureImg from '../../../assets/furniture.jpg';
import furniture2Img from '../../../assets/furniture2.jpg';

const FavouriteCategories = () => {
  const [activeTab, setActiveTab] = useState('Furniture');
  
  const tabs = ['Furniture', 'Mattresses', 'Home Goods'];
  
  const categories = [
    { id: 1, name: 'Hydraulic Beds', category: 'Furniture', slug: 'beds', image: furnitureImg },
    { id: 2, name: 'Bean Bags', category: 'Furniture', slug: 'bean-bags', image: furniture2Img },
    { id: 3, name: 'Swings', category: 'Furniture', slug: 'swings', image: furnitureImg },
    { id: 4, name: 'Chairs', category: 'Furniture', slug: 'chairs', image: furniture2Img },
    { id: 5, name: 'Coffee Tables', category: 'Furniture', slug: 'tables', image: furnitureImg },
    { id: 6, name: 'Sofas', category: 'Furniture', slug: 'sofas', image: furniture2Img },
  ];

  // For now we only have data for Furniture, mock others as empty or same to show layout
  const filteredCategories = activeTab === 'Furniture' ? categories : [];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 pt-0 pb-12 md:py-24 bg-white">
      {/* Title Section */}
      <div className="text-center mb-10 md:mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-[#8B5E3C] tracking-tight mb-6 md:mb-10"
        >
          Our Favourite Categories
        </motion.h2>
        
        {/* Filter Tabs */}
        <div className="flex justify-center gap-3 md:gap-6 overflow-x-auto no-scrollbar pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full border-2 transition-all duration-300 whitespace-nowrap text-xs md:text-sm font-bold ${
                activeTab === tab 
                ? 'border-[#FF6B35] text-[#FF6B35]' 
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
                      <span className="text-[11px] md:text-sm font-medium text-deep-espresso/80 group-hover:text-[#FF6B35] transition-colors tracking-tight">
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
    </section>
  );
};

export default FavouriteCategories;
