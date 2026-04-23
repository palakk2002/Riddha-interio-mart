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
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">Stock Management</h1>
            <p className="text-warm-sand mt-1 font-medium">Monitor and manage inventory levels across all sellers.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white p-1 rounded-2xl border border-soft-oatmeal shadow-sm flex">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-deep-espresso text-white shadow-lg' : 'text-warm-sand hover:bg-soft-oatmeal/30'}`}
                >
                  All Items
                </button>
                <button 
                  onClick={() => setFilter('low')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'low' ? 'bg-amber-500 text-white shadow-lg' : 'text-warm-sand hover:bg-soft-oatmeal/30'}`}
                >
                  Low Stock
                </button>
                <button 
                  onClick={() => setFilter('out')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'out' ? 'bg-red-600 text-white shadow-lg' : 'text-warm-sand hover:bg-soft-oatmeal/30'}`}
                >
                  Out of Stock
                </button>
             </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[32px] border border-soft-oatmeal shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-soft-oatmeal/20 transition-all duration-500">
            <div className="w-16 h-16 bg-soft-oatmeal/20 rounded-2xl flex items-center justify-center text-deep-espresso group-hover:bg-deep-espresso group-hover:text-white transition-all duration-500">
              <FiPackage size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand mb-1">Total Catalog Items</p>
              <h3 className="text-3xl font-display font-bold text-deep-espresso">{stats.totalItems}</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-soft-oatmeal shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 border-l-4 border-l-amber-500">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
              <FiAlertCircle size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600/60 mb-1">Low Stock Warning</p>
              <h3 className="text-3xl font-display font-bold text-amber-600">{stats.lowStock}</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-soft-oatmeal shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500 border-l-4 border-l-red-600">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
              <FiTrendingDown size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/60 mb-1">Out of Stock</p>
              <h3 className="text-3xl font-display font-bold text-red-600">{stats.outOfStock}</h3>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[40px] border border-soft-oatmeal shadow-xl overflow-hidden min-h-[500px] flex flex-col">
          {/* Toolbar */}
          <div className="p-6 md:p-8 border-b border-soft-oatmeal flex flex-col md:flex-row gap-6 bg-soft-oatmeal/5">
            <div className="relative flex-1">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-warm-sand" size={20} />
              <input 
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-soft-oatmeal rounded-2xl pl-14 pr-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-warm-sand/10 transition-all font-medium"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-soft-oatmeal/20">
                  <th className="px-8 py-5 text-[10px] font-black text-warm-sand uppercase tracking-widest border-b border-soft-oatmeal">Product Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-warm-sand uppercase tracking-widest border-b border-soft-oatmeal">Seller / Partner</th>
                  <th className="px-8 py-5 text-[10px] font-black text-warm-sand uppercase tracking-widest border-b border-soft-oatmeal text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-warm-sand uppercase tracking-widest border-b border-soft-oatmeal text-right">Current Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal/30">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="4" className="px-8 py-10">
                        <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-soft-oatmeal/40 rounded-xl" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-soft-oatmeal/40 rounded w-1/4" />
                            <div className="h-3 bg-soft-oatmeal/40 rounded w-1/6" />
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
                      <tr key={product._id} className="hover:bg-soft-oatmeal/10 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-soft-oatmeal/30 border border-soft-oatmeal/20 group-hover:scale-105 transition-transform duration-500">
                              <img 
                                src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-display font-bold text-deep-espresso text-base mb-1">{product.name}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-warm-sand bg-soft-oatmeal/40 px-2 py-0.5 rounded uppercase tracking-tighter">
                                  {product.sku || 'NO-SKU'}
                                </span>
                                <span className="text-[10px] font-bold text-dusty-cocoa italic">
                                  {product.brand?.name || 'Local Brand'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-soft-oatmeal/20 flex items-center justify-center text-deep-espresso">
                              <FiShoppingCart size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-deep-espresso">{product.seller?.shopName || 'Admin'}</p>
                              <p className="text-[10px] text-warm-sand font-medium">{product.sellerType || 'Seller'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                              Critical Low
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Healthy
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className={`text-2xl font-display font-black ${isOut ? 'text-red-600' : isLow ? 'text-amber-500' : 'text-deep-espresso'}`}>
                            {product.countInStock}
                            <span className="text-[10px] font-black text-warm-sand ml-2 uppercase tracking-widest opacity-40 italic">Units</span>
                          </div>
                          {isLow && <p className="text-[10px] font-bold text-amber-600/70 mt-1 uppercase tracking-tighter">Needs Restock Soon</p>}
                          {isOut && <p className="text-[10px] font-bold text-red-600/70 mt-1 uppercase tracking-tighter">Inventory Depleted</p>}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-4 text-warm-sand opacity-40">
                        <FiPackage size={64} strokeWidth={1} />
                        <p className="font-display font-medium text-lg italic">No products found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="p-6 bg-soft-oatmeal/5 border-t border-soft-oatmeal flex flex-col sm:flex-row items-center justify-between gap-4">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand">
               Showing {filteredProducts.length} of {products.length} cataloged products
             </p>
             <button 
               onClick={fetchStockData}
               className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-espresso hover:text-warm-sand transition-colors flex items-center gap-2"
             >
               Refresh Live Inventory <FiArrowUp size={14} />
             </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default StockManagement;
