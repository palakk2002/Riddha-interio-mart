import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { sellerProducts } from '../data/sellerProducts';
import { LuFilter, LuCheck, LuClock, LuSettings, LuLayoutGrid, LuMenu } from 'react-icons/lu';

const MyProducts = () => {
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  const filteredProducts = sellerProducts.filter(p => filter === 'All' || p.status === filter.toLowerCase());

  const StatusBadge = ({ status }) => {
    const isApproved = status === 'approved';
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit ${
        isApproved 
        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
        : 'bg-amber-50 text-amber-600 border border-amber-100'
      }`}>
        {isApproved ? <LuCheck size={12} /> : <LuClock size={12} />}
        {status}
      </span>
    );
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">My Inventory</h1>
            <p className="text-warm-sand mt-2">Manage your listed products and track approval status.</p>
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
                className="pl-10 pr-6 py-3 rounded-xl bg-white border border-soft-oatmeal focus:ring-2 focus:ring-warm-sand focus:outline-none transition-all font-bold text-xs uppercase tracking-wider appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
              <LuFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-soft-oatmeal overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="relative h-44 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={product.status} />
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-warm-sand uppercase tracking-widest">{product.category}</span>
                    <h3 className="font-bold text-deep-espresso truncate">{product.name}</h3>
                  </div>
                  <div className="flex items-center justify-between border-t border-soft-oatmeal/50 pt-4">
                    <span className="font-black text-deep-espresso">Rs. {product.price}</span>
                    <button className="text-warm-sand hover:text-deep-espresso transition-colors">
                      <LuSettings size={20} />
                    </button>
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
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-warm-sand">Product Info</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-warm-sand">Category</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-warm-sand">Price</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-warm-sand">Status</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-warm-sand">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-oatmeal/50">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <span className="font-bold text-deep-espresso">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-medium text-dusty-cocoa">{product.category}</span>
                      </td>
                      <td className="p-6">
                        <span className="font-black text-deep-espresso">Rs. {product.price}</span>
                      </td>
                      <td className="p-6">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="p-6">
                        <button className="p-2 hover:bg-soft-oatmeal rounded-lg transition-colors text-warm-sand">
                          <LuSettings size={18} />
                        </button>
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
    </PageWrapper>
  );
};

export default MyProducts;
