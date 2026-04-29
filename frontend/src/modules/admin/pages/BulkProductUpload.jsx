import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiPlus, FiTrash2, FiFileText, FiCheckCircle, FiAlertCircle, FiDatabase, FiLayers } from 'react-icons/fi';
import Button from '../../../shared/components/Button';

const BulkProductUpload = () => {
  const [activeTab, setActiveTab] = useState('excel'); // 'excel' or 'manual'
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
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-deep-espresso flex items-center gap-3">
            <FiLayers className="text-warm-sand" /> Bulk Product Upload
          </h1>
          <p className="text-gray-500 font-medium mt-2">Add hundreds of premium interior products in seconds.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-gray-200/50 rounded-2xl w-full md:w-fit mb-8 border border-gray-200">
          <button
            onClick={() => setActiveTab('excel')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'excel' ? 'bg-white text-deep-espresso shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Excel / CSV Import
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-white text-deep-espresso shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Manual Bulk Entry
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'excel' ? (
            <motion.div
              key="excel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-gray-100 shadow-xl shadow-gray-200/20 text-center"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-soft-oatmeal/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-warm-sand/30">
                  <FiUploadCloud className="text-4xl text-warm-sand" />
                </div>
                <h2 className="text-2xl font-black text-deep-espresso mb-4">Upload Spreadsheet</h2>
                <p className="text-gray-400 font-medium text-sm mb-10 leading-relaxed">
                  Drag and drop your product catalog file here. Supported formats: .csv, .xlsx, .xls
                </p>

                <div className="space-y-4">
                  <div className="relative group">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest border-2 border-dashed border-gray-200 bg-transparent text-gray-400 group-hover:border-warm-sand group-hover:text-warm-sand transition-all">
                      Choose File
                    </Button>
                  </div>
                  <button className="text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:underline">
                    <FiFileText /> Download Sample Template
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/20"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[1000px]">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <th className="pb-6 pr-4">Product Name*</th>
                      <th className="pb-6 px-4">Brand</th>
                      <th className="pb-6 px-4">Category*</th>
                      <th className="pb-6 px-4 w-32">Price*</th>
                      <th className="pb-6 px-4 w-24">Stock*</th>
                      <th className="pb-6 px-4">Image URL</th>
                      <th className="pb-6 pl-4 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {manualProducts.map((row, idx) => (
                      <tr key={idx} className="group">
                        <td className="py-4 pr-4">
                          <input
                            type="text"
                            placeholder="e.g. Royal Oak Sofa"
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.name}
                            onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            placeholder="Brand Name"
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.brand}
                            onChange={(e) => handleInputChange(idx, 'brand', e.target.value)}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <select
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.category}
                            onChange={(e) => handleInputChange(idx, 'category', e.target.value)}
                          >
                            <option value="">Select Category</option>
                            <option value="living">Living Room</option>
                            <option value="bedroom">Bedroom</option>
                            <option value="kitchen">Kitchen</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="number"
                            placeholder="₹"
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.price}
                            onChange={(e) => handleInputChange(idx, 'price', e.target.value)}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="number"
                            placeholder="Qty"
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.stock}
                            onChange={(e) => handleInputChange(idx, 'stock', e.target.value)}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            placeholder="https://..."
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-deep-espresso focus:ring-2 focus:ring-warm-sand/20"
                            value={row.imageLink}
                            onChange={(e) => handleInputChange(idx, 'imageLink', e.target.value)}
                          />
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <button
                            onClick={() => removeRow(idx)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <button
                  onClick={addRow}
                  className="flex items-center gap-2 text-[10px] font-black text-warm-sand uppercase tracking-widest hover:text-deep-espresso transition-colors"
                >
                  <FiPlus className="text-lg" /> Add Another Product
                </button>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Items Ready</p>
                    <p className="text-lg font-black text-deep-espresso leading-none">{manualProducts.length}</p>
                  </div>
                  <Button
                    onClick={handleBulkSubmit}
                    disabled={isUploading}
                    className="flex-1 md:flex-none h-14 px-12 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-warm-sand/20 relative overflow-hidden"
                  >
                    {isUploading ? `Uploading ${uploadProgress}%` : 'Upload Catalog'}
                    {isUploading && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-white/30"
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

        {/* Success Modal */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-none"
            >
              <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
                <FiCheckCircle className="text-2xl" />
                <div>
                  <p className="font-black uppercase tracking-widest text-[10px]">Success</p>
                  <p className="text-sm font-bold">Products have been queued for processing.</p>
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
