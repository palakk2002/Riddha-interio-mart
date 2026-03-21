import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPlus, LuX, LuCheck, LuPen, LuTrash2, LuStar, LuPackagePlus } from 'react-icons/lu';
import { FiStar } from 'react-icons/fi';
import { manageFeaturedData } from '../data/manageFeaturedData';

const ManageFeaturedProducts = () => {
  const [products, setProducts] = useState(manageFeaturedData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    rating: '',
    tag: 'Top Choice',
    image: '',
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const productToAdd = {
      id: Date.now(),
      name: newProduct.name,
      category: 'Featured',
      price: parseFloat(newProduct.price) || 0,
      originalPrice: Math.round((parseFloat(newProduct.price) || 0) * 1.2),
      image: newProduct.image || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
      rating: parseFloat(newProduct.rating) || 4.5,
      tag: newProduct.tag || 'Top Choice',
    };

    setProducts([...products, productToAdd]);
    setShowAddForm(false);
    setNewProduct({ name: '', price: '', rating: '', tag: 'Top Choice', image: '' });
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">
              Featured Products
            </h1>
            <p className="text-warm-sand mt-1 text-sm md:text-base">
              Control the homepage Featured Highlights section.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 bg-dusty-cocoa text-white px-6 py-3 rounded-xl font-bold hover:bg-deep-espresso transition-all shadow-md shadow-dusty-cocoa/20 active:scale-95"
          >
            {showAddForm ? <LuX size={18} /> : <LuPlus size={18} />}
            {showAddForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {/* Add Product Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-soft-oatmeal shadow-lg">
                <h3 className="text-xl font-display font-bold text-deep-espresso mb-6">
                  New Featured Product
                </h3>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                  {/* Product Name */}
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">
                      Product Name
                    </label>
                    <input
                      required
                      autoFocus
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                      placeholder="e.g. Italian Marble Tile"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">
                      Price ($)
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">
                      Rating
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={newProduct.rating}
                      onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                      className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                      placeholder="4.5"
                    />
                  </div>

                  {/* Tag */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">
                      Tag
                    </label>
                    <select
                      value={newProduct.tag}
                      onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                      className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                    >
                      <option value="Top Choice">Top Choice</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Premium">Premium</option>
                      <option value="New Arrival">New Arrival</option>
                      <option value="Trending">Trending</option>
                    </select>
                  </div>

                  {/* Image URL + Submit */}
                  <div className="space-y-2 lg:col-span-5">
                    <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">
                      Image URL
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="flex-grow bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                        placeholder="https://images.unsplash.com/..."
                      />
                      <button
                        type="submit"
                        className="bg-deep-espresso text-white px-8 py-3 rounded-xl font-bold hover:bg-dusty-cocoa transition-all flex items-center gap-2 shadow-md whitespace-nowrap"
                      >
                        <LuCheck size={18} />
                        Add Product
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

        {/* Product Cards Grid — mirrors user module ProductCard style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group bg-white rounded-2xl md:rounded-3xl border border-soft-oatmeal/20 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 md:h-72 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Tag Badge */}
                  {product.tag && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-golden-glow/90 backdrop-blur-md text-deep-espresso text-[9px] md:text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                        {product.tag}
                      </span>
                    </div>
                  )}

                  {/* Admin Actions on Hover */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      className="h-9 w-9 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-deep-espresso hover:text-dusty-cocoa transition-all"
                      title="Edit"
                    >
                      <LuPen size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="h-9 w-9 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-red-400 hover:text-red-600 transition-all"
                      title="Delete"
                    >
                      <LuTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-6 flex flex-col justify-between space-y-3 md:space-y-5">
                  <div className="space-y-2">
                    {/* Category + Rating */}
                    <div className="flex justify-between items-start">
                      <h4 className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-warm-sand font-black">
                        {product.category}
                      </h4>
                      <div className="flex items-center text-[9px] md:text-[11px] text-amber-500 font-bold bg-amber-50/50 px-2 py-0.5 md:py-1 rounded-full ring-1 ring-amber-100">
                        <FiStar className="h-3 w-3 fill-amber-500 mr-1" />
                        {product.rating}
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm md:text-lg font-display font-bold text-deep-espresso line-clamp-2 leading-tight group-hover:text-warm-sand transition-colors duration-300">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-2 md:pt-4 border-t border-soft-oatmeal/10">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl md:text-2xl font-black text-deep-espresso tracking-tight">
                          ${product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[10px] md:text-xs text-gray-400 line-through font-medium">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] md:text-[10px] text-deep-espresso/30 font-bold uppercase tracking-widest">
                        Incl. GST
                      </span>
                    </div>

                    {/* Tag Pill (visual consistency) */}
                    <span className="text-[8px] md:text-[9px] bg-soft-oatmeal/30 text-dusty-cocoa px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      {product.tag}
                    </span>
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
              className="border-2 border-dashed border-soft-oatmeal rounded-2xl md:rounded-3xl min-h-[320px] md:min-h-[420px] flex flex-col items-center justify-center gap-3 text-warm-sand hover:border-dusty-cocoa hover:text-dusty-cocoa hover:bg-white/50 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-soft-oatmeal/20 flex items-center justify-center group-hover:bg-dusty-cocoa/10 transition-colors">
                <LuPackagePlus size={28} className="group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-bold text-sm uppercase tracking-wider">Add Product</span>
            </motion.button>
          )}
        </div>

        {/* Summary Footer */}
        <div className="bg-white p-4 rounded-xl border border-soft-oatmeal/30 flex items-center justify-between text-xs text-warm-sand">
          <p>
            Showing <span className="font-bold text-deep-espresso">{products.length}</span> featured products on homepage
          </p>
          <span className="text-[10px] bg-golden-glow/30 text-deep-espresso/60 px-3 py-1 rounded-full font-bold border border-warm-sand/20">
            Frontend Preview Only
          </span>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManageFeaturedProducts;
