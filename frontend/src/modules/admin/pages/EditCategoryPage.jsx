import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { FiArrowLeft, FiPlus, FiTrash2, FiImage, FiSave, FiUploadCloud, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { manageCategoriesData } from '../data/manageCategoriesData';

const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [category, setCategory] = useState({
    name: '',
    image: '',
    description: '',
  });
  const [categories, setCategories] = useState(manageCategoriesData);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    try {
      // Load categories from localStorage
      const savedCats = localStorage.getItem('admin_categories');
      if (savedCats) {
        setCategories(JSON.parse(savedCats));
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  useEffect(() => {
    // Determine the source of truth (localStorage or static data)
    let sourceData = manageCategoriesData;
    try {
      const saved = localStorage.getItem('admin_categories');
      if (saved) {
        sourceData = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to parse localStorage during fetch:', err);
    }

    // Find the category by ID
    const existingCategory = sourceData.find(c => String(c.id) === String(id));
    
    if (existingCategory) {
      setCategory({
        name: existingCategory.name,
        image: existingCategory.image,
        description: 'Premium collection curated for modern Indian interiors.',
      });
      setSubcategories(existingCategory.subcategories || []);
    } else {
      console.warn('Category not found for ID:', id);
      // Optional: navigate away or show error
    }
    setLoading(false);
  }, [id]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');

    // Simulate API call
    setTimeout(() => {
      try {
        const saved = localStorage.getItem('admin_categories');
        const categories = saved ? JSON.parse(saved) : manageCategoriesData;
        
        const updatedCategory = {
          ...category,
          id: parseInt(id),
          subcategories: subcategories.filter(s => s.name.trim() !== '')
        };

        const updatedList = categories.map(c => 
          c.id === parseInt(id) ? updatedCategory : c
        );

        localStorage.setItem('admin_categories', JSON.stringify(updatedList));

        console.log('Category Updated in LocalStorage:', updatedCategory);
        setIsSaving(false);
        setIsSaved(true);
        
        // Success delay and redirect
        setTimeout(() => {
          navigate('/admin/manage-categories');
        }, 1000);
      } catch (err) {
        console.error('Update failed:', err);
        setSaveError('Storage limit reached! Using a smaller image or deleting old entries might help.');
        setIsSaving(false);
      }
    }, 1500);
  };

  if (loading) return <PageWrapper><div className="flex items-center justify-center min-h-[60vh] text-warm-sand">Loading...</div></PageWrapper>;

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
            <p className="text-warm-sand text-sm font-medium">Update the metadata and subcategories for this category.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          {/* Main Info */}
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
          </div>

          {/* Sidebar / Media */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-soft-oatmeal shadow-sm space-y-8 sticky top-24">
              <h3 className="text-lg font-black text-deep-espresso border-b border-soft-oatmeal pb-4 uppercase tracking-[0.1em]">Banner Media</h3>
              
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
                    Supports JPG, PNG, WEBP.
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
                      Category Updated
                    </>
                  ) : isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      Update Category
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/admin/manage-categories')}
                  className="w-full mt-4 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-warm-sand hover:text-red-500 transition-colors text-center font-bold"
                >
                  Cancel Edit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default EditCategoryPage;
