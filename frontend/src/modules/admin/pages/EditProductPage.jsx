import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { FiArrowLeft, FiImage, FiSave, FiInfo, FiTag, FiDollarSign, FiType, FiPackage } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

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
    stock: 50,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes, brandRes] = await Promise.all([
          api.get(`/catalog/${id}`),
          api.get('/categories'),
          api.get('/brands')
        ]);
        
        const product = prodRes.data.data;
        const fetchedCategories = catRes.data.data || [];
        const fetchedBrands = brandRes.data.data || [];

        setCategories(fetchedCategories);
        setBrands(fetchedBrands);
        
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
          stock: product.stock || 0,
        });

      } catch (err) {
        console.error('Failed to fetch product details:', err);
        setStatusMessage('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const fileInputRef = React.useRef(null);

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

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setStatusMessage('');
      
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: formData.image ? [formData.image] : []
      };

      await api.put(`/catalog/${id}`, payload);
      navigate('/admin/catalog');
    } catch (err) {
      console.error('Failed to update product:', err);
      setStatusMessage(err.response?.data?.error || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
     return (
        <PageWrapper>
           <div className="flex flex-col items-center justify-center py-40 animate-pulse">
              <div className="w-16 h-16 border-4 border-soft-oatmeal border-t-red-800 rounded-full animate-spin mb-4" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-warm-sand">Opening Blueprint...</p>
           </div>
        </PageWrapper>
     );
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => navigate('/admin/catalog')}
          className="flex items-center gap-2 text-warm-sand font-bold hover:text-deep-espresso transition-colors group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-deep-espresso">Edit Product</h1>
            <p className="text-warm-sand mt-1">Update specifications for <span className="text-deep-espresso font-bold">{formData.name || 'this item'}</span>.</p>
          </div>
          {statusMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-xs font-bold">
               {statusMessage}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-12">
          <div className="bg-white rounded-[32px] border border-soft-oatmeal shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
             {/* Left: Image Preview Area */}
             <div className="p-8 bg-soft-oatmeal/10 border-r border-soft-oatmeal flex flex-col items-center justify-center space-y-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div 
                  onClick={triggerFileInput}
                  className="w-full aspect-square rounded-2xl border-2 border-dashed border-soft-oatmeal flex flex-col items-center justify-center overflow-hidden bg-white/50 relative group cursor-pointer hover:border-warm-sand transition-all"
                >
                   {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                   ) : (
                      <div className="flex flex-col items-center gap-2 text-warm-sand">
                         <FiImage size={48} className="opacity-20" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-center">Click to Upload<br/>Product Image</span>
                      </div>
                   )}
                   <div className="absolute inset-0 bg-deep-espresso/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                        {formData.image ? "Change Image" : "Upload Image"}
                      </span>
                   </div>
                </div>
                <div className="w-full space-y-2">
                   <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                         <FiImage size={12} /> Image URL
                      </label>
                      <button 
                        type="button"
                        onClick={triggerFileInput}
                        className="text-[10px] font-black text-deep-espresso uppercase tracking-widest hover:underline"
                      >
                        or Upload File
                      </button>
                   </div>
                   <input 
                      type="url" 
                      placeholder="https://example.com/item.jpg"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-white border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                   />
                </div>
             </div>

             {/* Right: Detailed Fields */}
             <div className="lg:col-span-2 p-8 md:p-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                         <FiType size={12} /> Product Name
                      </label>
                      <input 
                        type="text" required placeholder="Italian White Marble"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                         <FiTag size={12} /> Product Code (SKU)
                      </label>
                      <input 
                        type="text" required placeholder="TLE-MAR-012"
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all font-mono"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                         <FiTag size={12} /> Brand Partner
                      </label>
                      <select 
                        required
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all cursor-pointer"
                      >
                         <option value="">{brands.length > 0 ? 'Select associated brand' : 'No brands found'}</option>
                         {brands.map(b => (
                           <option key={b._id} value={b.name}>{b.name}</option>
                         ))}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Category</label>
                      <select 
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all cursor-pointer"
                      >
                         <option value="">{categories.length > 0 ? 'Select category' : 'No categories found'}</option>
                         {categories.map(cat => (
                           <option key={cat._id} value={cat.name}>{cat.name}</option>
                         ))}
                      </select>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                           <FiDollarSign size={12} /> Price (₹)
                        </label>
                        <input 
                          type="number" required placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                           <FiPackage size={12} /> Stock
                        </label>
                        <input 
                          type="number" required
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: e.target.value})}
                          className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                        />
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-2">
                      <FiInfo size={12} /> Detailed Description
                   </label>
                   <textarea 
                     rows="4" required
                     placeholder="Enter product description..."
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all resize-none"
                   ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-soft-oatmeal/50">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Material</label>
                      <input 
                        type="text" placeholder="e.g. Carrara Marble"
                        value={formData.material}
                        onChange={(e) => setFormData({...formData, material: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest">Dimensions</label>
                      <input 
                        type="text" placeholder="e.g. 60x60x2 cm"
                        value={formData.dimensions}
                        onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                        className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                      />
                   </div>
                </div>

                <div className="pt-6 flex justify-end gap-4">
                   <button 
                     type="button"
                     onClick={() => navigate('/admin/catalog')}
                     disabled={submitting}
                     className="px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-dusty-cocoa hover:bg-soft-oatmeal/30 transition-all disabled:opacity-50"
                   >
                      Cancel
                   </button>
                   <button 
                     type="submit"
                     disabled={submitting}
                     className={`bg-deep-espresso text-white font-black uppercase tracking-[0.2em] text-xs px-10 py-4 rounded-xl transition-all shadow-xl shadow-deep-espresso/20 flex items-center gap-3 ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-dusty-cocoa active:scale-95'}`}
                   >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiSave size={16} />
                      )}
                      {submitting ? 'Saving...' : 'Save Changes'}
                   </button>
                </div>
             </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default EditProductPage;
