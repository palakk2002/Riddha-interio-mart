import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiPlus, FiTrash2, FiFileText, FiCheckCircle, FiPackage, FiShoppingBag } from 'react-icons/fi';
import Button from '../../../shared/components/Button';

const BulkProductUpload = () => {
  const [activeTab, setActiveTab] = useState('excel');
  const [manualProducts, setManualProducts] = useState([
    { name: '', brand: '', category: '', price: '', stock: '', imageLink: '', description: '' }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const addRow = () => {
    setManualProducts([...manualProducts, { name: '', brand: '', category: '', price: '', stock: '', imageLink: '', description: '' }]);
  };

  const removeRow = (index) => {
    const updated = manualProducts.filter((_, i) => i !== index);
    setManualProducts(updated.length ? updated : [{ name: '', brand: '', category: '', price: '', stock: '', imageLink: '', description: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...manualProducts];
    updated[index][field] = value;
    setManualProducts(updated);
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 3000);
        }, 500);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-warm-sand/10 rounded-full text-[10px] font-black text-warm-sand uppercase tracking-widest mb-4">
              <FiShoppingBag /> Seller Dashboard
            </div>
            <h1 className="text-4xl font-black text-deep-espresso tracking-tighter uppercase italic">
              Bulk <span className="text-warm-sand">Inventory</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Scale your business by uploading your entire catalog at once.</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('excel')}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${activeTab === 'excel' ? 'bg-deep-espresso text-white border-deep-espresso shadow-xl shadow-black/10' : 'bg-white text-gray-400 border-gray-100 hover:border-warm-sand'}`}
          >
            Import Spreadsheet
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${activeTab === 'manual' ? 'bg-deep-espresso text-white border-deep-espresso shadow-xl shadow-black/10' : 'bg-white text-gray-400 border-gray-100 hover:border-warm-sand'}`}
          >
            Manual Batch Entry
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'excel' ? (
            <motion.div
              key="excel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-[2rem] p-10 md:p-20 border border-gray-100 shadow-sm text-center"
            >
              <div className="max-w-md mx-auto">
                <FiUploadCloud className="text-6xl text-gray-100 mx-auto mb-8" />
                <h2 className="text-2xl font-black text-deep-espresso uppercase italic mb-4">Fast Import</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-12">
                  Upload your Excel or CSV file. We will automatically map your products to our premium catalog.
                </p>

                <div className="space-y-6">
                  <div className="relative group">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="w-full h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center font-black text-xs uppercase tracking-widest text-gray-400 group-hover:border-warm-sand group-hover:text-warm-sand transition-all">
                      Drop File Here
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-warm-sand uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto hover:text-deep-espresso transition-colors">
                    <FiFileText /> Get Inventory Template
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="manual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[2rem] p-6 md:p-10 border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
                <table className="w-full text-left min-w-[1200px]">
                  <thead>
                    <tr className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                      <th className="pb-6 pr-4">Product Details</th>
                      <th className="pb-6 px-4">Brand</th>
                      <th className="pb-6 px-4">Category</th>
                      <th className="pb-6 px-4 w-32">Price (INR)</th>
                      <th className="pb-6 px-4 w-24">Stock</th>
                      <th className="pb-6 px-4">Image Reference</th>
                      <th className="pb-6 pl-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {manualProducts.map((row, idx) => (
                      <tr key={idx} className="group">
                        <td className="py-5 pr-4">
                          <input
                            type="text"
                            placeholder="Product Title"
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.name}
                            onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                          />
                        </td>
                        <td className="py-5 px-4">
                          <input
                            type="text"
                            placeholder="Brand"
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.brand}
                            onChange={(e) => handleInputChange(idx, 'brand', e.target.value)}
                          />
                        </td>
                        <td className="py-5 px-4">
                          <select
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.category}
                            onChange={(e) => handleInputChange(idx, 'category', e.target.value)}
                          >
                            <option value="">Category</option>
                            <option value="furniture">Furniture</option>
                            <option value="decor">Decor</option>
                            <option value="lighting">Lighting</option>
                          </select>
                        </td>
                        <td className="py-5 px-4">
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.price}
                            onChange={(e) => handleInputChange(idx, 'price', e.target.value)}
                          />
                        </td>
                        <td className="py-5 px-4">
                          <input
                            type="number"
                            placeholder="0"
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.stock}
                            onChange={(e) => handleInputChange(idx, 'stock', e.target.value)}
                          />
                        </td>
                        <td className="py-5 px-4">
                          <input
                            type="text"
                            placeholder="URL"
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.imageLink}
                            onChange={(e) => handleInputChange(idx, 'imageLink', e.target.value)}
                          />
                        </td>
                        <td className="py-5 pl-4 text-right">
                          <button
                            onClick={() => removeRow(idx)}
                            className="p-2 text-gray-200 hover:text-red-400 transition-colors"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-gray-50">
                <button
                  onClick={addRow}
                  className="flex items-center gap-3 text-[10px] font-black text-warm-sand uppercase tracking-[0.2em] hover:text-deep-espresso transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-warm-sand/10 flex items-center justify-center">
                    <FiPlus />
                  </div>
                  Add Product Row
                </button>

                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="text-right hidden md:block">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Batch Size</p>
                    <p className="text-xl font-black text-deep-espresso italic">{manualProducts.length} Items</p>
                  </div>
                  <Button
                    onClick={handleBulkSubmit}
                    disabled={isUploading}
                    className="flex-1 md:flex-none h-16 px-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-warm-sand/20 relative overflow-hidden"
                  >
                    {isUploading ? `Processing ${uploadProgress}%` : 'Submit Batch'}
                    {isUploading && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-white/40"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Feedback */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-10 right-10 z-[100]"
            >
              <div className="bg-deep-espresso text-white p-6 rounded-3xl shadow-2xl border border-white/10 flex items-center gap-5">
                <div className="w-12 h-12 bg-warm-sand rounded-2xl flex items-center justify-center text-deep-espresso text-2xl">
                  <FiCheckCircle />
                </div>
                <div>
                  <p className="font-black uppercase tracking-widest text-[10px] text-warm-sand">Batch Received</p>
                  <p className="text-sm font-bold opacity-80">Syncing with marketplace...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BulkProductUpload;
