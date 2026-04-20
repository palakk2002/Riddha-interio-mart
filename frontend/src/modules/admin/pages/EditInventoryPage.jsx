import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { LuImage, LuBriefcase, LuTags, LuInfo, LuArrowLeft, LuPackage, LuCheck, LuClock, LuUpload, LuGrid2X2 } from 'react-icons/lu';
import { FiPackage } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const EditInventoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    countInStock: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes, brandRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/categories'),
          api.get('/brands')
        ]);
        
        const product = prodRes.data.data;
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
        
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          category: product.category || '',
          brand: product.brand || '',
          price: product.price || '',
          image: product.images?.[0] || '',
          description: product.description || '',
          material: product.material || '',
          dimensions: product.dimensions || '',
          countInStock: product.countInStock || 0,
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        alert('Could not load product data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
        images: formData.image ? [formData.image] : []
      };

      await api.put(`/products/${id}`, payload);
      navigate('/admin/inventory');
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Error updating product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-soft-oatmeal border-t-red-800 rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-warm-sand">Fetching Product Details...</p>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/admin/inventory')}
            className="flex items-center gap-2 text-warm-sand hover:text-deep-espresso transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <LuArrowLeft size={18} /> Back to Inventory
          </button>
          <h1 className="text-2xl font-display font-bold text-deep-espresso">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Image Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-soft-oatmeal shadow-sm h-fit">
                <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest mb-4 block">Product Image</label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="aspect-square rounded-2xl bg-soft-oatmeal/20 border-2 border-dashed border-soft-oatmeal flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
                >
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <LuImage className="text-warm-sand" size={32} />
                  )}
                  <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                </div>
                <div className="mt-4">
                  <input 
                    type="text" 
                    placeholder="URL..."
                    value={formData.image.startsWith('data:') ? 'Custom File Selected' : formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-3 py-2 text-[10px] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-soft-oatmeal shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuBriefcase size={12} /> Product Name
                    </label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuPackage size={12} /> SKU Code
                    </label>
                    <input type="text" required value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuGrid2X2 size={12} /> Category
                    </label>
                    <input 
                      list="cat-list"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none"
                    />
                    <datalist id="cat-list">
                      {categories.map(cat => <option key={cat._id} value={cat.name} />)}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                       <LuTags size={12} /> Brand
                    </label>
                    <select value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none">
                       {brands.map(brand => <option key={brand._id} value={brand.name}>{brand.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Price (₹)</label>
                    <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Stock</label>
                    <input type="number" required value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Description</label>
                  <textarea rows={4} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" />
                </div>

                <div className="flex justify-end pt-6">
                  <button disabled={saving} type="submit" className="bg-deep-espresso hover:bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-xl shadow-black/10">
                    {saving ? 'UPDATING...' : 'SAVE CHANGES'}
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

export default EditInventoryPage;
