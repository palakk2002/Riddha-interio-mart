import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiCheck, FiEdit3, FiTrash2, FiImage } from 'react-icons/fi';
import { manageCategoriesData } from '../data/manageCategoriesData';

const ManageCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_categories');
      if (saved) {
        setCategories(JSON.parse(saved));
      } else {
        localStorage.setItem('admin_categories', JSON.stringify(manageCategoriesData));
        setCategories(manageCategoriesData);
      }
    } catch (err) {
      console.error('Failed to load categories from storage:', err);
      // Fallback to default if corrupted
      setCategories(manageCategoriesData);
    }
  }, []);

  const handleDelete = (id) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem('admin_categories', JSON.stringify(updated));
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">
              Manage Categories
            </h1>
            <p className="text-warm-sand mt-1 text-sm md:text-base font-medium">
              Control the homepage categories and their sub-collections.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/manage-categories/add')}
            className="w-14 h-14 bg-deep-espresso text-white rounded-2xl flex items-center justify-center shadow-xl hover:shadow-deep-espresso/30 hover:bg-dusty-cocoa transition-all active:scale-90"
          >
            <FiPlus size={24} />
          </button>
        </div>

        {/* Section Label */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-soft-oatmeal/40" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-warm-sand">
            Storefront Preview
          </span>
          <div className="h-px flex-1 bg-soft-oatmeal/40" />
        </div>

        {/* Category Cards Grid — mirrors user module CategoryCard style but more compact for admin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative"
              >
                {/* Card — mirrors user CategoryCard but more compact */}
                <div className="relative overflow-hidden rounded-[1.5rem] h-64 md:h-72 w-full shadow-lg hover:shadow-2xl transition-all duration-500 border border-soft-oatmeal/20">
                  {/* Background Image */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3B2F2F]/90 via-[#3B2F2F]/30 to-transparent group-hover:from-[#3B2F2F]/100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full">
                      <div className="transform transition-all duration-500 group-hover:-translate-y-1">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 tracking-tight line-clamp-1">
                          {cat.name}
                        </h3>

                        {/* Product Count Badge */}
                        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/20 text-soft-oatmeal/90 rounded-full text-[9px] uppercase tracking-[0.15em] font-bold mb-3">
                          {cat.productCount}+ Pieces
                        </span>

                        {/* Subcategory Chips - Single line for compact view */}
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1 overflow-hidden max-h-12">
                            {cat.subcategories.slice(0, 3).map((sub, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-white/5 backdrop-blur-md text-white/70 text-[8px] rounded-full border border-white/5 font-medium tracking-wide"
                              >
                                {sub.name}
                              </span>
                            ))}
                            {cat.subcategories.length > 3 && <span className="text-[8px] text-white/40">+{cat.subcategories.length - 3}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Action Buttons - More accessible */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => navigate(`/admin/manage-categories/edit/${cat.id}`)}
                      className="h-9 w-9 bg-white/95 backdrop-blur-md shadow-lg rounded-xl flex items-center justify-center text-deep-espresso hover:text-dusty-cocoa hover:bg-white transition-all transform hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit3 size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}
                      className="h-9 w-9 bg-white/95 backdrop-blur-md shadow-lg rounded-xl flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-white transition-all transform hover:scale-110"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Placeholder - Compact Version */}
          <motion.button
            layout
            onClick={() => navigate('/admin/manage-categories/add')}
            className="border-2 border-dashed border-soft-oatmeal/60 rounded-[1.5rem] h-64 md:h-72 flex flex-col items-center justify-center gap-3 text-warm-sand hover:border-dusty-cocoa hover:text-dusty-cocoa hover:bg-white/50 transition-all group active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-soft-oatmeal/10 flex items-center justify-center group-hover:bg-dusty-cocoa/10 transition-colors">
              <FiImage size={24} className="group-hover:scale-110 transition-transform opacity-50" />
            </div>
            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Add New Category</span>
          </motion.button>
        </div>

        {/* Summary Footer */}
        <div className="bg-white p-6 rounded-[24px] border border-soft-oatmeal/30 flex items-center justify-between text-xs text-warm-sand shadow-sm">
          <p className="font-medium">
            Currently maintaining <span className="font-bold text-deep-espresso">{categories.length}</span> active categories.
          </p>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-emerald-100">
            System Synchronized
          </span>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManageCategories;
