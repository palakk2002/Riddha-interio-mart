import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';
import { LuArrowLeft, LuCheck, LuImage, LuPackagePlus, LuStar, LuType, LuChevronRight } from 'react-icons/lu';

const AddFeaturedProductPage = () => {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    rating: '4.5',
    tag: 'Top Choice',
    image: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    // Simulate API call/Storage
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

    console.log('Featured Product Added:', productToAdd);
    // In a real app, we'd update global state or hit an API
    navigate('/admin/manage-featured');
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumbs / Back button */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-warm-sand mb-2">
          <button onClick={() => navigate('/admin/manage-featured')} className="hover:text-deep-espresso transition-colors">Featured</button>
          <LuChevronRight size={12} />
          <span className="text-deep-espresso">Add New</span>
        </div>

        <button 
          onClick={() => navigate('/admin/manage-featured')}
          className="flex items-center gap-2 text-warm-sand font-bold hover:text-deep-espresso transition-colors group"
        >
          <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Featured List
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-deep-espresso flex items-center gap-3">
              <LuStar className="text-golden-glow fill-golden-glow" size={32} />
              Add Featured Product
            </h1>
            <p className="text-warm-sand mt-1">Designate a premium item for your store's homepage highlights.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-12">
          <div className="bg-white rounded-[32px] border border-soft-oatmeal shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
            {/* Left: Image Preview Area */}
            <div className="p-8 bg-soft-oatmeal/10 border-r border-soft-oatmeal flex flex-col items-center justify-center space-y-6">
              <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-soft-oatmeal flex flex-col items-center justify-center overflow-hidden bg-white/50 relative group shadow-inner">
                {newProduct.image ? (
                  <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-warm-sand">
                    <LuImage size={48} className="opacity-20 translate-y-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Image Preview</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-deep-espresso/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">Preview updates below</span>
                </div>
              </div>
              
              <div className="w-full space-y-3">
                <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                  <LuImage size={12} /> Image URL
                </label>
                <input 
                  type="url" 
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  className="w-full bg-white border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all shadow-sm"
                  placeholder="Paste Unsplash or image link..."
                />
              </div>
            </div>

            {/* Right: Detailed Fields */}
            <div className="lg:col-span-2 p-8 md:p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                    <LuType size={12} /> Product Name
                  </label>
                  <input 
                    required autoFocus
                    type="text" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                    placeholder="e.g. Modern Velvet Sofa"
                  />
                </div>

                {/* Price */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                    <span className="text-lg leading-none">₹</span> Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand font-bold">₹</span>
                    <input 
                      required
                      type="number" 
                      min="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl pl-9 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                    <LuStar size={12} /> Rating (Out of 5)
                  </label>
                  <input 
                    type="number" 
                    min="1" max="5" step="0.1"
                    value={newProduct.rating}
                    onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                  />
                </div>

                {/* Tag Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                    <LuCheck size={12} /> Promotion Tag
                  </label>
                  <select 
                    value={newProduct.tag}
                    onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all cursor-pointer appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C0A483' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                  >
                    <option value="Top Choice">Top Choice</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Premium">Premium</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Trending">Trending</option>
                  </select>
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4 border-t border-soft-oatmeal/50">
                <button 
                  type="button"
                  onClick={() => navigate('/admin/manage-featured')}
                  className="px-8 py-4 rounded-xl font-bold text-warm-sand hover:bg-soft-oatmeal/20 transition-all uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-deep-espresso text-white font-black uppercase tracking-[0.2em] text-xs px-10 py-4 rounded-xl hover:bg-dusty-cocoa transition-all shadow-xl shadow-deep-espresso/20 flex items-center gap-3"
                >
                  <LuCheck size={18} /> Add to Featured Highlights
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default AddFeaturedProductPage;
