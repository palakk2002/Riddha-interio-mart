import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { LuPlus, LuImage, LuBriefcase, LuTags, LuInfo, LuArrowLeft, LuPackage, LuCheck, LuGrid2X2, LuUpload, LuVideo, LuX } from 'react-icons/lu';
import { FiPackage, FiEdit3, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const AddInventoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const catalogId = searchParams.get('catalogId');

  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Custom Dropdown State
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    brand: '',
    price: '',
    images: [],
    videoUrl: '',
    description: '',
    material: '',
    dimensions: '',
    countInStock: 50,
    unit: 'piece',
    unitValue: '1',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/brands')
        ]);
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
        
        // If catalogId exists, fetch catalog item to pre-fill
        if (catalogId) {
          const { data: catalogItem } = await api.get(`/catalog/${catalogId}`);
          const itm = catalogItem.data;
          if (itm) {
            setFormData({
              name: itm.name || '',
              sku: itm.sku || '',
              category: itm.category || '',
              brand: itm.brand || '',
              price: itm.price || '',
              images: itm.images || [],
              videoUrl: itm.videoUrl || '',
              description: itm.description || '',
              material: itm.material || '',
              dimensions: itm.dimensions || '',
              countInStock: 50,
              unit: itm.unit || 'piece',
              unitValue: itm.unitValue || '1',
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch initialization data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [catalogId]);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(catSearch.toLowerCase())
  );

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return alert('Please select or enter a category');
    if (!formData.brand) return alert('Please select a brand partner.');
    
    try {
      setLoading(true);

      let finalVideoUrl = formData.videoUrl;

      // Upload video if selected
      if (videoFile) {
        const videoData = new FormData();
        videoData.append('image', videoFile);
        const { data: uploadRes } = await api.post('/upload', videoData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalVideoUrl = uploadRes.url;
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
        videoUrl: finalVideoUrl,
        isApproved: true, 
        approvalStatus: 'approved',
        sellerType: 'Admin',
        isActive: true
      };

      await api.post('/products', payload);
      navigate('/admin/inventory');
    } catch (err) {
      console.error('Failed to add inventory product:', err);
      alert(err.response?.data?.error || 'Error creating product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/admin/inventory')}
            className="flex items-center gap-2 text-warm-sand hover:text-deep-espresso transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <LuArrowLeft size={18} /> Back to Inventory
          </button>
          <h1 className="text-2xl font-display font-bold text-deep-espresso">Add Direct Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Image Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-soft-oatmeal shadow-sm h-fit space-y-6">
                <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest mb-4 block text-center">Product Media</label>
                
                <div className="grid grid-cols-2 gap-3">
                   {formData.images.map((img, idx) => (
                     <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-soft-oatmeal group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button" onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white"
                        >
                           <FiTrash2 size={16} />
                        </button>
                     </div>
                   ))}
                   {formData.images.length < 5 && (
                     <div 
                       onClick={() => fileInputRef.current.click()}
                       className="aspect-square bg-soft-oatmeal/10 rounded-xl border-2 border-dashed border-soft-oatmeal flex flex-col items-center justify-center text-warm-sand hover:border-warm-sand hover:text-deep-espresso transition-all cursor-pointer group"
                     >
                        <FiPlus size={20} className="opacity-40 group-hover:opacity-100" />
                        <span className="text-[8px] font-black uppercase tracking-widest mt-1">Add Image</span>
                     </div>
                   )}
                </div>
                <input 
                  type="file" multiple hidden ref={fileInputRef} 
                  onChange={handleFileChange} accept="image/*"
                />

                <div className="space-y-4 pt-4 border-t border-soft-oatmeal/30">
                   <div className="space-y-2">
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                            <LuVideo size={12} /> Product Video
                         </label>
                         <input 
                           type="file" id="inv-video-upload" hidden accept="video/*"
                           onChange={(e) => setVideoFile(e.target.files[0])}
                         />
                         <label htmlFor="inv-video-upload" className="text-[10px] font-black text-deep-espresso uppercase tracking-widest hover:underline cursor-pointer">
                            {videoFile ? 'Change Video' : 'Upload File'}
                         </label>
                      </div>
                      <input 
                         type="url" 
                         placeholder="or YouTube Link"
                         value={formData.videoUrl}
                         onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                         className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-[10px] focus:outline-none"
                      />
                      {videoFile && (
                        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded-lg">
                           <span className="text-[9px] font-bold text-green-700 truncate max-w-[150px]">{videoFile.name}</span>
                           <button onClick={() => setVideoFile(null)} className="text-green-700 hover:text-red-500 transition-colors">
                              <LuX size={12} />
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>

            {/* Main Info Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-soft-oatmeal shadow-sm space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuBriefcase size={12} /> Product Name
                    </label>
                    <input 
                      type="text" required
                      placeholder="e.g. Italian Carrera Marble"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>

                  {/* SKU */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuPackage size={12} /> SKU Code
                    </label>
                    <input 
                      type="text" required
                      placeholder="e.g. TLE-MAR-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuGrid2X2 size={12} /> Category
                    </label>
                    <div className="relative group">
                       <input 
                         type="text"
                         placeholder={formData.category || "Search or select category..."}
                         value={catSearch}
                         onChange={(e) => {
                            setCatSearch(e.target.value);
                            setIsCatOpen(true);
                         }}
                         onFocus={() => setIsCatOpen(true)}
                         className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none"
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-warm-sand">
                          <LuGrid2X2 size={14} className={isCatOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                       </div>

                       {isCatOpen && (
                         <>
                            <div 
                              className="fixed inset-0 z-[40]" 
                              onClick={() => {
                                 setIsCatOpen(false);
                                 setCatSearch('');
                              }}
                            />
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-soft-oatmeal rounded-2xl shadow-2xl z-[50] overflow-hidden max-h-64 overflow-y-auto">
                               {filteredCategories.length > 0 ? (
                                 filteredCategories.map(cat => (
                                   <button
                                     key={cat._id}
                                     type="button"
                                     onClick={() => {
                                       setFormData({...formData, category: cat.name});
                                       setCatSearch('');
                                       setIsCatOpen(false);
                                     }}
                                     className="w-full text-left px-5 py-3.5 text-sm font-medium hover:bg-soft-oatmeal/30 transition-colors border-b border-soft-oatmeal/10 last:border-0"
                                   >
                                     <span className={formData.category === cat.name ? "text-red-800 font-bold" : "text-deep-espresso"}>
                                       {cat.name}
                                     </span>
                                   </button>
                                 ))
                               ) : (
                                 <div className="px-5 py-4 text-xs font-bold text-warm-sand text-center italic">
                                   No categories found
                                 </div>
                               )}
                            </div>
                         </>
                       )}
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuTags size={12} /> Brand Partner
                    </label>
                    <select 
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Price (₹)</label>
                      <input 
                        type="number" required
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Initial Stock</label>
                      <input 
                        type="number" required
                        value={formData.countInStock}
                        onChange={(e) => setFormData({...formData, countInStock: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Unit Type</label>
                      <select 
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none cursor-pointer"
                      >
                         <option value="piece">Piece (Pcs)</option>
                         <option value="kg">Kilogram (Kg)</option>
                         <option value="ltr">Litre (Ltr)</option>
                         <option value="watt">Watt (W)</option>
                         <option value="mtr">Meter (m)</option>
                         <option value="box">Box</option>
                         <option value="pack">Pack</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Unit Value (Qty)</label>
                      <input 
                        type="text"
                        placeholder="e.g. 50"
                        value={formData.unitValue}
                        onChange={(e) => setFormData({...formData, unitValue: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                     <LuInfo size={12} /> Detailed Description
                  </label>
                  <textarea 
                    rows={3} required
                    placeholder="Enter product description..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-soft-oatmeal/50">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Material</label>
                      <input 
                        type="text"
                        placeholder="e.g. Ceramic"
                        value={formData.material}
                        onChange={(e) => setFormData({...formData, material: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Dimensions</label>
                      <input 
                        type="text"
                        placeholder="e.g. 30x30 cm"
                        value={formData.dimensions}
                        onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none"
                      />
                   </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button 
                    disabled={loading}
                    type="submit"
                    className="bg-deep-espresso hover:bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all transform active:scale-95 shadow-xl shadow-black/10 disabled:opacity-50 uppercase tracking-widest text-xs"
                  >
                    {loading ? 'SAVING...' : 'PUBLISH PRODUCT'}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default AddInventoryPage;
