import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPlus, LuX, LuCheck, LuPen, LuTrash2, LuImage, LuLayoutGrid, LuLayoutList, LuArrowRight } from 'react-icons/lu';
import { manageFavouriteCategoriesData } from '../data/manageFavouriteCategoriesData';

const ManageFavouriteCategories = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ tabs: [], categories: [] });
  const [activeTab, setActiveTab] = useState('');
  const [showAddTabForm, setShowAddTabForm] = useState(false);
  const [newTab, setNewTab] = useState({ name: '', image: '' });

  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('admin_favourite_categories');
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed);
      
      // Preservation logic: use incoming state > existing active > first tab
      const incomingTab = location.state?.activeTab;
      if (incomingTab && parsed.tabs.includes(incomingTab)) {
        setActiveTab(incomingTab);
      } else if (!activeTab && parsed.tabs.length > 0) {
        setActiveTab(parsed.tabs[0]);
      }
    } else {
      setData(manageFavouriteCategoriesData);
      if (manageFavouriteCategoriesData.tabs.length > 0) setActiveTab(manageFavouriteCategoriesData.tabs[0]);
      localStorage.setItem('admin_favourite_categories', JSON.stringify(manageFavouriteCategoriesData));
    }
  }, [location]);

  const saveToStorage = (updatedData) => {
    setData(updatedData);
    localStorage.setItem('admin_favourite_categories', JSON.stringify(updatedData));
  };

  const handleCreateTab = (e) => {
    e.preventDefault();
    if (!newTab.name || data.tabs.includes(newTab.name)) return;

    const updatedData = {
      ...data,
      tabs: [...data.tabs, newTab.name],
    };
    saveToStorage(updatedData);
    setActiveTab(newTab.name);
    setShowAddTabForm(false);
    setNewTab({ name: '', image: '' });
  };

  const handleDeleteItem = (id) => {
    const updatedData = {
      ...data,
      categories: data.categories.filter((c) => c.id !== id),
    };
    saveToStorage(updatedData);
  };

  const handleRenameTab = (oldName) => {
    const newName = prompt('Rename Tab to:', oldName);
    if (newName && newName !== oldName && !data.tabs.includes(newName)) {
      const updatedTabs = data.tabs.map(t => t === oldName ? newName : t);
      const updatedCategories = data.categories.map(c => c.category === oldName ? { ...c, category: newName } : c);

      const updatedData = {
        tabs: updatedTabs,
        categories: updatedCategories
      };

      saveToStorage(updatedData);
      setActiveTab(newName);
    }
  };

  const handleDeleteTab = (tabName) => {
    if (window.confirm(`Delete "${tabName}" and all its contents?`)) {
      const updatedTabs = data.tabs.filter(t => t !== tabName);
      const updatedCategories = data.categories.filter(c => c.category !== tabName);

      const updatedData = {
        tabs: updatedTabs,
        categories: updatedCategories
      };

      saveToStorage(updatedData);
      if (updatedTabs.length > 0) setActiveTab(updatedTabs[0]);
    }
  };

  const filteredItems = data.categories.filter(cat => cat.category === activeTab);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-deep-espresso">Favourite Categories</h1>
            <p className="text-warm-sand mt-1">Manage the tabbed categories section on your homepage.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddTabForm(!showAddTabForm)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm shadow-sm border ${showAddTabForm ? 'bg-deep-espresso text-white' : 'bg-white border-soft-oatmeal text-deep-espresso hover:bg-soft-oatmeal/20'
                }`}
            >
              {showAddTabForm ? <LuX size={18} /> : <LuLayoutGrid size={18} />}
              {showAddTabForm ? 'Cancel' : 'Add New Tab'}
            </button>
            <button
              onClick={() => navigate('/admin/manage-favourites/add', { state: { category: activeTab } })}
              className="flex items-center gap-2 bg-dusty-cocoa text-white px-6 py-2.5 rounded-xl font-bold hover:bg-deep-espresso transition-all shadow-md shadow-dusty-cocoa/20 text-sm"
            >
              <LuPlus size={18} />
              Add Item to "{activeTab}"
            </button>
          </div>
        </div>

        {/* Add Tab Form Inline */}
        <AnimatePresence>
          {showAddTabForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-dashed border-warm-sand/30 shadow-sm mb-8">
                <h3 className="text-lg font-display font-bold text-deep-espresso mb-6">
                  Add New Category Tab
                </h3>
                <form onSubmit={handleCreateTab} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">
                      Tab Name
                    </label>
                    <input
                      required autoFocus
                      type="text"
                      value={newTab.name}
                      onChange={(e) => setNewTab({ ...newTab, name: e.target.value })}
                      className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                      placeholder="e.g. Garden Decor"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-warm-sand uppercase tracking-wider">
                      Internal Notes / Hint
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        className="flex-grow bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                        placeholder="Optional description for your reference..."
                      />
                      <button
                        type="submit"
                        className="bg-deep-espresso text-white px-8 py-3 rounded-xl font-bold hover:bg-dusty-cocoa transition-all flex items-center gap-2 shadow-md whitespace-nowrap"
                      >
                        <LuCheck size={18} />
                        Add Tab
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Switcher / Management */}
        <div className="flex flex-wrap items-center gap-2 border-b border-soft-oatmeal/30 pb-4">
          {data.tabs.map((tab) => (
            <div key={tab} className="relative group/tab">
              <button
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                  ? 'bg-deep-espresso text-white shadow-lg'
                  : 'bg-soft-oatmeal/20 text-warm-sand hover:bg-soft-oatmeal/40'
                  }`}
              >
                {tab}
              </button>

              {/* Tab Actions */}
              <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover/tab:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRenameTab(tab)}
                  className="w-6 h-6 bg-white border border-soft-oatmeal rounded-full flex items-center justify-center text-warm-sand hover:text-dusty-cocoa shadow-sm"
                >
                  <LuPen size={10} />
                </button>
                <button
                  onClick={() => handleDeleteTab(tab)}
                  className="w-6 h-6 bg-white border border-soft-oatmeal rounded-full flex items-center justify-center text-red-400 hover:text-red-500 shadow-sm"
                >
                  <LuTrash2 size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((cat, index) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-soft-oatmeal/20 hover:shadow-xl transition-all duration-500"
              >
                {/* Image Container */}
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-deep-espresso/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDeleteItem(cat.id)}
                      className="bg-white/90 p-1.5 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                      title="Delete Item"
                    >
                      <LuTrash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="py-2.5 px-2 text-center bg-soft-oatmeal/5">
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tight text-deep-espresso/70 group-hover:text-dusty-cocoa transition-colors line-clamp-1">
                    {cat.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty / Add Placeholder */}
          <button
            onClick={() => navigate('/admin/manage-favourites/add', { state: { category: activeTab } })}
            className="border-2 border-dashed border-soft-oatmeal/60 rounded-xl aspect-square flex flex-col items-center justify-center gap-2 text-warm-sand hover:border-dusty-cocoa hover:text-dusty-cocoa hover:bg-white/50 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-soft-oatmeal/10 flex items-center justify-center group-hover:bg-dusty-cocoa/10 transition-colors">
              <LuPlus size={16} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-black text-[8px] md:text-[9px] uppercase tracking-widest">Add Item</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="bg-white p-6 rounded-3xl border border-soft-oatmeal/30 flex items-center justify-between text-xs text-warm-sand shadow-sm">
          <div className="flex items-center gap-2">
            <LuLayoutList size={16} className="text-dusty-cocoa" />
            <p>Managing <span className="font-bold text-deep-espresso">{filteredItems.length}</span> items across <span className="font-bold text-deep-espresso">{data.tabs.length}</span> themes</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#10B981]">
            <LuCheck size={14} /> System Active
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManageFavouriteCategories;
