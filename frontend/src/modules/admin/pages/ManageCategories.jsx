import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPlus, LuX, LuCheck, LuPen, LuTrash2, LuImage } from 'react-icons/lu';
import { manageCategoriesData } from '../data/manageCategoriesData';

const ManageCategories = () => {
  const [categories, setCategories] = useState(manageCategoriesData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    subcategoryName: '',
    image: '',
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name) return;

    const catToAdd = {
      id: Date.now(),
      name: newCategory.name,
      slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      image: newCategory.image || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
      productCount: 0,
      subcategories: newCategory.subcategoryName
        ? [{ name: newCategory.subcategoryName, image: newCategory.image || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80' }]
        : [],
    };

    setCategories([...categories, catToAdd]);
    setShowAddForm(false);
    setNewCategory({ name: '', subcategoryName: '', image: '' });
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
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
            <p className="text-warm-sand mt-1 text-sm md:text-base">
              Control the homepage categories section. Changes preview below.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-12 h-12 bg-dusty-cocoa text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-dusty-cocoa/40 transition-all active:scale-90"
          >
            {showAddForm ? <LuX size={24} /> : <LuPlus size={24} />}
          </button>
        </div>

        {/* Add Category Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-dashed border-warm-sand/30 shadow-sm">
                <h3 className="text-xl font-display font-bold text-deep-espresso mb-6">
                  Add New Category
                </h3>
                <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">
                      Category Name
                    </label>
                    <input
                      required
                      autoFocus
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                      placeholder="e.g. Premium Bathroom Fittings"
                    />
                  </div>

                  {/* Subcategory Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">
                      Subcategory Name
                    </label>
                    <input
                      type="text"
                      value={newCategory.subcategoryName}
                      onChange={(e) => setNewCategory({ ...newCategory, subcategoryName: e.target.value })}
                      className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                      placeholder="e.g. Shower Heads"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">
                      Image URL
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newCategory.image}
                        onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                        className="flex-grow bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                        placeholder="https://..."
                      />
                      <button
                        type="submit"
                        className="bg-deep-espresso text-white px-6 py-3 rounded-xl font-bold hover:bg-dusty-cocoa transition-all flex items-center gap-2 shadow-md whitespace-nowrap"
                      >
                        <LuCheck size={18} />
                        <span className="hidden md:inline">Add</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Label */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-soft-oatmeal/40" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-warm-sand">
            Homepage Preview
          </span>
          <div className="h-px flex-1 bg-soft-oatmeal/40" />
        </div>

        {/* Category Cards Grid — mirrors user module CategoryCard style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative"
              >
                {/* Card — mirrors user CategoryCard */}
                <div className="relative overflow-hidden rounded-[2rem] h-80 md:h-96 w-full shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Background Image */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3B2F2F]/95 via-[#3B2F2F]/40 to-transparent group-hover:from-[#3B2F2F]/100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                      <div className="transform transition-all duration-500 group-hover:-translate-y-1">
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 tracking-tight">
                          {cat.name}
                        </h3>

                        {/* Product Count Badge */}
                        <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-xl border border-white/20 text-soft-oatmeal rounded-full text-[10px] uppercase tracking-[0.15em] font-bold mb-3">
                          {cat.productCount}+ Pieces
                        </span>

                        {/* Subcategory Chips */}
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {cat.subcategories.map((sub, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-white/10 backdrop-blur-md text-white/80 text-[9px] rounded-full border border-white/10 font-medium tracking-wide"
                              >
                                {sub.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      className="h-10 w-10 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-deep-espresso hover:text-dusty-cocoa hover:bg-white transition-all"
                      title="Edit"
                    >
                      <LuPen size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="h-10 w-10 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-white transition-all"
                      title="Delete"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Placeholder */}
          {!showAddForm && (
            <motion.button
              layout
              onClick={() => setShowAddForm(true)}
              className="border-2 border-dashed border-soft-oatmeal rounded-[2rem] h-80 md:h-96 flex flex-col items-center justify-center gap-3 text-warm-sand hover:border-dusty-cocoa hover:text-dusty-cocoa hover:bg-white/50 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-soft-oatmeal/20 flex items-center justify-center group-hover:bg-dusty-cocoa/10 transition-colors">
                <LuImage size={28} className="group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-bold text-sm uppercase tracking-wider">Add Category</span>
            </motion.button>
          )}
        </div>

        {/* Summary Footer */}
        <div className="bg-white p-4 rounded-xl border border-soft-oatmeal/30 flex items-center justify-between text-xs text-warm-sand">
          <p>
            Showing <span className="font-bold text-deep-espresso">{categories.length}</span> categories on homepage
          </p>
          <span className="text-[10px] bg-golden-glow/30 text-deep-espresso/60 px-3 py-1 rounded-full font-bold border border-warm-sand/20">
            Frontend Preview Only
          </span>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManageCategories;
