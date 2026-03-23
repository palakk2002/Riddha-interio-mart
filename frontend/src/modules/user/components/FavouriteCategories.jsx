import React, { useState } from 'react';
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

const FavouriteCategories = () => {
  const [activeTab, setActiveTab] = useState('Furniture');

  const tabs = ['Furniture', 'Mattresses', 'Home Goods'];

  const categories = [
    // Furniture
    { id: 1, name: 'Hydraulic Beds', category: 'Furniture', slug: 'beds', image: furnitureImg },
    { id: 2, name: 'Bean Bags', category: 'Furniture', slug: 'bean-bags', image: furniture2Img },
    { id: 3, name: 'Swings', category: 'Furniture', slug: 'swings', image: furnitureImg },
    { id: 4, name: 'Chairs', category: 'Furniture', slug: 'chairs', image: furniture2Img },
    { id: 5, name: 'Coffee Tables', category: 'Furniture', slug: 'tables', image: furnitureImg },
    { id: 6, name: 'Sofas', category: 'Furniture', slug: 'sofas', image: furniture2Img },
    
    // Mattresses
    { id: 7, name: 'Orthopedic', category: 'Mattresses', slug: 'ortho-mattress', image: mattressImg },
    { id: 8, name: 'Memory Foam', category: 'Mattresses', slug: 'memory-foam', image: mattressImg },
    { id: 9, name: 'Pocket Spring', category: 'Mattresses', slug: 'spring-mattress', image: mattressImg },
    { id: 10, name: 'Dual Comfort', category: 'Mattresses', slug: 'dual-comfort', image: mattressImg },
    { id: 11, name: 'Latex Premium', category: 'Mattresses', slug: 'latex-mattress', image: mattressImg },
    { id: 12, name: 'Hybrid Series', category: 'Mattresses', slug: 'hybrid-mattress', image: mattressImg },

    // Home Goods
    { id: 13, name: 'Wall Decor', category: 'Home Goods', slug: 'wall-decor', image: wallDecorImg },
    { id: 14, name: 'Designer Vases', category: 'Home Goods', slug: 'vases', image: vasesImg },
    { id: 15, name: 'Premium Carpets', category: 'Home Goods', slug: 'carpets', image: furnitureImg },
    { id: 16, name: 'Luxury Cushions', category: 'Home Goods', slug: 'cushions', image: furniture2Img },
    { id: 17, name: 'Modern Clocks', category: 'Home Goods', slug: 'clocks', image: lightingImg },
    { id: 18, name: 'Designer Mirrors', category: 'Home Goods', slug: 'mirrors', image: mirrorsImg },
  ];

  const filteredCategories = categories.filter(cat => cat.category === activeTab);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 pt-0 md:pt-24 pb-2 md:pb-24 bg-white">
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
        <div className="flex justify-start md:justify-center gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-2 px-4 md:px-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full border-2 transition-all duration-300 whitespace-nowrap text-xs md:text-sm font-bold ${activeTab === tab
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
