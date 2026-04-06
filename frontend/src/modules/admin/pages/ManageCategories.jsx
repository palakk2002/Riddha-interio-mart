import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiCheck, FiEdit3, FiTrash2, FiImage, FiLayers, FiSave, FiChevronDown, FiInfo } from 'react-icons/fi';
import { manageCategoriesData } from '../data/manageCategoriesData';

const SubcategoryModal = ({ category, subcategory, isOpen, onClose, onSave }) => {
  const [sub, setSub] = useState({ name: '', image: '', description: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (subcategory) {
      setSub(subcategory);
    } else {
      setSub({ name: '', image: '', description: '' });
    }
  }, [subcategory, isOpen]);

  if (!isOpen || !category) return null;

  const handleChange = (field, value) => {
    setSub(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { 
        alert('Image too large (max 1MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-deep-espresso/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden border border-soft-oatmeal/30 flex flex-col max-h-[90vh]"
      >
        {/* Enhanced Header */}
        <div className="p-8 border-b border-soft-oatmeal flex items-center justify-between bg-soft-oatmeal/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-warm-sand/5 rounded-full -mr-16 -mt-16" />
           <div className="relative z-10 flex items-center gap-5">
             <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white flex-shrink-0">
               <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
             </div>
             <div>
               <h2 className="text-2xl font-display font-bold text-deep-espresso">
                 {subcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
               </h2>
                <p className="text-red-800 text-[10px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  Parent Category: <span className="text-deep-espresso/80">{category.name}</span>
                </p>
             </div>
           </div>
           <button onClick={onClose} className="relative z-10 p-3 hover:bg-red-50 hover:text-red-800 rounded-2xl transition-all text-red-800/60">
             <FiX size={24} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-soft-oatmeal/5">
          <div className="bg-white p-8 rounded-[32px] border border-soft-oatmeal/40 shadow-sm relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Image Picker */}
              <div className="md:col-span-4">
                <input 
                  type="file" accept="image/*" className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="aspect-square w-full rounded-2xl bg-soft-oatmeal/10 border-2 border-dashed border-soft-oatmeal/40 flex flex-col items-center justify-center cursor-pointer hover:bg-soft-oatmeal/20 transition-all overflow-hidden relative"
                >
                  {sub.image ? (
                    <img src={sub.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-3">
                      <FiImage size={28} className="mx-auto mb-2 opacity-30" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-800/60">Upload Photo</span>
                    </div>
                  )}
                  {sub.image && (
                    <div className="absolute inset-0 bg-deep-espresso/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Change Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="md:col-span-8 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-red-800 uppercase tracking-widest">Subcategory Name</label>
                    <input 
                      type="text" value={sub.name} onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. Interior Emulsion" 
                      className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal/40 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-red-800/20 focus:bg-white outline-none transition-all font-medium"
                    />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-red-800 uppercase tracking-widest">Description</label>
                  <textarea 
                    rows="4" value={sub.description} onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Provide details about this specific subcategory record..." 
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal/40 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-warm-sand/20 focus:bg-white outline-none transition-all font-medium resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white border-t border-soft-oatmeal flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-warm-sand hover:text-red-500 transition-colors">Discard</button>
          <button 
            onClick={() => onSave(sub)}
            disabled={!sub.name.trim()}
            className="px-16 bg-deep-espresso text-white disabled:text-deep-espresso disabled:border-warm-sand/20 py-4 rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-dusty-cocoa disabled:bg-soft-oatmeal/40 disabled:cursor-not-allowed transition-all flex items-center gap-3 hover:-translate-y-0.5 active:translate-y-0"
          >
            <FiSave size={18} /> {subcategory ? 'Save Changes' : 'Add Record'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CategoryImage = ({ src, name, className = "" }) => {
  const [error, setError] = useState(false);
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  
  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-soft-oatmeal to-warm-sand/20 text-deep-espresso font-display font-black text-[10px] shadow-inner ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name} 
      onError={() => setError(true)}
      className={`object-cover ${className}`} 
    />
  );
};

const ManageCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [editingSubcategory, setEditingSubcategory] = useState({ category: null, sub: null, index: -1 });
  const [expandedIds, setExpandedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [viewMode, setViewMode] = useState('grid'); // grid, tree, or list

  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_categories');
      if (saved) {
        setCategories(JSON.parse(saved));
      } else {
        localStorage.setItem('admin_categories', JSON.stringify(manageCategoriesData));
        setCategories(manageCategoriesData);
      }
    } catch (err) {
      console.error('Failed to load categories from storage:', err);
      // Fallback to default if corrupted
      setCategories(manageCategoriesData);
    }
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      localStorage.setItem('admin_categories', JSON.stringify(updated));
    }
  };

  const toggleExpand = (id) => {
    const stringId = String(id);
    setExpandedIds(prev => {
      const isExpanded = prev.some(p => String(p) === stringId);
      return isExpanded 
        ? prev.filter(i => String(i) !== stringId) 
        : [...prev, stringId];
    });
  };

  const expandAll = () => setExpandedIds(categories.map(c => c.id));
  const collapseAll = () => setExpandedIds([]);

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || 
                          (statusFilter === 'Active' && cat.isActive !== false) || 
                          (statusFilter === 'Inactive' && cat.isActive === false);
    return matchesSearch && matchesStatus;
  });

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Control Bar */}
        <div className="bg-white p-3 rounded-2xl border border-soft-oatmeal/30 shadow-sm flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate('/admin/manage-categories/add')}
            className="px-5 py-2.5 bg-red-800 text-white rounded-xl flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:bg-deep-espresso transition-all shadow-md active:scale-95"
          >
            <FiPlus size={16} /> Add Category
          </button>

          <div className="h-8 w-px bg-soft-oatmeal/40 mx-1 hidden md:block" />

          {/* View Toggles */}
          <div className="flex bg-soft-oatmeal/10 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-white text-deep-espresso shadow-sm' : 'text-warm-sand/60 hover:text-warm-sand'}`}
            >
              Grid View
            </button>
            <button 
              onClick={() => setViewMode('tree')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'tree' ? 'bg-white text-deep-espresso shadow-sm' : 'text-warm-sand/60 hover:text-warm-sand'}`}
            >
              Tree View
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-deep-espresso shadow-sm' : 'text-warm-sand/60 hover:text-warm-sand'}`}
            >
              List View
            </button>
          </div>

          <div className="flex-1 min-w-[200px] relative">
            <input 
              type="text" 
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal/30 rounded-xl pl-4 pr-10 py-2.5 text-xs font-medium focus:ring-2 focus:ring-warm-sand/20 focus:bg-white outline-none transition-all placeholder:text-warm-sand/30"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-sand/30">
              <FiInfo size={14} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-warm-sand/60">Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-soft-oatmeal/40 rounded-xl px-3 py-2 text-xs font-bold text-deep-espresso outline-none focus:ring-2 focus:ring-warm-sand/20"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <button className="p-2.5 bg-golden-glow text-warm-sand rounded-xl hover:bg-soft-oatmeal transition-all active:scale-95 flex items-center gap-2">
            <FiCheck size={16} />
            <span className="text-[9px] font-black uppercase tracking-widest pr-1">Export</span>
          </button>
        </div>

        {/* Visibility Toggles */}
        <div className="flex items-center gap-2">
           <button 
             onClick={expandAll}
             className="px-4 py-1.5 bg-white border border-soft-oatmeal/40 rounded-lg text-[8px] font-black uppercase tracking-widest text-warm-sand hover:text-deep-espresso transition-all shadow-sm"
           >
             Expand All
           </button>
           <button 
             onClick={collapseAll}
             className="px-4 py-1.5 bg-white border border-soft-oatmeal/40 rounded-lg text-[8px] font-black uppercase tracking-widest text-warm-sand hover:text-deep-espresso transition-all shadow-sm"
           >
             Collapse All
           </button>
        </div>

        {/* Content Display based on ViewMode */}
        <div className={viewMode === 'grid' ? "flex flex-col gap-3" : "space-y-3"}>
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat, index) => {
              const isExpanded = expandedIds.some(id => String(id) === String(cat.id));
              
              return viewMode === 'grid' ? (
                /* Full-Width Expandable Category Card */
                <div key={cat.id} className="space-y-1">
                  <div 
                    onClick={() => toggleExpand(cat.id)}
                    className={`bg-white p-3 rounded-2xl border border-soft-oatmeal/40 shadow-sm flex items-center gap-6 relative group cursor-pointer hover:border-warm-sand/20 transition-all ${cat.isActive === false ? 'opacity-70 grayscale-[0.3]' : ''}`}
                  >
                     {/* Image */}
                     <div className="w-16 h-16 rounded-xl overflow-hidden border border-soft-oatmeal/30 shadow-inner flex-shrink-0">
                        <CategoryImage src={cat.image} name={cat.name} className="w-full h-full" />
                     </div>

                     {/* Info */}
                     <div className="flex-1 min-w-0 flex items-center gap-8">
                        <div className="w-48">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-display font-bold text-deep-espresso truncate">{cat.name}</h3>
                            <FiChevronDown 
                              size={14} 
                              className={`text-warm-sand/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                            />
                          </div>
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = categories.map(c => c.id === cat.id ? { ...c, isActive: !c.isActive } : c);
                              setCategories(updated);
                              localStorage.setItem('admin_categories', JSON.stringify(updated));
                            }}
                            className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[6px] font-black uppercase tracking-widest cursor-pointer transition-all ${cat.isActive !== false ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
                          >
                            {cat.isActive !== false ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        
                        <div className="flex-1 hidden md:block">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-deep-espresso">
                             <FiLayers size={10} className="text-warm-sand/40" /> {cat.subcategories?.length || 0} Records
                          </div>
                          <p className="text-[7px] text-warm-sand/40 font-black uppercase tracking-widest mt-1">Nested Hierarchy</p>
                        </div>

                        <div className="hidden lg:block text-right">
                           <div className="text-[10px] font-bold text-deep-espresso">Order: {index}</div>
                           <p className="text-[7px] text-warm-sand/40 font-black uppercase tracking-widest mt-1">Priority Index</p>
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="flex items-center gap-2 flex-shrink-0 bg-soft-oatmeal/5 p-1.5 rounded-xl border border-soft-oatmeal/30">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingSubcategory({ category: cat, sub: null, index: -1 }); }}
                          className="p-2 bg-white border border-soft-oatmeal rounded-lg text-warm-sand hover:bg-deep-espresso hover:text-white transition-all shadow-sm"
                          title="Add Subcategory"
                        >
                          <FiPlus size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/manage-categories/edit/${cat.id}`); }}
                          className="p-2 bg-white border border-soft-oatmeal rounded-lg text-warm-sand hover:bg-deep-espresso hover:text-white transition-all shadow-sm"
                          title="Edit"
                        >
                          <FiEdit3 size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}
                          className="p-2 bg-red-50 text-red-400 border border-red-100 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                     </div>
                  </div>

                  {/* Expanded Subcategories Map */}
                  <AnimatePresence>
                    {isExpanded && cat.subcategories?.length > 0 && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-soft-oatmeal/5 rounded-2xl border border-soft-oatmeal/20 ml-12 mb-4"
                      >
                         <div className="p-3 space-y-2">
                            {cat.subcategories.map((sub, sIdx) => (
                              <div key={sIdx} className="bg-white p-2.5 rounded-xl border border-soft-oatmeal/30 shadow-sm flex items-center justify-between group/sub">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-md overflow-hidden bg-soft-oatmeal/10 border border-soft-oatmeal/20">
                                       <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                       <h4 className="text-[11px] font-bold text-deep-espresso">{sub.name}</h4>
                                       <p className="text-[8px] text-warm-sand/60 font-medium">Internal Record #{sIdx + 1}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                    <button 
                                      onClick={() => setEditingSubcategory({ category: cat, sub: sub, index: sIdx })}
                                      className="p-1.5 hover:bg-soft-oatmeal/30 rounded-lg text-warm-sand transition-all"
                                    >
                                       <FiEdit3 size={12} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        if (window.confirm('Delete subcategory?')) {
                                          const newSub = cat.subcategories.filter((_, i) => i !== sIdx);
                                          const updated = categories.map(c => c.id === cat.id ? { ...c, subcategories: newSub } : c);
                                          setCategories(updated);
                                          localStorage.setItem('admin_categories', JSON.stringify(updated));
                                        }
                                      }}
                                      className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg text-warm-sand/60 transition-all"
                                    >
                                       <FiTrash2 size={12} />
                                    </button>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Tree/List View Mode */
                <div key={cat.id} className="space-y-2">
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white p-3 rounded-2xl border border-soft-oatmeal/40 shadow-sm flex items-center gap-4 transition-all ${expandedIds.includes(cat.id) ? 'border-warm-sand/30 shadow-md ring-1 ring-warm-sand/5' : 'hover:border-warm-sand/20'}`}
                  >
                    {viewMode === 'tree' && (
                      <button 
                        onClick={() => toggleExpand(cat.id)}
                        className={`p-1.5 transition-transform duration-300 ${expandedIds.some(p => String(p) === String(cat.id)) ? 'rotate-0' : '-rotate-90'}`}
                      >
                        <FiChevronDown size={18} className="text-warm-sand/60" />
                      </button>
                    )}

                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-soft-oatmeal/30 shadow-sm flex-shrink-0">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center gap-3">
                        <h3 className="font-display font-bold text-deep-espresso text-base">{cat.name}</h3>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${cat.isActive !== false ? 'bg-golden-glow text-warm-sand' : 'bg-soft-oatmeal text-warm-sand/50'}`}>
                            {cat.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-soft-oatmeal text-deep-espresso text-[7px] font-black uppercase tracking-widest">
                            {cat.subcategories?.length || 0} Subcategories
                          </span>
                          <span className="text-[7px] font-black text-warm-sand/40 uppercase tracking-widest pl-1">
                            Order: {index}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSubcategory({ category: cat, sub: null, index: -1 })}
                        className="px-4 py-2 bg-red-800 text-white rounded-lg flex items-center gap-2 text-[9px] font-black uppercase tracking-widest hover:bg-deep-espresso transition-all"
                      >
                        <FiPlus size={14} /> Add Subcategory
                      </button>
                      <button
                        onClick={() => {
                          const updated = categories.map(c => c.id === cat.id ? { ...c, isActive: !c.isActive } : c);
                          setCategories(updated);
                          localStorage.setItem('admin_categories', JSON.stringify(updated));
                        }}
                        className={`px-4 py-2 ${cat.isActive !== false ? 'bg-soft-oatmeal text-warm-sand' : 'bg-golden-glow text-warm-sand'} rounded-lg text-[9px] font-black uppercase tracking-widest transition-all`}
                      >
                        {cat.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => navigate(`/admin/manage-categories/edit/${cat.id}`)}
                        className="p-2 bg-soft-oatmeal/40 text-warm-sand rounded-lg hover:bg-soft-oatmeal transition-all"
                      >
                        <FiEdit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 bg-soft-oatmeal/20 text-warm-sand hover:text-red-500 rounded-lg transition-all"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {viewMode === 'tree' && expandedIds.some(p => String(p) === String(cat.id)) && (
                      <motion.div
                        initial={{ opacity: 0, x: -10, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                        exit={{ opacity: 0, x: -10, height: 0 }}
                        className="ml-10 space-y-2 border-l-2 border-soft-oatmeal/20 pl-4 py-1 overflow-hidden"
                      >
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          cat.subcategories.map((sub, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-soft-oatmeal/40 shadow-sm flex items-center gap-4 hover:border-warm-sand/20 transition-all group">
                               <div className="w-10 h-10 rounded-lg overflow-hidden border border-soft-oatmeal/30 shadow-xs flex-shrink-0 bg-white">
                                  <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                               </div>
                               <div className="flex-grow">
                                 <div className="flex items-center gap-3">
                                   <h4 className="font-bold text-deep-espresso text-xs">{sub.name}</h4>
                                   <span className="px-2 py-0.5 rounded-md bg-golden-glow text-warm-sand text-[6px] font-black uppercase tracking-widest">Subcategory</span>
                                 </div>
                                 <p className="text-[10px] text-warm-sand italic line-clamp-1 mt-0.5">{sub.description || "No description provided."}</p>
                               </div>
                               <div className="flex items-center gap-1.5 px-2">
                                  <button 
                                    onClick={() => setEditingSubcategory({ category: cat, sub, index: i })}
                                    className="p-2 bg-soft-oatmeal/40 text-warm-sand rounded-lg hover:bg-soft-oatmeal transition-all"
                                  >
                                    <FiEdit3 size={12} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if(window.confirm('Delete this record?')) {
                                        const updatedSubs = cat.subcategories.filter((_, idx) => idx !== i);
                                        const updatedCats = categories.map(c => c.id === cat.id ? { ...c, subcategories: updatedSubs } : c);
                                        setCategories(updatedCats);
                                        localStorage.setItem('admin_categories', JSON.stringify(updatedCats));
                                      }
                                    }}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                                  >
                                    <FiTrash2 size={12} />
                                  </button>
                               </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 border border-dashed border-soft-oatmeal/40 rounded-xl text-center">
                             <span className="text-[8px] font-black uppercase tracking-widest text-warm-sand/30">No inner records found.</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary Footer */}
        <div className="bg-white p-4 rounded-3xl border border-soft-oatmeal/30 flex items-center justify-between text-[11px] text-warm-sand shadow-sm">
          <p className="font-medium">
            Currently maintaining <span className="font-bold text-deep-espresso">{filteredCategories.length}</span> active categories.
          </p>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-emerald-100">
            System Synchronized
          </span>
        </div>
      </div>

      <AnimatePresence>
        {editingSubcategory.category && (
          <SubcategoryModal 
            category={editingSubcategory.category}
            subcategory={editingSubcategory.sub}
            isOpen={!!editingSubcategory.category}
            onClose={() => setEditingSubcategory({ category: null, sub: null, index: -1 })}
            onSave={(updatedSub) => {
              const cat = editingSubcategory.category;
              const idx = editingSubcategory.index;
              let updatedSubs;

              if (idx === -1) {
                // Add new
                updatedSubs = [...(cat.subcategories || []), updatedSub];
              } else {
                // Edit existing
                updatedSubs = cat.subcategories.map((s, i) => i === idx ? updatedSub : s);
              }

              const updatedCats = categories.map(c => 
                c.id === cat.id ? { ...c, subcategories: updatedSubs } : c
              );

              setCategories(updatedCats);
              localStorage.setItem('admin_categories', JSON.stringify(updatedCats));
              setEditingSubcategory({ category: null, sub: null, index: -1 });
            }}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default ManageCategories;
