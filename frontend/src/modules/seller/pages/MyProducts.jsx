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
              </select>
              <LuFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-soft-oatmeal overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="relative h-24 sm:h-32 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2">
                    <StatusBadge status={product.status} />
                  </div>
                </div>
                <div className="p-3 space-y-3">
                  <div>
                    <span className="text-[8px] font-black text-warm-sand uppercase tracking-widest">{product.category}</span>
                    <h3 className="text-xs font-bold text-deep-espresso truncate leading-tight">{product.name}</h3>
                  </div>
                  <div className="flex items-center justify-between border-t border-soft-oatmeal/50 pt-2">
                    <span className="text-sm font-black text-deep-espresso">Rs. {product.price}</span>
                    <button className="text-warm-sand hover:text-deep-espresso transition-colors">
                      <LuSettings size={16} />
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
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-warm-sand">Product Info</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-warm-sand">Category</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-warm-sand">Price</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-warm-sand">Status</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-warm-sand text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-oatmeal/50">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <span className="text-sm font-bold text-deep-espresso">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold text-dusty-cocoa uppercase tracking-widest">{product.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-black text-deep-espresso">Rs. {product.price}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-2 hover:bg-soft-oatmeal rounded-lg transition-colors text-warm-sand">
                          <LuSettings size={16} />
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
