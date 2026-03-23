import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { sellerCatalog } from '../data/sellerCatalog';
import { LuPlus, LuBox, LuTags, LuCheck, LuClock } from 'react-icons/lu';

const AddProduct = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Custom Product States
  const [customProduct, setCustomProduct] = useState({
    name: '',
    category: '',
    price: '',
    imageUrl: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const filteredCatalogProducts = sellerCatalog.products.filter(
    p => p.category === selectedCategory
  );

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">Add New Product</h1>
          <p className="text-warm-sand mt-2">Expand your inventory from the catalog or add something unique.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-soft-oatmeal overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-soft-oatmeal p-2 bg-soft-oatmeal/10">
            <button 
              onClick={() => setActiveTab('catalog')}
              className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-2xl transition-all duration-300 font-bold text-sm ${
                activeTab === 'catalog' 
                ? 'bg-white text-deep-espresso shadow-lg border border-soft-oatmeal' 
                : 'text-dusty-cocoa hover:bg-white/50'
              }`}
            >
              <LuBox size={18} />
              Add From Catalog
            </button>
            <button 
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-2xl transition-all duration-300 font-bold text-sm ${
                activeTab === 'custom' 
                ? 'bg-white text-deep-espresso shadow-lg border border-soft-oatmeal' 
                : 'text-dusty-cocoa hover:bg-white/50'
              }`}
            >
              <LuTags size={18} />
              Custom Listing
            </button>
          </div>

          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {activeTab === 'catalog' ? (
                <motion.form 
                  key="catalog"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Select Category</label>
                      <select 
                        required
                        value={selectedCategory}
                        onChange={(e) => { setSelectedCategory(e.target.value); setSelectedProduct(''); }}
                        className="w-full px-6 py-4 rounded-2xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white focus:outline-none transition-all font-medium"
                      >
                        <option value="">Choose Categories</option>
                        {sellerCatalog.categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Select Product</label>
                      <select 
                        required
                        disabled={!selectedCategory}
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white focus:outline-none transition-all font-medium disabled:opacity-50"
                      >
                        <option value="">Identify Product</option>
                        {filteredCatalogProducts.map(prod => (
                          <option key={prod.id} value={prod.name}>{prod.name} ({prod.code})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Your Selling Price (Rs.)</label>
                      <input 
                        type="number" 
                        required
                        placeholder="Enter your price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white focus:outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting || submitted}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
                      submitted 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-deep-espresso text-white hover:bg-dusty-cocoa shadow-deep-espresso/20'
                    }`}
                  >
                    {isSubmitting ? <LuClock className="animate-spin" /> : (submitted ? <LuCheck /> : <LuPlus />)}
                    {submitted ? 'Product Added' : 'Add to My Inventory'}
                  </button>
                </motion.form>
              ) : (
                <motion.form 
                  key="custom"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Product Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Enter full product name"
                        value={customProduct.name}
                        onChange={(e) => setCustomProduct({...customProduct, name: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white focus:outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Category</label>
                      <select 
                        required
                        value={customProduct.category}
                        onChange={(e) => setCustomProduct({...customProduct, category: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white focus:outline-none transition-all font-medium"
                      >
                        <option value="">Select Category</option>
                        {sellerCatalog.categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Price (Rs.)</label>
                      <input 
                        type="number" 
                        required
                        placeholder="Selling price"
                        value={customProduct.price}
                        onChange={(e) => setCustomProduct({...customProduct, price: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white focus:outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Image URL</label>
                      <input 
                        type="url" 
                        required
                        placeholder="https://example.com/image.jpg"
                        value={customProduct.imageUrl}
                        onChange={(e) => setCustomProduct({...customProduct, imageUrl: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white focus:outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting || submitted}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
                      submitted 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-dusty-cocoa text-white hover:bg-deep-espresso shadow-dusty-cocoa/20'
                    }`}
                  >
                    {isSubmitting ? <LuClock className="animate-spin" /> : (submitted ? <LuCheck /> : <LuPlus />)}
                    {submitted ? 'Listing Pending Approval' : 'Submit for Review'}
                  </button>
                  <p className="text-[10px] text-center text-warm-sand font-bold uppercase tracking-widest">Note: Custom products will be set to 'Pending' status until approved by admin.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AddProduct;
