import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { sellerCatalog } from '../data/sellerCatalog';
import { LuPlus, LuSearch, LuFilter } from 'react-icons/lu';

const BrowseCatalog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = sellerCatalog.products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-deep-espresso">Admin Catalog</h1>
            <p className="text-warm-sand text-xs md:text-sm">Browse and select items to sell.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" />
            <input 
              type="text" 
              placeholder="Search catalog..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-soft-oatmeal focus:ring-2 focus:ring-warm-sand/20 focus:outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              activeCategory === 'All' 
              ? 'bg-deep-espresso text-white shadow-lg' 
              : 'bg-white text-dusty-cocoa border border-soft-oatmeal hover:bg-soft-oatmeal/20'
            }`}
          >
            All Items
          </button>
          {sellerCatalog.categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                activeCategory === cat.name 
                ? 'bg-deep-espresso text-white border-deep-espresso shadow-md' 
                : 'bg-white text-warm-sand border-soft-oatmeal hover:bg-soft-oatmeal/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid - Ultra Compact */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="group bg-white rounded-2xl border border-soft-oatmeal overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              <div className="relative h-24 sm:h-32 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-black text-deep-espresso shadow-sm">
                  {product.code}
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-warm-sand mb-0.5">{product.category}</span>
                <h3 className="text-xs font-bold text-deep-espresso group-hover:text-dusty-cocoa transition-colors line-clamp-1 leading-tight">{product.name}</h3>
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className="text-sm font-black text-deep-espresso">Rs. {product.price}</span>
                  <button className="p-1.5 bg-warm-sand/5 text-warm-sand hover:bg-deep-espresso hover:text-white rounded-lg transition-all duration-300">
                    <LuPlus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-xl font-bold text-deep-espresso">No items found</h3>
            <p className="text-warm-sand mt-2">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default BrowseCatalog;
