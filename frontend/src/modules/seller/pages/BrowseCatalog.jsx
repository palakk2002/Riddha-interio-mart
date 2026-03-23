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
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">Admin Catalog</h1>
            <p className="text-warm-sand mt-2">Browse the pre-defined catalog and select items to sell.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-sand" />
            <input 
              type="text" 
              placeholder="Search catalog..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-soft-oatmeal focus:ring-2 focus:ring-warm-sand focus:outline-none transition-all"
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
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.name 
                ? 'bg-deep-espresso text-white shadow-lg' 
                : 'bg-white text-dusty-cocoa border border-soft-oatmeal hover:bg-soft-oatmeal/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="group bg-white rounded-2xl border border-soft-oatmeal overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-deep-espresso shadow-sm">
                  {product.code}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-warm-sand mb-1">{product.category}</span>
                <h3 className="text-lg font-bold text-deep-espresso group-hover:text-dusty-cocoa transition-colors line-clamp-1">{product.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-deep-espresso">Rs. {product.price}</span>
                  <button className="p-2.5 bg-warm-sand/10 text-warm-sand hover:bg-warm-sand hover:text-white rounded-xl transition-all duration-300">
                    <LuPlus size={20} />
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
