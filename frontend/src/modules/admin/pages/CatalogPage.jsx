import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { LuSearch, LuPlus, LuTrash2, LuPen, LuFilter, LuBox, LuCheck } from 'react-icons/lu';
import { FiTrash2, FiEdit3 } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const CatalogPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [catalogRes, inventoryRes] = await Promise.all([
        api.get('/catalog'),
        api.get('/products')
      ]);
      setProducts(catalogRes.data.data || []);
      setInventory(inventoryRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch catalog/inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const isProductInInventory = (sku) => {
    return inventory.some(p => p.sku === sku);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       p.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, products]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/catalog/${id}`);
      setProducts(products.filter(p => p._id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete catalog product:', err);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">Product Catalog</h1>
            <p className="text-warm-sand text-sm md:text-base">Manage your inventory and product codes.</p>
          </div>
          <button 
            onClick={() => navigate('/admin/catalog/add')}
            className="flex items-center justify-center gap-2 bg-red-800 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-deep-espresso transition-all shadow-md shadow-red-900/20 active:scale-95 text-sm"
          >
            <LuPlus size={18} />
            Add New Product
          </button>
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
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-soft-oatmeal shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-soft-oatmeal/20 border-b border-soft-oatmeal">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Image</th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Product Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Code</th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Price</th>
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
                        <p className="text-[10px] text-warm-sand uppercase tracking-wider mt-0.5">In Stock</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-deep-espresso/60 bg-soft-oatmeal/30 px-2 py-1 rounded border border-soft-oatmeal">
                          {product.sku}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest bg-red-800/5 px-2.5 py-1 rounded-full border border-red-800/10">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-deep-espresso">
                        ₹{Number(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isProductInInventory(product.sku) ? (
                            <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-tighter shadow-sm">
                              <LuCheck size={14} />
                              In Shop
                            </div>
                          ) : (
                            <button 
                              onClick={() => navigate(`/admin/inventory/add?catalogId=${product._id}`)}
                              className="p-2 text-warm-sand hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Select for Inventory"
                            >
                              <LuPlus size={18} />
                            </button>
                          )}
                          <button onClick={() => navigate(`/admin/catalog/edit/${product._id}`)} className="p-2 text-warm-sand hover:text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-all" title="Edit Catalog Item"><FiEdit3 size={18} /></button>
                          <button onClick={() => setDeleteId(product._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Remove from Catalog"><FiTrash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="bg-white p-4 rounded-2xl border border-soft-oatmeal shadow-sm flex gap-4 items-center">
                  <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-deep-espresso truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-deep-espresso/40 bg-soft-oatmeal/30 px-1.5 py-0.5 rounded">{product.sku}</span>
                      <span className="text-[9px] font-bold text-dusty-cocoa uppercase tracking-tighter">{product.category}</span>
                    </div>
                    <p className="font-black text-deep-espresso mt-1">₹{Number(product.price).toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {isProductInInventory(product.sku) ? (
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center justify-center">
                        <LuCheck size={16} />
                      </div>
                    ) : (
                      <button 
                        onClick={() => navigate(`/admin/inventory/add?catalogId=${product._id}`)}
                        className="p-2.5 bg-warm-sand/5 text-warm-sand rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                      >
                        <LuPlus size={16} />
                      </button>
                    )}
                    <button onClick={() => navigate(`/admin/catalog/edit/${product._id}`)} className="p-2.5 bg-soft-oatmeal/20 text-warm-sand rounded-xl"><FiEdit3 size={16} /></button>
                    <button onClick={() => setDeleteId(product._id)} className="p-2.5 bg-red-50 text-red-400 rounded-xl"><FiTrash2 size={16} /></button>
                  </div>
                </div>
              ))
            ) : null}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-12 h-12 border-4 border-soft-oatmeal border-t-red-800 rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Syncing Portfolio...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="bg-white rounded-2xl border border-soft-oatmeal p-12 text-center text-warm-sand shadow-sm">
              <LuBox size={48} className="mx-auto opacity-20 mb-4" />
              <p className="font-medium italic">No products matched your search.</p>
            </div>
          )}
          
          {/* Footer/Pagination */}
          <div className="p-4 bg-white rounded-2xl border border-soft-oatmeal flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest shadow-sm">
            <p>Showing {filteredProducts.length} of {products.length} Items</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-soft-oatmeal rounded-xl hover:bg-soft-oatmeal/10 disabled:opacity-30" disabled>Prev</button>
              <button className="px-4 py-2 bg-deep-espresso text-white rounded-xl shadow-lg shadow-deep-espresso/10">1</button>
              <button className="px-4 py-2 border border-soft-oatmeal rounded-xl hover:bg-soft-oatmeal/10 disabled:opacity-30" disabled>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-deep-espresso/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-soft-oatmeal animate-in zoom-in-95 duration-200">
             <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
                <FiTrash2 size={32} />
             </div>
             <h3 className="text-xl font-display font-bold text-center text-deep-espresso mb-2">Remove Item?</h3>
             <p className="text-center text-warm-sand text-sm mb-8">This will permanently delete the product from the catalog. This action cannot be undone.</p>
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="py-4 bg-soft-oatmeal/20 rounded-2xl font-bold text-xs uppercase tracking-widest text-dusty-cocoa hover:bg-soft-oatmeal/40 transition-all"
                >
                   Cancel
                </button>
                <button 
                  onClick={() => handleDelete(deleteId)}
                  className="py-4 bg-red-800 rounded-2xl font-bold text-xs uppercase tracking-widest text-white hover:bg-deep-espresso transition-all shadow-lg shadow-red-900/20"
                >
                   Delete
                </button>
             </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default CatalogPage;
