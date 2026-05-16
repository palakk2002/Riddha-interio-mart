import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  Plus, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Package, 
  ShoppingBag,
  FileSpreadsheet,
  Zap,
  Info,
  ChevronRight,
  ArrowRight,
  X,
  PlusCircle,
  Database,
  SearchCode
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const BulkProductUpload = () => {
  const [activeTab, setActiveTab] = useState('excel');
  const [manualProducts, setManualProducts] = useState([
    { name: '', sku: '', hsnCode: '', brand: '', category: '', price: '', stock: '', imageLink: '', description: '' }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const addRow = () => {
    setManualProducts([...manualProducts, { name: '', sku: '', hsnCode: '', brand: '', category: '', price: '', stock: '', imageLink: '', description: '' }]);
  };

  const removeRow = (index) => {
    const updated = manualProducts.filter((_, i) => i !== index);
    setManualProducts(updated.length ? updated : [{ name: '', sku: '', hsnCode: '', brand: '', category: '', price: '', stock: '', imageLink: '', description: '' }]);
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
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 3000);
        }, 500);
      }
    }, 100);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bulk Inventory Sync</h1>
            <p className="text-sm font-medium text-slate-500">Scale your storefront by uploading entire catalogs at once</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Batch Limit</p>
                   <p className="text-xl font-bold text-slate-900">1,000 Items</p>
                </div>
                <div className="w-10 h-10 bg-seller-primary/10 rounded-xl flex items-center justify-center text-seller-primary">
                   <Zap size={20} />
                </div>
             </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full md:w-fit overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('excel')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'excel' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <FileSpreadsheet size={16} /> Import Spreadsheet
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'manual' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <Zap size={16} /> Manual Batch Entry
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'excel' ? (
            <motion.div
              key="excel-upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-[2.5rem] p-12 md:p-24 border border-slate-200 shadow-sm flex flex-col items-center text-center"
            >
              <div className="max-w-md w-full space-y-10">
                <div className="relative group mx-auto">
                   <div className="absolute inset-0 bg-seller-primary/10 rounded-full blur-3xl group-hover:bg-seller-primary/20 transition-colors"></div>
                   <div className="relative w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl mx-auto">
                      <UploadCloud size={40} />
                   </div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Import Fast, Scale Faster</h2>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    Upload your Excel or CSV file. Our engine will automatically validate and map your data to our global catalog.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="relative group">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="w-full h-32 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 group-hover:border-seller-primary group-hover:bg-seller-light/5 transition-all">
                       <Plus size={24} className="text-slate-300 group-hover:text-seller-primary transition-colors" />
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drop File or Click to Browse</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                     <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        <FileText size={16} /> Download Template
                     </button>
                     <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Info size={14} /> Supports .XLSX, .CSV
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="manual-upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                 <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-seller-primary rounded-full" />
                    Batch Processing Engine
                 </h3>
                 <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                       {manualProducts.length} Items Loaded
                    </span>
                 </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left min-w-[1400px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Product Title</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">SKU</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">HSN</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Brand</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-40">Price (INR)</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-32">Stock</th>
                      <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Asset Link</th>
                      <th className="px-8 py-5 text-right w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {manualProducts.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5">
                          <input
                            type="text"
                            placeholder="e.g. Marble Slab"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-seller-primary/10 transition-all"
                            value={row.name}
                            onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                          />
                        </td>
                        <td className="px-8 py-5">
                          <input
                            type="text"
                            placeholder="SKU"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-seller-primary/10 transition-all"
                            value={row.sku}
                            onChange={(e) => handleInputChange(idx, 'sku', e.target.value)}
                          />
                        </td>
                        <td className="px-8 py-5">
                          <input
                            type="text"
                            placeholder="HSN"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-seller-primary/10 transition-all"
                            value={row.hsnCode}
                            onChange={(e) => handleInputChange(idx, 'hsnCode', e.target.value)}
                          />
                        </td>
                        <td className="px-8 py-5">
                          <input
                            type="text"
                            placeholder="Brand"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-seller-primary/10 transition-all"
                            value={row.brand}
                            onChange={(e) => handleInputChange(idx, 'brand', e.target.value)}
                          />
                        </td>
                        <td className="px-8 py-5">
                          <select
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-seller-primary/10 transition-all"
                            value={row.category}
                            onChange={(e) => handleInputChange(idx, 'category', e.target.value)}
                          >
                            <option value="">Select Category</option>
                            <option value="tiles">Tiles & Slabs</option>
                            <option value="faucets">Faucets</option>
                            <option value="sanitary">Sanitaryware</option>
                          </select>
                        </td>
                        <td className="px-8 py-5">
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-xs font-bold text-emerald-600 focus:ring-2 focus:ring-seller-primary/10 transition-all"
                            value={row.price}
                            onChange={(e) => handleInputChange(idx, 'price', e.target.value)}
                          />
                        </td>
                        <td className="px-8 py-5">
                          <input
                            type="number"
                            placeholder="0"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-seller-primary/10 transition-all"
                            value={row.stock}
                            onChange={(e) => handleInputChange(idx, 'stock', e.target.value)}
                          />
                        </td>
                        <td className="px-8 py-5">
                          <input
                            type="text"
                            placeholder="Image URL"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-xs font-bold text-slate-400 focus:ring-2 focus:ring-seller-primary/10 transition-all"
                            value={row.imageLink}
                            onChange={(e) => handleInputChange(idx, 'imageLink', e.target.value)}
                          />
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => removeRow(idx)}
                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-8 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
                <button
                  onClick={addRow}
                  className="flex items-center gap-2.5 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-900 uppercase tracking-widest hover:border-seller-primary transition-all shadow-sm"
                >
                  <PlusCircle size={18} className="text-seller-primary" />
                  Add Product Row
                </button>

                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Queue Size</p>
                    <p className="text-xl font-bold text-slate-900 tracking-tight">{manualProducts.length} Items</p>
                  </div>
                  <button
                    onClick={handleBulkSubmit}
                    disabled={isUploading}
                    className="flex-1 sm:flex-none h-16 px-12 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-seller-primary transition-all relative overflow-hidden min-w-[200px]"
                  >
                    <span className="relative z-10">{isUploading ? `Syncing ${uploadProgress}%` : 'Finalize & Submit'}</span>
                    {isUploading && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1.5 bg-seller-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Feedback Overlay */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
            >
              <div className="bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-5 border border-white/10 backdrop-blur-xl">
                <div className="w-12 h-12 bg-seller-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <CheckCircle2 size={26} />
                </div>
                <div>
                  <p className="font-bold uppercase tracking-widest text-[11px] text-seller-primary">Sync Initiated</p>
                  <p className="text-sm font-medium text-white/80 mt-0.5">Processing your batch in the background...</p>
                </div>
                <button onClick={() => setIsSuccess(false)} className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors">
                   <X size={16} className="text-white/40" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default BulkProductUpload;
