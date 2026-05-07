import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import kitchenImg from '../../../assets/hero_banner_kitchen.png';

// Dummy data for visual categories
const VISUAL_CATEGORIES = [
  {
    name: 'Modular Kitchen',
    image: kitchenImg,
    link: '/category/modular-kitchen'
  },
  {
    name: 'Luxury Furniture',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
    link: '/category/furniture'
  },
  {
    name: 'Designer Lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
    link: '/category/lighting'
  },
  {
    name: 'Smart Hardware',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
    link: '/category/hardware'
  },
  {
    name: 'Modern Decor',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    link: '/category/decor'
  },
  {
    name: 'Premium Flooring',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=400&q=80',
    link: '/category/flooring'
  }
];

const ShopByCategory = () => {
  return (
    <section className="py-1 md:py-8 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        <div className="flex items-center justify-between mb-2 md:mb-6">
          <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
          <Link to="/categories" className="flex items-center gap-1 text-[11px] md:text-sm font-bold text-[#189D91] hover:underline">
            View All <FiChevronRight />
          </Link>
        </div>

        {/* Horizontal Scroll Row */}
        <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-1 md:pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {VISUAL_CATEGORIES.map((cat, idx) => (
            <Link 
              key={idx} 
              to={cat.link}
              className="flex-shrink-0 w-[95px] md:w-[200px] group"
            >
              <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-1 md:mb-3 shadow-sm border border-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-[10px] md:text-base font-bold text-gray-800 group-hover:text-[#189D91] transition-colors leading-tight px-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
