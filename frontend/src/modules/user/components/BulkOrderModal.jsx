import React, { useState, useEffect } from 'react';
import { FiX, FiPackage, FiPhone, FiUser, FiMessageSquare, FiSend, FiChevronRight, FiPlus, FiTrash2, FiSearch, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../shared/utils/api';

const BulkOrderModal = ({ isOpen, onClose }) => {
  const [selectionMode, setSelectionMode] = useState('single'); // 'single' or 'multiple'
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [availableProducts, setAvailableProducts] = useState({}); // { catId: [products] }
  const [orderItems, setOrderItems] = useState([]); // [{ id, name, qty, catId }]
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleModeChange = (mode) => {
    setSelectionMode(mode);
    setSelectedCategoryIds([]);
    setOrderItems([]);
  };

  const toggleCategory = async (catId) => {
    let newSelection;
    if (selectionMode === 'single') {
      newSelection = [catId];
    } else {
      newSelection = selectedCategoryIds.includes(catId)
        ? selectedCategoryIds.filter(id => id !== catId)
        : [...selectedCategoryIds, catId];
    }
    setSelectedCategoryIds(newSelection);

    // Fetch products for newly selected category if not already fetched
    if (newSelection.includes(catId) && !availableProducts[catId]) {
      try {
        setLoading(true);
        const catName = categories.find(c => c._id === catId).name;
        const res = await api.get(`/products?category=${catName}`);
        setAvailableProducts(prev => ({ ...prev, [catId]: res.data.data }));
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const addProductToOrder = (product) => {
    if (orderItems.find(item => item.id === product._id)) return;
    setOrderItems([...orderItems, { id: product._id, name: product.name, qty: 1, price: product.price, image: product.images?.[0] }]);
  };

  const removeOrderItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    setOrderItems(orderItems.map(item => item.id === id ? { ...item, qty: parseInt(newQty) } : item));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderItems.length === 0) return alert('Please add at least one product');
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setOrderItems([]);
        setSelectedCategoryIds([]);
        setFormData({ name: '', contact: '', message: '' });
      }, 3000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[32px] w-full max-w-[600px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative"
          >
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 z-50 transition-all">
              <FiX size={18} />
            </button>

            {/* Header */}
            <div className="bg-[#189D91] p-6 text-white shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiPackage className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tight">Bulk Order <span className="text-white/60">Center</span></h2>
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-widest">Premium Corporate & Volume Solutions</p>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {status === 'success' ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <FiCheckCircle size={32} />
                  </div>
                  <h3 className="text-lg font-black uppercase italic text-gray-800">Inquiry Logged</h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Our B2B team will contact you shortly.</p>
                </div>
              ) : (
                <form id="bulkForm" onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                      <input required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 focus:border-[#189D91] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 outline-none text-xs font-bold" />
                    </div>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                      <input required placeholder="Contact" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full bg-gray-50 border border-gray-100 focus:border-[#189D91] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 outline-none text-xs font-bold" />
                    </div>
                  </div>

                  {/* Step 2: Mode Toggle */}
                  <div className="flex items-center justify-between p-1 bg-gray-50 rounded-xl">
                    <button type="button" onClick={() => handleModeChange('single')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${selectionMode === 'single' ? 'bg-white text-[#189D91] shadow-sm' : 'text-gray-400'}`}>Single Category</button>
                    <button type="button" onClick={() => handleModeChange('multiple')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${selectionMode === 'multiple' ? 'bg-white text-[#189D91] shadow-sm' : 'text-gray-400'}`}>Multiple Categories</button>
                  </div>

                  {/* Step 3: Category Selection */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Select {selectionMode === 'single' ? 'Category' : 'Categories'}</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => toggleCategory(cat._id)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${selectedCategoryIds.includes(cat._id) ? 'bg-[#189D91] border-[#189D91] text-white' : 'bg-white border-gray-100 text-gray-500 hover:border-[#189D91]'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Product Selection */}
                  <AnimatePresence>
                    {selectedCategoryIds.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Available Products</label>
                        <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                          {selectedCategoryIds.map(catId => (
                            <div key={catId} className="space-y-2">
                              {availableProducts[catId]?.map(prod => (
                                <div key={prod._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 transition-all group">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white overflow-hidden shadow-sm border border-gray-50">
                                      <img src={prod.images?.[0]} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-700 truncate max-w-[200px]">{prod.name}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => addProductToOrder(prod)}
                                    className={`p-1.5 rounded-lg transition-all ${orderItems.find(i => i.id === prod._id) ? 'bg-green-500 text-white' : 'bg-white text-[#189D91] shadow-sm hover:scale-110'}`}
                                  >
                                    {orderItems.find(i => i.id === prod._id) ? <FiCheckCircle /> : <FiPlus />}
                                  </button>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 5: Order List */}
                  <AnimatePresence>
                    {orderItems.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 border-t border-dashed border-gray-100 pt-6">
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Order Items ({orderItems.length})</label>
                          <button type="button" onClick={() => setOrderItems([])} className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Clear All</button>
                        </div>
                        <div className="space-y-2">
                          {orderItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-[#189D91]/5 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] font-bold text-[#189D91] truncate max-w-[150px]">{item.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center bg-white rounded-lg border border-[#189D91]/20 p-1">
                                  <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} className="w-5 h-5 flex items-center justify-center text-[#189D91] font-bold">-</button>
                                  <input 
                                    type="number" 
                                    value={item.qty} 
                                    onChange={e => updateQty(item.id, e.target.value)}
                                    className="w-8 text-center text-[11px] font-black bg-transparent outline-none" 
                                  />
                                  <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} className="w-5 h-5 flex items-center justify-center text-[#189D91] font-bold">+</button>
                                </div>
                                <button type="button" onClick={() => removeOrderItem(item.id)} className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <FiMessageSquare className="absolute left-4 top-3 text-gray-300 text-xs" />
                    <textarea placeholder="Notes / Special Requirements" rows="2" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-gray-50 border border-gray-100 focus:border-[#189D91] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 outline-none text-xs font-bold resize-none" />
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            {status !== 'success' && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
                <button
                  form="bulkForm"
                  disabled={loading || orderItems.length === 0 || status === 'sending'}
                  type="submit"
                  className="w-full bg-[#189D91] text-white py-3.5 rounded-[18px] font-black uppercase tracking-[0.15em] text-[11px] hover:bg-[#14847a] transition-all shadow-lg shadow-[#189D91]/20 active:scale-[0.98] disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3"
                >
                  {status === 'sending' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Submit Bulk Inquiry <FiChevronRight /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkOrderModal;
