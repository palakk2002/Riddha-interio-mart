import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { FiArrowLeft, FiPlus, FiTrash2, FiImage, FiSave, FiUploadCloud, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../shared/utils/api';

const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [category, setCategory] = useState({
    name: '',
    image: '',
    description: '',
  });
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/categories/${id}`);
      const data = response.data.data;
      
      setCategory({
        name: data.name,
        image: data.image,
        description: data.description || '',
      });
      setSubcategories(data.subcategories || []);
    } catch (err) {
      console.error('Failed to load category:', err);
      setSaveError('Could not load category details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setSaveError('Image too large (max 2MB).');
        return;
      }
      setSaveError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategory(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, { name: '', image: '', description: '' }]);
  };

  const handleRemoveSubcategory = (index) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleSubChange = (index, field, value) => {
    const newSubs = [...subcategories];
    newSubs[index][field] = value;
    setSubcategories(newSubs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');

    try {
      const categoryData = {
        name: category.name,
        description: category.description,
        image: category.image,
        subcategories: subcategories.filter(s => s.name.trim() !== '')
      };

      const response = await api.put(`/categories/${id}`, categoryData);

      if (response.data.success) {
        setIsSaving(false);
        setIsSaved(true);
        setTimeout(() => {
          navigate('/admin/manage-categories');
        }, 1000);
      }
    } catch (err) {
      console.error('Update failed:', err);
      setSaveError(err.response?.data?.error || 'Failed to update category. Check your connection.');
      setIsSaving(false);
    }
  };

  if (loading) return <PageWrapper><div className="flex items-center justify-center min-h-[60vh] text-warm-sand font-display font-black uppercase tracking-widest text-xs animate-pulse">Loading Details...</div></PageWrapper>;

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/manage-categories')}
            className="p-3 bg-white rounded-2xl border border-soft-oatmeal text-warm-sand hover:text-deep-espresso hover:shadow-md transition-all"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-deep-espresso">Edit Category: {category.name}</h1>
            <p className="text-warm-sand text-sm font-medium italic">Update the metadata and subcategories for this category record.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 md:p-10 rounded-[40px] border border-soft-oatmeal shadow-sm space-y-8">
              <h3 className="text-lg font-black text-deep-espresso border-b border-soft-oatmeal pb-4 uppercase tracking-[0.1em]">General Information</h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest pl-1">Category Name</label>
                  <input 
                    required
                    type="text" 
                    value={category.name}
                    onChange={(e) => setCategory({...category, name: e.target.value})}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-2xl px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand/20 focus:bg-white transition-all font-medium" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest pl-1">Description</label>
                  <textarea 
                    rows="4"
                    value={category.description}
                    onChange={(e) => setCategory({...category, description: e.target.value})}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-2xl px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand/20 focus:bg-white transition-all font-medium resize-none" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[40px] border border-soft-oatmeal shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-soft-oatmeal pb-4">
                <h3 className="text-lg font-black text-deep-espresso uppercase tracking-[0.1em]">Subcategories</h3>
                <button 
                  type="button"
                  onClick={handleAddSubcategory}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-dusty-cocoa hover:text-deep-espresso transition-colors px-4 py-2 border border-soft-oatmeal rounded-full shadow-sm"
                >
                  <FiPlus /> Add new
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {subcategories.map((sub, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 p-5 bg-soft-oatmeal/5 rounded-[24px] border border-soft-oatmeal/50 relative group transition-all duration-300"
                    >
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-warm-sand uppercase tracking-widest pl-1">Subcategory Name</label>
                           <input 
                              type="text" 
                              placeholder="e.g. Chandeliers"
                              value={sub.name}
                              onChange={(e) => handleSubChange(index, 'name', e.target.value)}
                              className="w-full bg-white border border-soft-oatmeal rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-warm-sand/20 outline-none transition-all font-medium"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-warm-sand uppercase tracking-widest pl-1">Thumbnail Media URL/Base64</label>
                           <input 
                              type="text" 
                              placeholder="https://..."
                              value={sub.image}
                              onChange={(e) => handleSubChange(index, 'image', e.target.value)}
                              className="w-full bg-white border border-soft-oatmeal rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-warm-sand/20 outline-none transition-all font-medium"
                           />
                        </div>
                      </div>
                      <div className="flex items-end pb-1">
                        <button 
                           type="button"
                           onClick={() => handleRemoveSubcategory(index)}
                           className="p-3 text-red-300 hover:text-red-500 rounded-xl transition-all"
                        >
                           <FiTrash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-soft-oatmeal shadow-sm space-y-8 sticky top-24">
              <h3 className="text-lg font-black text-deep-espresso border-b border-soft-oatmeal pb-4 uppercase tracking-[0.1em]">Banner Media</h3>
              
              <div className="space-y-6">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <div onClick={() => fileInputRef.current.click()} className="aspect-[4/5] bg-soft-oatmeal/10 rounded-[32px] border-2 border-dashed border-soft-oatmeal overflow-hidden relative group cursor-pointer hover:border-warm-sand/50 transition-all">
                  {category.image ? (
                    <img src={category.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-warm-sand p-6 text-center">
                      <FiUploadCloud size={32} className="opacity-40 mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Media</p>
                    </div>
                  )}
                  {category.image && (
                    <div className="absolute inset-0 bg-deep-espresso/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Change Media</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest pl-1">Media Format</p>
                  <p className="px-4 py-3 bg-soft-oatmeal/10 rounded-xl text-[10px] font-medium text-warm-sand border border-soft-oatmeal/50">Supports JPG, PNG, WEBP. Max 2MB.</p>
                </div>
              </div>

              <div className="pt-4">
                {saveError && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-bold text-red-500 text-center leading-relaxed">
                    {saveError}
                  </motion.div>
                )}

                <button 
                  type="submit"
                  disabled={isSaving || isSaved}
                  className={`w-full flex items-center justify-center gap-3 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs transition-colors shadow-xl ${
                    isSaved ? 'bg-emerald-500 text-white' : 
                    isSaving ? 'bg-dusty-cocoa text-white' : 
                    'bg-deep-espresso text-white hover:bg-dusty-cocoa'
                  }`}
                >
                  {isSaved ? <><FiCheck size={18} /> Done</> : isSaving ? 'Updating...' : <><FiSave size={18} /> Save Changes</>}
                </button>
                <button type="button" onClick={() => navigate('/admin/manage-categories')} className="w-full mt-4 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-warm-sand hover:text-red-500 transition-colors text-center">Discard Changes</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default EditCategoryPage;
