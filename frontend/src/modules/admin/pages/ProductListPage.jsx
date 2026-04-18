import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { LuSearch, LuPlus, LuTrash2, LuPen, LuFilter, LuBox, LuPackage } from 'react-icons/lu';
import api from '../../../shared/utils/api';

const ProductListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // We want all products for admin catalog view, including pending and inactive
      const { data } = await api.get('/products', { params: { isActive: 'all', isApproved: 'all' } });
      setProducts(data.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Could not connect to the inventory database.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, status) => {
    try {
      await api.put(`/products/${id}/approval`, { approvalStatus: status });
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error('Approval error:', err);
      alert('Failed to update product status.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, products]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product.');
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-deep-espresso">Product List</h1>
            <p className="text-warm-sand text-sm md:text-base">Comprehensive view of all your inventory.</p>
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

        {/* Product List Table */}
        <div className="bg-white rounded-2xl border border-soft-oatmeal shadow-md overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-12 h-12 border-4 border-soft-oatmeal border-t-red-800 rounded-full animate-spin" />
              <p className="text-xs font-black uppercase tracking-widest text-warm-sand">Fetching Inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center px-6">
               <div className="w-20 h-20 bg-soft-oatmeal/20 rounded-[40px] flex items-center justify-center text-warm-sand/30 mb-2">
                 <LuPackage size={40} />
               </div>
               <h3 className="text-xl font-display font-bold text-deep-espresso">No Products Found</h3>
               <p className="text-sm text-warm-sand max-w-xs">{searchTerm ? "No products match your current search criteria." : "Start by adding your first product to the catalog."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-soft-oatmeal/20 border-b border-soft-oatmeal">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Image</th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Product Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">SKU</th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest">Price</th>
                    <th className="px-6 py-4 text-[10px] font-black text-warm-sand uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-oatmeal/50">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                      <td className="px-6 py-4">
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                          alt={product.name} 
                          className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" 
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-deep-espresso">{product.name}</p>
                        <p className="text-[10px] text-warm-sand uppercase tracking-wider mt-0.5">{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-deep-espresso/60 bg-soft-oatmeal/30 px-2 py-1 rounded border border-soft-oatmeal">
                          {product.sku || 'NO-SKU'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest bg-red-800/5 px-2.5 py-1 rounded-full border border-red-800/10">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-deep-espresso">
                        ₹{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          product.approvalStatus === 'approved' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : product.approvalStatus === 'rejected'
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {product.approvalStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-deep-espresso">
                        ₹{product.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {product.approvalStatus === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApprove(product._id, 'approved')}
                                className="px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleApprove(product._id, 'rejected')}
                                className="px-3 py-1.5 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-red-200 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => navigate(`/admin/catalog/edit/${product._id}`)}
                            className="p-2 text-deep-espresso hover:bg-soft-oatmeal rounded-lg transition-colors"
                          >
                            <LuPen size={16} />
                          </button>
                          <button 
                            onClick={() => setDeleteId(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep-espresso/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-soft-oatmeal">
            <h3 className="text-xl font-display font-bold text-deep-espresso mb-2">Delete Product?</h3>
            <p className="text-warm-sand mb-6">Are you sure you want to remove this product from your list? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-deep-espresso bg-soft-oatmeal/30 hover:bg-soft-oatmeal/50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-red-800 hover:bg-deep-espresso transition-all shadow-md shadow-red-900/20"
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

export default ProductListPage;
