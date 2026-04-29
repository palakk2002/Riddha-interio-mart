import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { LuPlus, LuSearch, LuFilter, LuBox, LuCheck, LuClock } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../shared/utils/api';

const BrowseCatalog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchCatalog();
    fetchMyInventory();
  }, []);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      // Fetch all items from the master catalog
      const { data } = await api.get('/catalog');
      setCatalogProducts(data.data || []);
    } catch (err) {
      console.error('Failed to fetch catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyInventory = async () => {
    try {
      const { data } = await api.get('/products/my-products');
      setInventory(data.data || []);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  const filteredProducts = useMemo(() => {
    return catalogProducts.filter(p =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, catalogProducts]);

  const handleAddToShop = async (product) => {
    try {
      // Create a clean copy without internal DB metadata
      const { _id, createdAt, updatedAt, __v, ...productData } = product;
      
      const res = await api.post('/products', {
        ...productData,
        countInStock: product.stock || 0,
        source: 'catalog',
        isApproved: true,
        approvalStatus: 'approved'
      });

      if (res.data.success) {
        setInventory([...inventory, res.data.data]);
        setToastMessage(`${product.name} added to your shop!`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error('Add to shop error:', err);
      alert('Failed to add product to your shop.');
    }
  };

  const isProductInInventory = (productId) => {
    return inventory.some(p => p.sku === catalogProducts.find(cp => cp._id === productId)?.sku);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">Browse Catalog</h1>
            <p className="text-warm-sand text-sm md:text-base">Select items from the admin catalog to add to your shop.</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-3 md:p-4 rounded-2xl border border-soft-oatmeal shadow-sm flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="relative flex-grow">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" size={18} />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand/20 transition-all text-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 border border-soft-oatmeal text-deep-espresso px-6 py-3 md:py-0 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-soft-oatmeal/20 transition-all">
            <LuFilter size={16} />
            Filters
          </button>
        </div>

        {/* Catalog List / Table */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 text-warm-sand">
              <LuClock size={48} className="animate-spin opacity-20" />
              <p className="font-bold text-[10px] uppercase tracking-widest">Fetching Catalog Data...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-2xl border border-soft-oatmeal shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-soft-oatmeal/20 border-b border-soft-oatmeal">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Image</th>
                        <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Product Name</th>
                        <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">SKU</th>
                        <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Category</th>

                        <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-soft-oatmeal/50">
                      {filteredProducts.map((product) => (
                        <tr key={product._id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                          <td className="px-6 py-4">
                            <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-deep-espresso">{product.name}</p>
                            <p className="text-[10px] text-warm-sand uppercase tracking-wider mt-0.5">In Catalog</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-black text-deep-espresso/60 bg-soft-oatmeal/30 px-2 py-1 rounded border border-soft-oatmeal">
                              {product.sku || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest bg-red-800/5 px-2.5 py-1 rounded-full border border-red-800/10">
                              {product.category}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            {isProductInInventory(product._id) ? (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 font-bold text-xs">
                                <LuCheck size={14} />
                                Added
                              </div>
                            ) : (
                              <button
                                onClick={() => navigate(`/seller/product/add?catalogId=${product._id}`)}
                                className="p-2.5 bg-warm-sand/5 text-warm-sand hover:bg-deep-espresso hover:text-white rounded-lg transition-all duration-300"
                                title="Add to Shop"
                              >
                                <LuPlus size={18} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="bg-white p-4 rounded-2xl border border-soft-oatmeal shadow-sm flex gap-4 items-center">
                    <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-deep-espresso truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black text-deep-espresso/40 bg-soft-oatmeal/30 px-1.5 py-0.5 rounded">{product.sku}</span>
                        <span className="text-[9px] font-bold text-dusty-cocoa uppercase tracking-tighter">{product.category}</span>
                      </div>

                    </div>
                    {isProductInInventory(product._id) ? (
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                        <LuCheck size={18} />
                      </div>
                    ) : (
                      <button
                        onClick={() => navigate(`/seller/product/add?catalogId=${product._id}`)}
                        className="p-2.5 bg-soft-oatmeal/20 text-warm-sand rounded-xl hover:bg-deep-espresso hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <LuPlus size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-2xl border border-soft-oatmeal p-12 text-center text-warm-sand shadow-sm">
              <LuBox size={48} className="mx-auto opacity-20 mb-4" />
              <p className="font-medium italic">No products matched your search.</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default BrowseCatalog;
