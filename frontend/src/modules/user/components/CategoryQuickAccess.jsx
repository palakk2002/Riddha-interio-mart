import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LuSofa, LuLampFloor, LuLayoutGrid, LuFlower2, LuHammer, 
  LuChefHat, LuBath, LuBriefcase, LuUmbrella, LuShapes 
} from 'react-icons/lu';
import api from '../../../shared/utils/api';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const getCategoryConfig = (name) => {
  const n = name.toLowerCase();
  // Matching icons and colors EXACTLY to the reference image provided by user
  if (n.includes('furniture')) return { icon: LuSofa, color: '#115E59' }; // Dark Teal
  if (n.includes('lighting')) return { icon: LuLampFloor, color: '#FB923C' }; // Orange
  if (n.includes('wall')) return { icon: LuLayoutGrid, color: '#8B5CF6' }; // Purple
  if (n.includes('decor')) return { icon: LuFlower2, color: '#EC4899' }; // Pink
  if (n.includes('hardware')) return { icon: LuHammer, color: '#3B82F6' }; // Blue
  if (n.includes('flooring')) return { icon: LuLayoutGrid, color: '#EA580C' }; // Orange-Brown
  if (n.includes('kitchen')) return { icon: LuChefHat, color: '#22C55E' }; // Green
  if (n.includes('bathroom')) return { icon: LuBath, color: '#0D9488' }; // Cyan-Teal
  if (n.includes('office')) return { icon: LuBriefcase, color: '#2563EB' }; // Blue
  if (n.includes('outdoor')) return { icon: LuUmbrella, color: '#84CC16' }; // Lime
  return { icon: LuShapes, color: '#64748B' }; // Default
};

const QUICK_CATEGORIES = [
  { name: 'Furniture', slug: 'furniture' },
  { name: 'Lighting', slug: 'lighting' },
  { name: 'Wall Solutions', slug: 'wall-solutions' },
  { name: 'Decor', slug: 'decor' },
  { name: 'Hardware', slug: 'hardware' },
  { name: 'Flooring', slug: 'flooring' },
  { name: 'Modular Kitchen', slug: 'modular-kitchen' },
  { name: 'Bathroom', slug: 'bathroom' },
  { name: 'Office Furniture', slug: 'office-furniture' },
  { name: 'Outdoor', slug: 'outdoor' }
];

const CategoryQuickAccess = () => {
  return (
    <section className="pt-1 pb-1 md:pt-4 md:pb-0 bg-white overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12">
        <div className="flex items-center overflow-x-auto no-scrollbar gap-2 md:gap-2 pb-2 md:pb-4 scroll-smooth">
          {QUICK_CATEGORIES.map((category, idx) => {
            const config = getCategoryConfig(category.name);
            const Icon = config.icon;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Link
                  to={`/category/${category.slug}`}
                  className="group flex flex-col items-center justify-center min-w-[80px] md:min-w-[130px] transition-all duration-300"
                >
                  <div 
                    className="mb-2 md:mb-3 h-14 w-14 md:h-22 md:w-32 rounded-full md:rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <Icon 
                      className="w-7 h-7 md:w-11 md:h-11" 
                      style={{ color: config.color }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-[10px] md:text-[13px] font-bold text-gray-800 text-center px-1 group-hover:text-black transition-colors leading-tight">
                    {toTitleCase(category.name)}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryQuickAccess;


