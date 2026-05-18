import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { FiSearch, FiAlertCircle, FiArrowUp, FiPackage, FiTrendingDown, FiShoppingCart } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, low, out

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/admin/stock-status');
      setProducts(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'low') return matchesSearch && p.countInStock > 0 && p.countInStock <= 10;
    if (filter === 'out') return matchesSearch && p.countInStock === 0;
    return matchesSearch;
  });

  const stats = {
    totalItems: products.length,
    lowStock: products.filter(p => p.countInStock > 0 && p.countInStock <= 10).length,
    outOfStock: products.filter(p => p.countInStock === 0).length,
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-5 pb-12">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <FiPackage className="text-[var(--color-primary)]" size={20} /> Stock Management
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monitor and audit inventory reserves across partners</p>
          </div>
          
          <div className="flex items-center">
             <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/30' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  All Items
                </button>
                <button 
                  onClick={() => setFilter('low')}
                  className={`px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${filter === 'low' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Low Stock
                </button>
                <button 
                  onClick={() => setFilter('out')}
                  className={`px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${filter === 'out' ? 'bg-rose-505 bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Out of Stock
                </button>
             </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Catalog Items */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-all duration-300">
            <div className="w-10 h-10 bg-teal-50 text-[var(--color-primary)] rounded-lg flex items-center justify-center shrink-0">
              <FiPackage size={20} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none">Cataloged Items</p>
              <h3 className="text-lg font-bold text-slate-800 mt-1">{stats.totalItems}</h3>
            </div>
          </div>

          {/* Low Stock Warning */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 border-l-4 border-l-amber-500 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-all duration-300">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
              <FiAlertCircle size={20} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600/70 leading-none">Low Stock Warnings</p>
              <h3 className="text-lg font-bold text-amber-600 mt-1">{stats.lowStock}</h3>
            </div>
          </div>

          {/* Out of Stock */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 border-l-4 border-l-rose-600 shadow-sm flex items-center gap-4 hover:border-slate-300 transition-all duration-300">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center shrink-0">
              <FiTrendingDown size={20} />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-rose-600/70 leading-none">Depleted Stock Out</p>
              <h3 className="text-lg font-bold text-rose-600 mt-1">{stats.outOfStock}</h3>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col min-h-[450px]">
          {/* Toolbar Search Bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input 
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[var(--color-primary)] transition-all placeholder-slate-450"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150">Product Details</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150">Seller / Partner</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150 text-center">Status</th>
                  <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150 text-right">Current Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="4" className="px-4 py-5">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                          <div className="space-y-2 flex-1">
                            <div className="h-3 bg-slate-100 rounded w-1/4" />
                            <div className="h-2.5 bg-slate-100 rounded w-1/6" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const isLow = product.countInStock > 0 && product.countInStock <= 10;
                    const isOut = product.countInStock === 0;

                    return (
                      <tr key={product._id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shrink-0 group-hover:scale-[1.03] transition-transform duration-300">
                              <img 
                                src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 text-xs truncate max-w-[280px]">{product.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {product.sku || 'NO-SKU'}
                                </span>
                                <span className="text-[9px] font-semibold text-slate-400 italic">
                                  {product.brand?.name || 'Local Brand'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                              <FiShoppingCart size={11} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{product.seller?.shopName || 'Admin'}</p>
                              <p className="text-[9px] text-slate-450 font-semibold">{product.sellerType || 'Seller'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[9px] font-bold uppercase tracking-wider border border-rose-100/50">
                              <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[9px] font-bold uppercase tracking-wider border border-amber-100/50">
                              <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                              Critical Low
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-wider border border-emerald-100/50">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                              Healthy
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className={`text-xs font-bold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-500' : 'text-slate-800'}`}>
                            {product.countInStock}
                            <span className="text-[9px] font-bold text-slate-400 ml-1 uppercase tracking-wider opacity-60">Units</span>
                          </div>
                          {isLow && <p className="text-[8px] font-bold text-amber-500/80 mt-0.5 uppercase tracking-tight">Needs Restock</p>}
                          {isOut && <p className="text-[8px] font-bold text-rose-500/80 mt-0.5 uppercase tracking-tight">Depleted</p>}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-300">
                        <FiPackage size={40} strokeWidth={1.5} />
                        <p className="font-semibold text-xs italic">No matching catalog items discovered.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Block */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
             <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
               Displaying {filteredProducts.length} of {products.length} registered assets
             </p>
             <button 
               onClick={fetchStockData}
               className="text-[9px] font-bold uppercase tracking-wider text-slate-700 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5"
             >
               Refresh Stocks <FiArrowUp size={12} />
             </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default StockManagement;
