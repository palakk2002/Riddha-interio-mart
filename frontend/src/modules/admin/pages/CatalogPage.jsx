import React, { useState, useMemo } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuSearch, LuPlus, LuTrash2, LuPen, LuFilter, LuCheck, LuX } from 'react-icons/lu';
import { adminProducts } from '../data/adminProducts';
import { adminCategories } from '../data/adminCategories';

const CatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(adminProducts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    category: 'Tiles',
    price: '',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80'
  });

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      ...newProduct,
      id: products.length + 1,
      price: parseFloat(newProduct.price) || 0
    };
    setProducts([productToAdd, ...products]);
    setShowAddForm(false);
    setNewProduct({
      name: '',
      code: '',
      category: 'Tiles',
      price: '',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80'
    });
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-deep-espresso">Product Catalog</h1>
            <p className="text-warm-sand mt-1">Manage your inventory and product codes.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 bg-dusty-cocoa text-white px-6 py-3 rounded-xl font-bold hover:bg-deep-espresso transition-all shadow-md shadow-dusty-cocoa/20 active:scale-95"
          >
            {showAddForm ? <LuX size={18} /> : <LuPlus size={18} />}
            {showAddForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>

        {/* Add Product Form (Conditional) */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-xl border border-soft-oatmeal shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-xl font-display font-bold text-deep-espresso mb-6">New Product Details</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-warm-sand uppercase">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                  placeholder="e.g. Italian Marble"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-warm-sand uppercase">Product Code (SKU)</label>
                <input 
                  required
                  type="text" 
                  value={newProduct.code}
                  onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                  className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                  placeholder="e.g. TLE-101"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-warm-sand uppercase">Category</label>
                <select 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                >
                  {adminCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-warm-sand uppercase">Price ($)</label>
                <div className="flex gap-3">
                  <input 
                    required
                    type="number" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="flex-grow bg-soft-oatmeal/20 border border-soft-oatmeal rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
                    placeholder="0.00"
                  />
                  <button type="submit" className="bg-warm-sand text-deep-espresso p-2 rounded-lg hover:bg-dusty-cocoa hover:text-white transition-all shadow-sm">
                    <LuCheck size={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-soft-oatmeal shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or product code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-soft-oatmeal/20 border border-soft-oatmeal rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-warm-sand transition-all text-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 border border-soft-oatmeal text-deep-espresso px-6 rounded-xl font-medium hover:bg-soft-oatmeal/20 transition-all">
            <LuFilter size={18} />
            Filters
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-soft-oatmeal shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FDFBF9] border-b border-soft-oatmeal">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-warm-sand uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-xs font-bold text-warm-sand uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-warm-sand uppercase tracking-wider font-display">Product Code</th>
                  <th className="px-6 py-4 text-xs font-bold text-warm-sand uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-warm-sand uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-warm-sand uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-soft-oatmeal/10 transition-colors group">
                      <td className="px-6 py-4">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:scale-110 transition-transform duration-300" 
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-deep-espresso leading-none">{product.name}</p>
                        <p className="text-xs text-warm-sand mt-1">In Stock</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-golden-glow/30 text-deep-espresso px-2 py-1 rounded text-[10px] font-bold border border-warm-sand/20">
                          {product.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-soft-oatmeal/50 text-dusty-cocoa">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-deep-espresso">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-warm-sand hover:text-dusty-cocoa hover:bg-soft-oatmeal rounded-lg transition-all" title="Edit">
                            <LuPen size={18} />
                          </button>
                          <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                            <LuTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-warm-sand animate-pulse">
                      <div className="flex flex-col items-center gap-2">
                        <LuBox size={48} className="opacity-20" />
                        <p className="font-medium">No products found for "{searchTerm}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer/Pagination Placeholder */}
          <div className="p-4 bg-[#FDFBF9] border-t border-soft-oatmeal flex items-center justify-between text-xs text-warm-sand">
            <p>Showing {filteredProducts.length} of {products.length} products</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-soft-oatmeal rounded hover:bg-white disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 bg-dusty-cocoa text-white rounded">1</button>
              <button className="px-3 py-1 border border-soft-oatmeal rounded hover:bg-white disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CatalogPage;
