import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuFilter, LuCheck, LuClock, LuPen, LuTrash2, LuLayoutGrid, LuMenu, LuX } from 'react-icons/lu';
import api from '../../../shared/utils/api';

const MyProducts = () => {
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', category: '', price: '' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/my-products');
      setProducts(res.data.data);
    } catch (err) {
      console.error('Failed to fetch seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    if (filter === 'All') return true;
    const status = p.status || (p.isActive ? 'approved' : 'pending');
    return status.toLowerCase() === filter.toLowerCase();
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEditOpen = (product) => {
    setEditingProduct(product);
    setEditFormData({ 
      name: product.name, 
      category: product.category, 
      price: product.sellerPrice || product.price 
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${editingProduct._id || editingProduct.id}`, editFormData);
      fetchProducts();
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const StatusBadge = ({ status }) => {
    const isApproved = status === 'approved';
    const isRejected = status === 'rejected';
    
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit ${
        isApproved 
        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
        : isRejected
          ? 'bg-red-50 text-red-600 border border-red-100'
          : 'bg-amber-50 text-amber-600 border border-amber-100'
      }`}>
        {isApproved ? <LuCheck size={12} /> : isRejected ? <LuX size={12} /> : <LuClock size={12} />}
        {status}
      </span>
    );
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-deep-espresso">My Inventory</h1>
            <p className="text-warm-sand text-xs md:text-sm">Manage your listed products and tracking.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-soft-oatmeal/20 p-1 rounded-xl border border-soft-oatmeal">
              <button 
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white text-deep-espresso shadow-sm' : 'text-warm-sand'}`}
              >
                <LuLayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white text-deep-espresso shadow-sm' : 'text-warm-sand'}`}
              >
                <LuMenu size={18} />
              </button>
            </div>
            
            <div className="relative">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl bg-white border border-soft-oatmeal focus:ring-2 focus:ring-warm-sand/20 focus:outline-none transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <LuFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <div className={`space-y-4 ${view === 'grid' ? 'mobile-full-bleed' : ''}`}>
          {view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
              {filteredProducts.map(product => (
                <div key={product._id || product.id} className="app-card overflow-hidden group">
                  <div className="relative h-24 sm:h-32 overflow-hidden">
                    <img 
                      src={(product.image || (product.images && product.images[0]))?.startsWith('C:') 
                        ? 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80' 
                        : (product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80')} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <StatusBadge status={product.status || (product.isActive ? 'approved' : 'pending')} />
                    </div>
                  </div>
                  <div className="p-2.5 space-y-2">
                    <div className="min-h-[40px]">
                      <span className="text-[7px] font-black text-warm-sand uppercase tracking-widest">{product.category}</span>
                      <h3 className="text-[11px] font-bold text-deep-espresso line-clamp-2 leading-tight">{product.name}</h3>
                    </div>
                    <div className="flex items-center justify-between border-t border-soft-oatmeal/50 pt-2 gap-2">
                      <span className="text-sm font-black text-deep-espresso">Rs. {product.sellerPrice || product.price}</span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEditOpen(product)}
                          className="p-1.5 text-warm-sand hover:text-deep-espresso hover:bg-soft-oatmeal rounded-md transition-all"
                        >
                          <LuPen size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id || product.id)}
                          className="p-1.5 text-warm-sand hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="bg-white rounded-2xl border border-soft-oatmeal overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-soft-oatmeal/10 border-b border-soft-oatmeal">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-warm-sand">Product Info</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-warm-sand">Category</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-warm-sand">Price</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-warm-sand">Status</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-warm-sand text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-oatmeal/50">
                  {filteredProducts.map(product => (
                    <tr key={product._id || product.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={(product.image || (product.images && product.images[0]))?.startsWith('C:') 
                              ? 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80' 
                              : (product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80')} 
                            alt="" className="w-10 h-10 rounded-lg object-cover" 
                          />
                          <span className="text-sm font-bold text-deep-espresso">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold text-dusty-cocoa uppercase tracking-widest">{product.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-black text-deep-espresso">Rs. {product.sellerPrice || product.price}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={product.status || (product.isActive ? 'approved' : 'pending')} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditOpen(product)}
                            className="p-2 hover:bg-soft-oatmeal rounded-lg transition-colors text-warm-sand hover:text-deep-espresso"
                          >
                            <LuPen size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product._id || product.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-warm-sand hover:text-red-600"
                          >
                            <LuTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-soft-oatmeal">
            <h3 className="text-xl font-bold text-deep-espresso">No products in this view</h3>
            <p className="text-warm-sand mt-2">Adjust filters or add your first product to get started.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep-espresso/20 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-soft-oatmeal">
              <h3 className="text-xl font-display font-bold text-deep-espresso mb-6">Edit Product</h3>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Product Name</label>
                    {editingProduct?.source === 'catalog' && (
                      <span className="text-[8px] font-black bg-warm-sand/10 text-warm-sand px-2 py-0.5 rounded-full uppercase tracking-tighter">Catalog Item</span>
                    )}
                  </div>
                  <input 
                    type="text" required 
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    readOnly={editingProduct?.source === 'catalog'}
                    className={`w-full border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all ${editingProduct?.source === 'catalog' ? 'bg-soft-oatmeal/20 cursor-not-allowed opacity-70' : 'bg-soft-oatmeal/10'}`}
                  />
                  {editingProduct?.source === 'catalog' && (
                    <p className="text-[9px] font-medium text-warm-sand italic mt-1">* Name and details of catalog items cannot be modified.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Price (Rs.)</label>
                  <input 
                    type="number" required 
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                    className="w-full bg-soft-oatmeal/10 border border-soft-oatmeal rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-deep-espresso bg-soft-oatmeal/30 hover:bg-soft-oatmeal/50 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-red-800 hover:bg-deep-espresso transition-all shadow-md text-sm"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default MyProducts;
