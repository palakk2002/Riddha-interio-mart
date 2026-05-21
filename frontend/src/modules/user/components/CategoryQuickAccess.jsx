import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import api from '../../../shared/utils/api';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const getCategoryIconAndColor = (categoryName, iconKey) => {
  const n = categoryName.toLowerCase();
  let color = '#189D91'; // Default Brand Teal
  
  if (n.includes('furniture')) color = '#115E59'; // Dark Teal
  else if (n.includes('lighting')) color = '#FB923C'; // Orange
  else if (n.includes('wall')) color = '#8B5CF6'; // Purple
  else if (n.includes('decor')) color = '#EC4899'; // Pink
  else if (n.includes('hardware')) color = '#3B82F6'; // Blue
  else if (n.includes('flooring')) color = '#EA580C'; // Orange-Brown
  else if (n.includes('kitchen')) color = '#22C55E'; // Green
  else if (n.includes('bathroom')) color = '#0D9488'; // Cyan-Teal
  else if (n.includes('office')) color = '#2563EB'; // Blue
  else if (n.includes('outdoor')) color = '#84CC16'; // Lime

  let IconComponent = LuIcons.LuShapes;
  let isCustomImage = false;

  if (iconKey) {
    if (iconKey.startsWith('http://') || iconKey.startsWith('https://') || iconKey.startsWith('/')) {
      isCustomImage = true;
    } else {
      const cleanKey = iconKey.startsWith('Lu') ? iconKey : `Lu${iconKey}`;
      if (cleanKey in LuIcons) {
        IconComponent = LuIcons[cleanKey];
      }
    }
  } else {
    // Fallback legacy mapping based on category name
    if (n.includes('furniture')) IconComponent = LuIcons.LuSofa;
    else if (n.includes('lighting')) IconComponent = LuIcons.LuLampFloor;
    else if (n.includes('wall')) IconComponent = LuIcons.LuLayoutGrid;
    else if (n.includes('decor')) IconComponent = LuIcons.LuFlower2;
    else if (n.includes('hardware')) IconComponent = LuIcons.LuHammer;
    else if (n.includes('flooring')) IconComponent = LuIcons.LuLayoutGrid;
    else if (n.includes('kitchen')) IconComponent = LuIcons.LuChefHat;
    else if (n.includes('bathroom')) IconComponent = LuIcons.LuBath;
    else if (n.includes('office')) IconComponent = LuIcons.LuBriefcase;
    else if (n.includes('outdoor')) IconComponent = LuIcons.LuUmbrella;
  }

  return { IconComponent, color, isCustomImage };
};

const CategoryQuickAccess = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading || categories.length === 0) {
    return null; // Gracefully hide quick access if loading or empty
  }

  return (
    <section className="py-2 md:pt-3 md:pb-2 bg-white overflow-hidden border-b border-gray-50">
      <div className="max-w-[1700px] mx-auto px-4 md:px-12">
        <div className="flex items-center overflow-x-auto no-scrollbar gap-2 md:gap-0 pb-1 scroll-smooth justify-start md:justify-between w-full">
          {categories.map((category, idx) => {
            const { IconComponent, color, isCustomImage } = getCategoryIconAndColor(category.name, category.icon);
            const slug = category.slug || category.name.toLowerCase().replace(/ /g, '-');

            return (
              <motion.div
                key={category._id || idx}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Link
                  to={`/category/${slug}`}
                  className="group flex flex-col items-center justify-center min-w-[64px] md:min-w-[90px] transition-all duration-300 py-1"
                >
                  <div 
                    className="mb-1.5 h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    {isCustomImage ? (
                      <img 
                        src={category.icon} 
                        alt={category.name} 
                        className="w-5 h-5 md:w-7 md:h-7 object-contain" 
                      />
                    ) : (
                      <IconComponent 
                        className="w-5 h-5 md:w-7 md:h-7" 
                        style={{ color: color }}
                        strokeWidth={1.5}
                      />
                    )}
                  </div>
                  <span className="text-[9px] md:text-[11px] font-bold text-gray-600 text-center px-0.5 group-hover:text-gray-900 transition-colors leading-tight">
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


