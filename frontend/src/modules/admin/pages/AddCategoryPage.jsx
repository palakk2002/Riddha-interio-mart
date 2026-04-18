import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { FiArrowLeft, FiPlus, FiTrash2, FiImage, FiSave, FiUploadCloud, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../shared/utils/api';

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [category, setCategory] = useState({
    name: '',
    image: '',
    description: '',
  });
  const [subcategories, setSubcategories] = useState([{ name: '', image: '' }]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setSaveError('Image is too large (max 2MB for storage). Please use a smaller file.');
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
    setSubcategories([...subcategories, { name: '', image: '' }]);
  };

  const handleRemoveSubcategory = (index) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleSubChange = (index, field, value) => {
    const newSubs = [...subcategories];
    newSubs[index][field] = value;
    setSubcategories(newSubs);
  };

  const handleSubImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleSubChange(index, 'image', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');

    // Prepare data for backend
    const categoryData = {
      name: category.name,
      description: category.description,
      image: category.image,
      subcategories: subcategories.filter(s => s.name.trim() !== '')
    };

    try {
      const response = await api.post('/categories', categoryData);

      if (response.data.success) {
        setIsSaving(false);
        setIsSaved(true);
        
        // Success delay and redirect
        setTimeout(() => {
          navigate('/admin/manage-categories');
        }, 1000);
      }
    } catch (err) {
      console.error('Save failed:', err);
      setSaveError(err.response?.data?.error || 'Failed to save category. Please check your data or image size.');
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 px-1 md:px-0">
          <button 
            onClick={() => navigate('/admin/manage-categories')}
            className="p-2.5 md:p-3 bg-white rounded-xl md:rounded-2xl border border-soft-oatmeal text-warm-sand hover:text-deep-espresso hover:shadow-md transition-all shadow-sm"
          >
            <FiArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-deep-espresso truncate">Create Category</h1>
            <p className="text-warm-sand text-[10px] md:text-sm font-medium tracking-tight">Define a new top-level category collection.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-soft-oatmeal shadow-sm space-y-6 md:space-y-8">
              <h3 className="text-base md:text-lg font-black text-deep-espresso border-b border-soft-oatmeal pb-4 uppercase tracking-[0.1em]">General Information</h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest pl-1">Category Name</label>
                  <input 
                    required
                    type="text" 
                    value={category.name}
                    onChange={(e) => setCategory({...category, name: e.target.value})}
                    placeholder="e.g. Luxury Lighting"
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand/20 focus:bg-white transition-all font-medium" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-warm-sand uppercase tracking-widest pl-1">Description</label>
                  <textarea 
                    rows="4"
                    value={category.description}
                    onChange={(e) => setCategory({...category, description: e.target.value})}
                    placeholder="Describe the aesthetic..."
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl md:rounded-2xl px-5 py-4 md:px-6 md:py-5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand/20 focus:bg-white transition-all font-medium resize-none" 
                  />
                </div>
              </div>
            </div>

            {/* Subcategories */}
            <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-soft-oatmeal shadow-sm space-y-6 md:space-y-8">
              <div className="flex items-center justify-between border-b border-soft-oatmeal pb-4">
                <h3 className="text-base md:text-lg font-black text-deep-espresso uppercase tracking-[0.1em]">Subcategories</h3>
                <button 
                  type="button"
                  onClick={handleAddSubcategory}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-dusty-cocoa hover:text-deep-espresso transition-colors px-4 py-2 border border-soft-oatmeal rounded-full hover:bg-white shadow-sm"
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
                      className="flex flex-col sm:flex-row gap-4 p-4 md:p-5 bg-soft-oatmeal/5 rounded-2xl md:rounded-[24px] border border-soft-oatmeal/50 relative group hover:bg-white hover:shadow-xl hover:shadow-soft-oatmeal/20 transition-all duration-300"
                    >
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-warm-sand uppercase tracking-widest pl-1">Subcategory Name</label>
                           <input 
                              type="text" 
                              placeholder="e.g. Chandeliers"
                              value={sub.name}
                              onChange={(e) => handleSubChange(index, 'name', e.target.value)}
                              className="w-full bg-white border border-soft-oatmeal rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <div className="flex items-center justify-between">
                             <label className="text-[8px] font-black text-warm-sand uppercase tracking-widest pl-1">Thumbnail Media</label>
                             <button 
                               type="button"
                               onClick={() => document.getElementById(`sub-img-${index}`).click()}
                               className="text-[8px] font-black uppercase tracking-widest text-deep-espresso hover:underline"
                             >
                               Upload
                             </button>
                           </div>
                           <input 
                              type="file" id={`sub-img-${index}`} className="hidden" 
                              onChange={(e) => handleSubImageUpload(e, index)} accept="image/*"
                           />
                           <input 
                              type="text" 
                              placeholder="URL or upload file..."
                              value={sub.image}
                              onChange={(e) => handleSubChange(index, 'image', e.target.value)}
                              className="w-full bg-white border border-soft-oatmeal rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all"
                           />
                        </div>
                      </div>
                      <div className="flex items-end pb-1">
                        <button 
                           type="button"
                           onClick={() => handleRemoveSubcategory(index)}
                           className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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

          {/* Sidebar / Media */}
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[40px] border border-soft-oatmeal shadow-sm space-y-6 md:space-y-8 sticky top-24">
              <h3 className="text-base md:text-lg font-black text-deep-espresso border-b border-soft-oatmeal pb-4 uppercase tracking-[0.1em]">Banner Media</h3>
              
              <div className="space-y-6">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="aspect-[4/5] bg-soft-oatmeal/10 rounded-[32px] border-2 border-dashed border-soft-oatmeal overflow-hidden relative group cursor-pointer hover:border-warm-sand/50 hover:bg-soft-oatmeal/20 transition-all"
                >
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-warm-sand p-6 text-center">
                      <div className="w-16 h-16 bg-soft-oatmeal/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-warm-sand/10 transition-colors">
                        <FiUploadCloud size={32} className="opacity-40" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Click to Upload</p>
                      <p className="text-[9px] font-medium opacity-60 leading-relaxed italic max-w-40 mx-auto">Upload a high-resolution banner image for the homepage.</p>
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
                  <p className="px-4 py-3 bg-soft-oatmeal/10 rounded-xl text-[10px] font-medium text-warm-sand border border-soft-oatmeal/50">
                    Supports JPG, PNG, WEBP. Recommended Aspect Ratio: 4:5
                  </p>
                </div>
              </div>

              <div className="pt-4">
                {saveError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-bold text-red-500 text-center leading-relaxed"
                  >
                    {saveError}
                  </motion.div>
                )}

                <button 
                  type="submit"
                  disabled={isSaving || isSaved}
                  className={`w-full flex items-center justify-center gap-3 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-xl ${
                    isSaved ? 'bg-emerald-500 text-white' : 
                    isSaving ? 'bg-dusty-cocoa text-white' : 
                    'bg-deep-espresso text-white hover:bg-dusty-cocoa hover:shadow-deep-espresso/20'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <FiCheck size={18} />
                      Category Saved
                    </>
                  ) : isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      Save Category
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/admin/manage-categories')}
                  className="w-full mt-4 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-warm-sand hover:text-red-500 transition-colors text-center"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default AddCategoryPage;
