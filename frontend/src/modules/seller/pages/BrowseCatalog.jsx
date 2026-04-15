import React, { useState, useMemo } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuPlus, LuSearch, LuFilter, LuBox } from 'react-icons/lu';
import { adminProducts } from '../../admin/data/adminProducts';

const BrowseCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return adminProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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
                    <tr key={product.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                      <td className="px-6 py-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-deep-espresso">{product.name}</p>
                        <p className="text-[10px] text-warm-sand uppercase tracking-wider mt-0.5">In Stock</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-deep-espresso/60 bg-soft-oatmeal/30 px-2 py-1 rounded border border-soft-oatmeal">
                          {product.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest bg-red-800/5 px-2.5 py-1 rounded-full border border-red-800/10">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-deep-espresso">
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2.5 bg-warm-sand/5 text-warm-sand hover:bg-deep-espresso hover:text-white rounded-lg transition-all duration-300">
                          <LuPlus size={18} />
                        </button>
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
              <div key={product.id} className="bg-white p-4 rounded-2xl border border-soft-oatmeal shadow-sm flex gap-4 items-center">
                <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-deep-espresso truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-deep-espresso/40 bg-soft-oatmeal/30 px-1.5 py-0.5 rounded">{product.code}</span>
                    <span className="text-[9px] font-bold text-dusty-cocoa uppercase tracking-tighter">{product.category}</span>
                  </div>
                  <p className="font-black text-deep-espresso mt-1">₹{product.price.toFixed(2)}</p>
                </div>
                <button className="p-2.5 bg-soft-oatmeal/20 text-warm-sand rounded-xl hover:bg-deep-espresso hover:text-white transition-all">
                  <LuPlus size={18} />
                </button>
              </div>
            ))}
          </div>

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
