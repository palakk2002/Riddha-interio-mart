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

const CategoryQuickAccess = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="py-10 flex items-center justify-center gap-4 overflow-x-auto no-scrollbar px-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="min-w-[110px] h-[90px] bg-gray-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="py-1 md:py-10 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-center overflow-x-auto no-scrollbar gap-2 md:gap-4 pb-2 md:pb-4 scroll-smooth">
          {categories.map((category) => {
            const config = getCategoryConfig(category.name);
            const Icon = config.icon;

            return (
              <motion.div
                key={category._id}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Link
                  to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group flex flex-col items-center justify-center min-w-[82px] md:min-w-[135px] h-[72px] md:h-[110px] bg-white border border-gray-100 rounded-[12px] md:rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:border-gray-200 transition-all duration-300"
                >
                  <div className="mb-0.5 md:mb-3 flex items-center justify-center">
                    <Icon 
                      size={22} 
                      style={{ color: config.color }} 
                      strokeWidth={1.4}
                      className="md:w-10 md:h-10 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[8.5px] md:text-[12px] font-bold text-gray-700 text-center px-1 group-hover:text-black transition-colors leading-tight">
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


