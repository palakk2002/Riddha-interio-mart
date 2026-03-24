import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPlus, LuX, LuCheck, LuPen, LuTrash2, LuLayoutGrid } from 'react-icons/lu';
import { categoryGridData } from '../data/manageCategoryGridData';

const ManageCategoryGrid = () => {
  const [categories, setCategories] = useState(
    [...categoryGridData].sort((a, b) => a.displayOrder - b.displayOrder)
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: '',
    displayOrder: '',
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name) return;

    const catToAdd = {
      id: Date.now(),
      name: newCategory.name,
      image: newCategory.image || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80',
      displayOrder: parseInt(newCategory.displayOrder) || categories.length + 1,
    };

    const updated = [...categories, catToAdd].sort((a, b) => a.displayOrder - b.displayOrder);
    setCategories(updated);
    setShowAddForm(false);
    setNewCategory({ name: '', image: '', displayOrder: '' });
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
              Category Grid
            </h1>
            <p className="text-warm-sand mt-1 text-sm md:text-base">
              Manage the homepage quick-access category grid.
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
              <div className="bg-white p-4 md:p-6 rounded-xl border border-soft-oatmeal shadow-sm mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-display font-bold text-deep-espresso">
                    Add Grid Item
                  </h3>
                  <button onClick={() => setShowAddForm(false)} className="text-warm-sand hover:text-deep-espresso">
                    <LuX size={16} />
                  </button>
                </div>
                <form onSubmit={handleAddCategory} className="flex flex-wrap md:flex-nowrap items-end gap-4">
                  {/* Category Name */}
                  <div className="flex-1 min-w-[150px] space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-sand uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      required
                      autoFocus
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-warm-sand transition-all text-xs"
                      placeholder="e.g. Curtains"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="flex-[2] min-w-[200px] space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-sand uppercase tracking-wider">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={newCategory.image}
                      onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-warm-sand transition-all text-xs"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Display Order */}
                  <div className="w-24 space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-sand uppercase tracking-wider">
                      Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newCategory.displayOrder}
                      onChange={(e) => setNewCategory({ ...newCategory, displayOrder: e.target.value })}
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-warm-sand transition-all text-xs"
                      placeholder="1"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-deep-espresso text-white px-5 py-2 rounded-lg font-bold hover:bg-dusty-cocoa transition-all flex items-center gap-2 shadow-sm whitespace-nowrap text-xs"
                  >
                    <LuCheck size={14} />
                    Add
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Label */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-soft-oatmeal/20" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-warm-sand/60">
            Grid View
          </span>
          <div className="h-px flex-1 bg-soft-oatmeal/20" />
        </div>

        {/* Category Grid — mirrors user CategoryQuickAccess.jsx */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4"
        >
          <AnimatePresence>
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col items-center gap-2"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-soft-oatmeal/5 shadow-sm group-hover:shadow-lg transition-all duration-500">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-deep-espresso/0 group-hover:bg-deep-espresso/5 transition-colors duration-300" />

                  {/* Order Badge */}
                  <div className="absolute top-1.5 left-1.5">
                    <span className="bg-white/95 backdrop-blur-md text-deep-espresso text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      {cat.displayOrder}
                    </span>
                  </div>

                  {/* Admin Actions */}
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      className="h-6 w-6 bg-white/95 shadow-md rounded-full flex items-center justify-center text-deep-espresso hover:text-dusty-cocoa transition-all"
                      title="Edit"
                    >
                      <LuPen size={10} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="h-6 w-6 bg-white/95 shadow-md rounded-full flex items-center justify-center text-red-400 hover:text-red-600 transition-all"
                      title="Delete"
                    >
                      <LuTrash2 size={10} />
                    </button>
                  </div>
                </div>

                {/* Label */}
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider text-deep-espresso/50 group-hover:text-warm-sand text-center transition-colors leading-tight truncate w-full px-1">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Placeholder */}
          {!showAddForm && (
            <motion.button
              layout
              onClick={() => setShowAddForm(true)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="aspect-square w-full rounded-xl border border-dashed border-soft-oatmeal flex items-center justify-center hover:border-dusty-cocoa hover:bg-white/50 transition-all">
                <div className="flex flex-col items-center gap-1 text-warm-sand/60 group-hover:text-dusty-cocoa transition-colors">
                  <LuPlus size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-bold uppercase tracking-tighter">Add</span>
                </div>
              </div>
            </motion.button>
          )}
        </motion.div>

        {/* Summary Footer */}
        <div className="bg-white p-4 rounded-xl border border-soft-oatmeal/30 flex items-center justify-between text-xs text-warm-sand">
          <p>
            Showing <span className="font-bold text-deep-espresso">{categories.length}</span> categories in grid
          </p>
          <span className="text-[10px] bg-golden-glow/30 text-deep-espresso/60 px-3 py-1 rounded-full font-bold border border-warm-sand/20">
            Frontend Preview Only
          </span>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManageCategoryGrid;
