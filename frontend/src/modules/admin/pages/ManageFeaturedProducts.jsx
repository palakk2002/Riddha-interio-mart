import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPlus, LuPen, LuTrash2, LuPackagePlus } from 'react-icons/lu';
import { manageFeaturedData } from '../data/manageFeaturedData';

const ManageFeaturedProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('admin_featured_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      localStorage.setItem('admin_featured_products', JSON.stringify(manageFeaturedData));
      setProducts(manageFeaturedData);
    }
  }, []);

  const handleDelete = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('admin_featured_products', JSON.stringify(updated));
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
            onClick={() => navigate('/admin/manage-featured/add')}
            className="flex items-center justify-center gap-2 bg-dusty-cocoa text-white px-6 py-3 rounded-xl font-bold hover:bg-deep-espresso transition-all shadow-md shadow-dusty-cocoa/20 active:scale-95"
          >
            <LuPlus size={18} />
            Add Featured Product
          </button>
        </div>

        {/* Section Label */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-soft-oatmeal/40" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-warm-sand">
            Homepage Preview
          </span>
          <div className="h-px flex-1 bg-soft-oatmeal/40" />
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group bg-white rounded-xl md:rounded-2xl border border-soft-oatmeal/20 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-20 md:h-32 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Tag Badge */}
                  {product.tag && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-golden-glow/90 backdrop-blur-md text-deep-espresso text-[7px] md:text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
                        {product.tag}
                      </span>
                    </div>
                  )}

                  {/* Admin Actions on Hover */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      className="h-7 w-7 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-deep-espresso hover:text-dusty-cocoa transition-all"
                      title="Edit"
                    >
                      <LuPen size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="h-7 w-7 bg-white/90 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-red-400 hover:text-red-600 transition-all"
                      title="Delete"
                    >
                      <LuTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-1 md:p-2 flex flex-col justify-between space-y-0.5 md:space-y-1">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-warm-sand font-black">
                        {product.category}
                      </h4>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-[9px] md:text-[11px] font-display font-bold text-deep-espresso line-clamp-1 leading-tight group-hover:text-warm-sand transition-colors duration-300">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-1 md:pt-2 border-t border-soft-oatmeal/10">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm md:text-base font-black text-deep-espresso tracking-tight">
                          ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[10px] md:text-xs text-gray-400 line-through font-medium">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[7px] md:text-[8px] text-deep-espresso/30 font-bold uppercase tracking-widest leading-none">
                        Incl. GST
                      </span>
                    </div>

                    {/* Tag Pill (visual consistency) */}
                    <span className="text-[7px] md:text-[8px] bg-soft-oatmeal/30 text-dusty-cocoa px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {product.tag}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Placeholder */}
          <motion.button
            layout
            onClick={() => navigate('/admin/manage-featured/add')}
            className="border-2 border-dashed border-soft-oatmeal rounded-2xl md:rounded-3xl min-h-[180px] md:min-h-[260px] flex flex-col items-center justify-center gap-1.5 text-warm-sand hover:border-dusty-cocoa hover:text-dusty-cocoa hover:bg-white/50 transition-all group active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-soft-oatmeal/20 flex items-center justify-center group-hover:bg-dusty-cocoa/10 transition-colors">
              <LuPackagePlus size={18} className="group-hover:scale-110 transition-transform opacity-60" />
            </div>
            <span className="font-bold text-[9px] md:text-[10px] uppercase tracking-wider">Add Product</span>
          </motion.button>
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
