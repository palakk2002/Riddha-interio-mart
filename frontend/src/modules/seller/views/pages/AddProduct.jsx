import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { sellerCatalog } from '../../models/sellerCatalog';
import { LuPlus, LuBox, LuTags, LuCheck, LuClock, LuUpload, LuX, LuImage } from 'react-icons/lu';

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomProduct({ ...customProduct, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create product data
    const newProduct = activeTab === 'catalog' 
      ? {
          id: Date.now(),
          name: selectedProduct,
          category: selectedCategory,
          price: price,
          status: 'approved',
          image: "https://images.unsplash.com/photo-1621506289937-4c44a0e9432e?w=800&q=80", // Default or lookup image
          dateAdded: new Date().toISOString().split('T')[0]
        }
      : {
          id: Date.now(),
          name: customProduct.name,
          category: customProduct.category,
          price: customProduct.price,
          status: 'pending',
          image: customProduct.imageUrl,
          dateAdded: new Date().toISOString().split('T')[0]
        };

    // Save to localStorage
    const existingProducts = JSON.parse(localStorage.getItem('seller_added_products') || '[]');
    localStorage.setItem('seller_added_products', JSON.stringify([...existingProducts, newProduct]));

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      
      // Reset form
      if (activeTab === 'catalog') {
        setSelectedCategory('');
        setSelectedProduct('');
        setPrice('');
      } else {
        setCustomProduct({ name: '', category: '', price: '', imageUrl: '', description: '' });
      }
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
                      ? 'bg-red-800 text-white' 
                      : 'bg-red-800 text-white hover:bg-deep-espresso shadow-red-900/20'
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Product Image</label>
                      <div className="relative">
                        {customProduct.imageUrl ? (
                          <div className="relative group w-full aspect-[21/9] rounded-2xl overflow-hidden border-2 border-soft-oatmeal bg-white">
                            <img src={customProduct.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-deep-espresso/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                type="button"
                                onClick={() => setCustomProduct({ ...customProduct, imageUrl: '' })}
                                className="bg-white text-red-600 p-3 rounded-xl shadow-xl hover:scale-110 transition-transform flex items-center gap-2 font-bold text-xs uppercase"
                              >
                                <LuX size={18} /> Remove Image
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-soft-oatmeal bg-soft-oatmeal/10 hover:bg-soft-oatmeal/20 transition-all cursor-pointer group">
                            <div className="flex flex-col items-center gap-3 text-warm-sand group-hover:text-deep-espresso transition-colors">
                              <div className="p-4 rounded-xl bg-white shadow-sm ring-1 ring-soft-oatmeal group-hover:shadow-md transition-all">
                                <LuImage size={32} />
                              </div>
                              <div className="text-center">
                                <p className="font-bold text-sm">Click to upload product image</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">PNG, JPG or JPEG (Max 2MB)</p>
                              </div>
                            </div>
                            <input 
                              type="file" 
                              required
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting || submitted}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
                      submitted 
                      ? 'bg-red-800 text-white' 
                      : 'bg-red-800 text-white hover:bg-deep-espresso shadow-red-900/20'
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
