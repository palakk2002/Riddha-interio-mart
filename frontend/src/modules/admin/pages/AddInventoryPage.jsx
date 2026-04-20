import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { LuPlus, LuImage, LuBriefcase, LuTags, LuInfo, LuArrowLeft, LuPackage, LuCheck, LuGrid2X2, LuUpload } from 'react-icons/lu';
import { FiPackage, FiEdit3 } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const AddInventoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const catalogId = searchParams.get('catalogId');

  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    brand: '',
    price: '',
    image: '',
    description: '',
    material: '',
    dimensions: '',
    countInStock: 50,
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
              image: itm.images?.[0] || '',
              description: itm.description || '',
              material: itm.material || '',
              dimensions: itm.dimensions || '',
              countInStock: 50,
            });
          }
        } else {
          // Set defaults if available
          if (catRes.data.data?.length > 0) setFormData(prev => ({ ...prev, category: catRes.data.data[0].name }));
          if (brandRes.data.data?.length > 0) setFormData(prev => ({ ...prev, brand: brandRes.data.data[0].name }));
        }
      } catch (err) {
        console.error('Failed to fetch initialization data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [catalogId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return alert('Please select or enter a category');
    
    try {
      setLoading(true);

      let imageUrl = formData.image;

      if (imgFile) {
        const uploadData = new FormData();
        uploadData.append('image', imgFile);
        const { data: uploadRes } = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.url;
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
        images: imageUrl ? [imageUrl] : [],
        isApproved: true, 
        approvalStatus: 'approved',
        sellerType: 'Admin',
        isActive: true
      };

      await api.post('/products', payload);
      navigate('/admin/inventory');
    } catch (err) {
      console.error('Failed to add inventory product:', err);
      alert(err.response?.data?.error || 'Error creating product. Please check connection.');
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
              <div className="bg-white rounded-3xl p-6 border border-soft-oatmeal shadow-sm h-fit">
                <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest mb-4 block">Product Image</label>
                
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="aspect-square rounded-2xl bg-soft-oatmeal/20 border-2 border-dashed border-soft-oatmeal flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-soft-oatmeal/30 transition-all"
                >
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <LuImage className="text-warm-sand mb-2" size={32} />
                      <p className="text-[10px] font-bold text-warm-sand text-center px-4 uppercase tracking-tighter">Click to upload file</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*"
                  />
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="relative">
                    <LuUpload className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-sand" size={12} />
                    <input 
                      type="text" 
                      placeholder="Or paste Image URL here..."
                      value={formData.image.startsWith('data:') ? 'File Selected...' : formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl pl-9 pr-4 py-2.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-warm-sand"
                    />
                  </div>
                   <div className="flex items-center justify-between px-1">
                      <p className="text-[9px] text-warm-sand font-bold uppercase tracking-tighter flex items-center gap-1">
                         <LuInfo size={10} /> Supports JPG, PNG
                      </p>
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
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
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
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuGrid2X2 size={12} /> Category
                    </label>
                    <input 
                      list="category-list"
                      required
                      placeholder="Select or type..."
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                    />
                    <datalist id="category-list">
                      {categories.map(cat => <option key={cat._id} value={cat.name} />)}
                      <option value="Furniture" />
                      <option value="Tiles" />
                      <option value="Sanitary" />
                      <option value="Bathware" />
                      <option value="Electricals" />
                    </datalist>
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
                      {brands.map(brand => <option key={brand._id} value={brand.name}>{brand.name}</option>)}
                      {!brands.length && <option value="Generic">Generic</option>}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                         ₹ Price (₹)
                      </label>
                      <input 
                        type="number" required
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all font-bold"
                      />
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                         <FiPackage size={12} /> Initial Stock
                      </label>
                      <input 
                        type="number" required
                        value={formData.countInStock}
                        onChange={(e) => setFormData({...formData, countInStock: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                      />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                     <LuInfo size={12} /> Detailed Description
                  </label>
                  <textarea 
                    rows={4} required
                    placeholder="Enter product description, key features, and heritage information..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-soft-oatmeal/50">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Material & Finish</label>
                      <input 
                        type="text"
                        placeholder="e.g. Polished Marble"
                        value={formData.material}
                        onChange={(e) => setFormData({...formData, material: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Dimensions / Size</label>
                      <input 
                        type="text"
                        placeholder="e.g. 600 x 600 mm"
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
                    className="bg-deep-espresso hover:bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all transform active:scale-95 shadow-xl shadow-black/10 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        SAVING...
                      </>
                    ) : (
                      <>
                        <LuCheck size={20} />
                        PUBLISH PRODUCT
                      </>
                    )}
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
