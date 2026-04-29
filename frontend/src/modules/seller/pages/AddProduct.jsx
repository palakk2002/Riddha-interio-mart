import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPlus, LuBox, LuTags, LuCheck, LuClock, LuImage, LuVideo, LuX, LuTrash2 } from 'react-icons/lu';
import api from '../../../shared/utils/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const catalogId = queryParams.get('catalogId');
  const [selection, setSelection] = useState(null); // 'new' or 'catalog'
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imgFiles, setImgFiles] = useState([]);
  
  // Custom Dropdown State
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [subSearch, setSubSearch] = useState('');

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    subcategory: '',
    brand: '',
    material: '',
    dimensions: '',
    thickness: '',
    color: '',
    unit: 'piece',
    unitValue: '1',
    countInStock: '',
    images: [], // Array of base64
    videoUrl: ''
  });

  useEffect(() => {
    fetchInitialData();
    if (catalogId) {
      fetchCatalogItem();
    }
  }, [catalogId]);

  const fetchCatalogItem = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/catalog/${catalogId}`);
      const item = data.data;
      
      // Find brand ID if it's a name or object
      let brandId = '';
      if (item.brand) {
        brandId = typeof item.brand === 'object' ? item.brand._id : item.brand;
      }

      setFormData(prev => ({
        ...prev,
        name: item.name || '',
        sku: item.sku || '',
        description: item.description || '',
        category: item.category || '',
        subcategory: item.subcategory || '',
        brand: brandId,
        material: item.material || '',
        dimensions: item.dimensions || '',
        thickness: item.thickness || '',
        color: item.color || '',
        images: item.images || [],
      }));
      setSelection('catalog');
    } catch (err) {
      console.error('Failed to fetch catalog item:', err);
      setError('Failed to load catalog item details.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(catSearch.toLowerCase())
  );

  const filteredSubcategories = subcategories.filter(sub => 
    sub.name.toLowerCase().includes(subSearch.toLowerCase())
  );

  const fetchInitialData = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        api.get('/categories'),
        api.get('/brands')
      ]);
      setCategories(catRes.data.data);
      setBrands(brandRes.data.data);
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const catName = e.target.value;
    const selectedCat = categories.find(c => c.name === catName);
    setFormData({ ...formData, category: catName, subcategory: '' });
    setSubcategories(selectedCat ? selectedCat.subcategories : []);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImgFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImgFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Basic validation
      if (formData.images.length === 0) {
        throw new Error('Please upload at least one product image');
      }

      let finalVideoUrl = formData.videoUrl;

      // Upload video if selected
      if (videoFile) {
        setVideoUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', videoFile);
        const { data: uploadRes } = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalVideoUrl = uploadRes.url;
        setVideoUploading(false);
      }

      // Upload images to Cloudinary
      const uploadedUrls = [];
      const existingUrls = formData.images.filter(img => img.startsWith('http'));
      uploadedUrls.push(...existingUrls);

      for (const file of imgFiles) {
        const uploadData = new FormData();
        uploadData.append('image', file);
        const { data: uploadRes } = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrls.push(uploadRes.url);
      }

      const res = await api.post('/products', { 
        ...formData, 
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        countInStock: Number(formData.countInStock),
        images: uploadedUrls,
        videoUrl: finalVideoUrl,
        source: selection 
      });
      if (res.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '', sku: '', description: '', price: '', discountPrice: '',
          category: '', subcategory: '', brand: '', material: '',
          dimensions: '', thickness: '', color: '', unit: 'piece', unitValue: '1',
          countInStock: '', images: [], videoUrl: ''
        });
        setVideoFile(null);
        setImgFiles([]);
        setTimeout(() => {
          setSuccess(false);
          setSelection(null);
        }, 5000);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        <AnimatePresence mode="wait">
          {!selection ? (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-10 md:py-20 flex flex-col items-center justify-center space-y-8 md:space-y-12"
            >
              <div className="text-center space-y-3 md:space-y-4">
                <h1 className="text-3xl md:text-6xl font-display font-bold text-deep-espresso tracking-tight">Add Product</h1>
                <p className="text-warm-sand font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">How would you like to list your product?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl px-4">
                <button 
                  onClick={() => setSelection('new')}
                  className="group relative bg-white border border-soft-oatmeal p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-sm hover:shadow-2xl hover:border-warm-sand/30 transition-all duration-500 flex flex-col items-center text-center space-y-4 md:space-y-6"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-soft-oatmeal/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-warm-sand group-hover:bg-warm-sand group-hover:text-white transition-all duration-500">
                    <LuPlus size={32} md:size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-deep-espresso">Add New Product</h3>
                    <p className="text-warm-sand/60 text-xs md:text-sm font-medium mt-2 leading-relaxed">Create a completely new product listing. Requires Admin approval.</p>
                  </div>
                  <div className="pt-2 md:pt-4">
                    <span className="px-5 py-2.5 md:px-6 md:py-3 bg-soft-oatmeal/20 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-warm-sand group-hover:bg-warm-sand/10 transition-colors">Start New Entry</span>
                  </div>
                </button>

                <Link 
                  to="/seller/catalog"
                  className="group relative bg-white border border-soft-oatmeal p-8 md:p-10 rounded-3xl md:rounded-[40px] shadow-sm hover:shadow-2xl hover:border-warm-sand/30 transition-all duration-500 flex flex-col items-center text-center space-y-4 md:space-y-6"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-soft-oatmeal/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-warm-sand group-hover:bg-warm-sand group-hover:text-white transition-all duration-500">
                    <LuTags size={32} md:size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-deep-espresso">Add From Catalog</h3>
                    <p className="text-warm-sand/60 text-xs md:text-sm font-medium mt-2 leading-relaxed">List a product that already exists in the catalog. Instant approval.</p>
                  </div>
                  <div className="pt-2 md:pt-4">
                    <span className="px-5 py-2.5 md:px-6 md:py-3 bg-soft-oatmeal/20 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-warm-sand group-hover:bg-warm-sand/10 transition-colors">Select From Catalog</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-soft-oatmeal/30 px-4 md:px-0">
                <div className="space-y-2 text-center md:text-left">
                  <button 
                    onClick={() => setSelection(null)}
                    className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-warm-sand hover:text-deep-espresso transition-colors flex items-center justify-center md:justify-start gap-2 mb-2 w-full md:w-auto"
                  >
                    ← Back to selection
                  </button>
                  <h1 className="text-2xl md:text-5xl font-display font-bold text-deep-espresso tracking-tight">
                    {selection === 'new' ? 'Create New Listing' : 'Catalog Listing'}
                  </h1>
                  <p className="text-warm-sand font-medium uppercase tracking-[0.2em] text-[9px] md:text-[10px]">Merchant Inventory Portal • {selection === 'new' ? 'Approval Required' : 'Instant Approval'}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          
          {/* Main Form Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* General Information Card */}
            <div className="bg-white rounded-3xl md:rounded-[40px] border border-soft-oatmeal p-6 md:p-12 shadow-sm space-y-8 md:space-y-10">
              <div className="flex items-center gap-4 border-b border-soft-oatmeal pb-5 md:pb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-soft-oatmeal/10 rounded-xl md:rounded-2xl flex items-center justify-center text-warm-sand">
                  <LuBox size={20} md:size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-deep-espresso">General Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand pl-1">Product Title</label>
                  <input 
                    required type="text" placeholder="e.g. Premium White Marble Slabs"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white transition-all font-medium text-sm"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand pl-1">SKU / Model Number</label>
                  <input 
                    type="text" placeholder="e.g. WH-MAR-001"
                    value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white transition-all font-medium text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand pl-1">Brand / Manufacturer</label>
                  <select 
                    required
                    value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white transition-all font-medium text-sm"
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand._id} value={brand._id}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand pl-1">Description</label>
                  <textarea 
                    required rows="4" placeholder="Highlight the quality, finish, and best uses..."
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-6 py-4.5 rounded-2xl bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white transition-all font-medium text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Specifications Card */}
            <div className="bg-white rounded-3xl md:rounded-[40px] border border-soft-oatmeal p-6 md:p-12 shadow-sm space-y-8 md:space-y-10">
              <div className="flex items-center gap-4 border-b border-soft-oatmeal pb-5 md:pb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-soft-oatmeal/10 rounded-xl md:rounded-2xl flex items-center justify-center text-warm-sand">
                  <LuTags size={20} md:size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-deep-espresso">Detailed Specifications</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3 relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand pl-1">Category</label>
                    <div className="relative group">
                       <input 
                         type="text"
                         placeholder={formData.category || "Search or select..."}
                         value={catSearch}
                         onChange={(e) => {
                            setCatSearch(e.target.value);
                            setIsCatOpen(true);
                         }}
                         onFocus={() => setIsCatOpen(true)}
                         className="w-full px-6 py-4.5 rounded-2xl bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white transition-all font-medium text-sm"
                       />
                       {isCatOpen && (
                         <>
                            <div className="fixed inset-0 z-[40]" onClick={() => { setIsCatOpen(false); setCatSearch(''); }} />
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-soft-oatmeal rounded-2xl shadow-2xl z-[50] overflow-hidden max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                               {filteredCategories.length > 0 ? (
                                 filteredCategories.map(cat => (
                                   <button
                                     key={cat._id}
                                     type="button"
                                     onClick={() => {
                                       const selectedCat = categories.find(c => c.name === cat.name);
                                       setFormData({ ...formData, category: cat.name, subcategory: '' });
                                       setSubcategories(selectedCat ? selectedCat.subcategories : []);
                                       setCatSearch('');
                                       setIsCatOpen(false);
                                     }}
                                     className="w-full text-left px-5 py-3.5 text-sm font-medium hover:bg-soft-oatmeal/30 transition-colors border-b border-soft-oatmeal/10 last:border-0"
                                   >
                                     {cat.name}
                                   </button>
                                 ))
                               ) : (
                                 <div className="px-5 py-4 text-xs font-bold text-warm-sand uppercase text-center italic">No categories</div>
                               )}
                            </div>
                         </>
                       )}
                    </div>
                 </div>
                 <div className="space-y-3 relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand pl-1">Subcategory</label>
                    <div className="relative group">
                       <input 
                         type="text"
                         disabled={!formData.category}
                         placeholder={formData.subcategory || "Search or select..."}
                         value={subSearch}
                         onChange={(e) => {
                            setSubSearch(e.target.value);
                            setIsSubOpen(true);
                         }}
                         onFocus={() => setIsSubOpen(true)}
                         className="w-full px-6 py-4.5 rounded-2xl bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white transition-all font-medium text-sm disabled:opacity-30"
                       />
                       {isSubOpen && !(!formData.category) && (
                         <>
                            <div className="fixed inset-0 z-[40]" onClick={() => { setIsSubOpen(false); setSubSearch(''); }} />
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-soft-oatmeal rounded-2xl shadow-2xl z-[50] overflow-hidden max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                               {filteredSubcategories.length > 0 ? (
                                 filteredSubcategories.map(sub => (
                                   <button
                                     key={sub._id || sub.name}
                                     type="button"
                                     onClick={() => {
                                       setFormData({...formData, subcategory: sub.name});
                                       setSubSearch('');
                                       setIsSubOpen(false);
                                     }}
                                     className="w-full text-left px-5 py-3.5 text-sm font-medium hover:bg-soft-oatmeal/30 transition-colors border-b border-soft-oatmeal/10 last:border-0"
                                   >
                                     {sub.name}
                                   </button>
                                 ))
                               ) : (
                                 <div className="px-5 py-4 text-xs font-bold text-warm-sand uppercase text-center italic">No subcategories</div>
                               )}
                            </div>
                         </>
                       )}
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand pl-1">Material</label>
                    <input 
                      type="text" placeholder="e.g. High Grade Ceramic"
                      value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})}
                      className="w-full px-6 py-4.5 rounded-2xl bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white transition-all font-medium text-sm"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand pl-1">Dimensions</label>
                    <input 
                      type="text" placeholder="e.g. 600 x 600 mm"
                      value={formData.dimensions} onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                      className="w-full px-6 py-4.5 rounded-2xl bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white transition-all font-medium text-sm"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand pl-1">Thickness</label>
                    <input 
                      type="text" placeholder="e.g. 10 mm"
                      value={formData.thickness} onChange={(e) => setFormData({...formData, thickness: e.target.value})}
                      className="w-full px-6 py-4.5 rounded-2xl bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white transition-all font-medium text-sm"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand pl-1">Color / Finish</label>
                    <input 
                      type="text" placeholder="e.g. Glossy White"
                      value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="w-full px-6 py-4.5 rounded-2xl bg-soft-oatmeal/5 border-2 border-transparent focus:border-warm-sand/20 focus:bg-white transition-all font-medium text-sm"
                    />
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Media */}
          <div className="space-y-8">
             
             {/* Pricing Card */}
             <div className="bg-white rounded-3xl md:rounded-[40px] border border-soft-oatmeal p-6 md:p-10 shadow-sm space-y-6 md:space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand border-b border-soft-oatmeal pb-4">Pricing & Inventory</h3>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand/60 uppercase tracking-widest">Base Price (Rs.)</label>
                      <input 
                        required type="number" placeholder="0.00"
                        value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-6 py-4 rounded-xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 transition-all font-bold text-deep-espresso"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand/60 uppercase tracking-widest">Discounted Price (Optional)</label>
                      <input 
                        type="number" placeholder="Enter special price"
                        value={formData.discountPrice} onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                        className="w-full px-6 py-4 rounded-xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 transition-all font-bold text-emerald-600"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-warm-sand/60 uppercase tracking-widest">Unit</label>
                        <select 
                          value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 transition-all text-xs font-bold"
                        >
                           <option value="piece">Piece (Pcs)</option>
                           <option value="kg">Kilogram (Kg)</option>
                           <option value="ltr">Litre (Ltr)</option>
                           <option value="watt">Watt (W)</option>
                           <option value="mtr">Meter (m)</option>
                           <option value="ft">Feet (ft)</option>
                           <option value="sqft">Sq. Ft.</option>
                           <option value="box">Box</option>
                           <option value="bundle">Bundle</option>
                           <option value="pack">Pack</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-warm-sand/60 uppercase tracking-widest">Unit Value (Qty)</label>
                        <input 
                          type="text" placeholder="e.g. 5 or 50"
                          value={formData.unitValue} onChange={(e) => setFormData({...formData, unitValue: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 transition-all text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black text-warm-sand/60 uppercase tracking-widest">Stock Qty</label>
                        <input 
                          required type="number" placeholder="0"
                          value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-warm-sand/20 transition-all text-sm font-bold"
                        />
                      </div>
                   </div>
                </div>
             </div>

             {/* Media Card */}
             <div className="bg-white rounded-3xl md:rounded-[40px] border border-soft-oatmeal p-6 md:p-10 shadow-sm space-y-6 md:space-y-8 md:sticky md:top-24">
                <div className="flex items-center justify-between border-b border-soft-oatmeal pb-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand">Media Assets</h3>
                   <span className="text-[9px] font-bold text-warm-sand px-2 py-1 bg-soft-oatmeal/10 rounded-full">{formData.images.length} / 5</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   {formData.images.map((img, idx) => (
                     <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-soft-oatmeal group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button" onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white"
                        >
                           <LuTrash2 size={20} />
                        </button>
                     </div>
                   ))}
                   {formData.images.length < 5 && (
                     <div 
                       onClick={() => fileInputRef.current.click()}
                       className="aspect-square bg-soft-oatmeal/5 rounded-2xl border-2 border-dashed border-soft-oatmeal flex flex-col items-center justify-center text-warm-sand hover:bg-white hover:border-warm-sand hover:text-deep-espresso transition-all cursor-pointer group"
                     >
                        <LuImage size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[8px] font-black uppercase tracking-widest mt-2">Add Media</span>
                     </div>
                   )}
                </div>
                <input type="file" multiple hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />

                <div className="pt-4 space-y-6">
                   <div className="space-y-3">
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand flex items-center gap-2">
                            <LuVideo size={14} /> Product Video
                         </label>
                         <input 
                           type="file" id="video-upload" hidden accept="video/*"
                           onChange={(e) => setVideoFile(e.target.files[0])}
                         />
                         <label htmlFor="video-upload" className="text-[10px] font-black text-deep-espresso uppercase tracking-widest hover:underline cursor-pointer">
                            {videoFile ? 'Change Video' : 'Upload Video File'}
                         </label>
                      </div>
                      
                      <input 
                        type="url" placeholder="or Paste YouTube Link"
                        value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                        className="w-full px-5 py-4 rounded-xl bg-soft-oatmeal/5 border border-soft-oatmeal/30 focus:border-warm-sand focus:bg-white transition-all text-xs font-medium"
                      />
                      {videoFile && (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                           <span className="text-[10px] font-bold text-green-700 truncate max-w-[200px]">{videoFile.name}</span>
                           <button onClick={() => setVideoFile(null)} className="text-green-700 hover:text-red-500 transition-colors">
                              <LuX size={14} />
                           </button>
                        </div>
                      )}
                   </div>

                   {error && (
                     <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-500">
                        <LuX className="shrink-0 mt-0.5" size={16} />
                        <p className="text-[10px] font-bold leading-relaxed">{error}</p>
                     </div>
                   )}

                   <button 
                     type="submit"
                     disabled={isSubmitting || success}
                     className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
                       success 
                       ? 'bg-emerald-500 text-white' 
                       : 'bg-red-800 text-white hover:bg-deep-espresso shadow-red-900/20'
                     }`}
                   >
                     {isSubmitting ? <LuClock size={18} className="animate-spin" /> : (success ? <LuCheck size={18} /> : <LuPlus size={18} />)}
                     {success ? 'Listing Published' : (isSubmitting ? 'Updating Database' : 'Confirm Listing')}
                   </button>
                   
                   <div className="text-[9px] text-center text-warm-sand/50 font-bold uppercase tracking-[0.15em] leading-relaxed">
                      By publishing, you agree that your store follows our merchant policies.
                   </div>
                </div>
             </div>
          </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default AddProduct;
