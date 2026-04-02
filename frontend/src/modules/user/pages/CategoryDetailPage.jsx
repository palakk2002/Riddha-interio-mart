import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { subcategories } from '../data/subcategories';
import CategoryQuickAccess from '../components/CategoryQuickAccess';
import BrandScroll from '../components/BrandScroll';

const CategoryDetailPage = () => {
  const { slug } = useParams();
  
  // Normalize slug to lowercase for lookup
  const currentSubcategories = subcategories[slug.toLowerCase()] || [];
  
  // Format title from slug
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');

  return (
    <div className="min-h-screen bg-white pb-20 pt-1 md:pt-10">
      {/* Header */}
      <div className="bg-soft-oatmeal/5 border-b border-soft-oatmeal/10 py-6 md:py-20 mb-4 md:mb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-deep-espresso tracking-tight mb-4"
          >
            {title}
          </motion.h1>
          <p className="text-deep-espresso/40 text-[10px] md:text-sm font-black tracking-[0.3em] uppercase">
            Explore our curated sub-collections
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {currentSubcategories.length > 0 ? (
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-x-3 md:gap-x-12 gap-y-6 md:gap-y-16">
            {currentSubcategories.map((sub, index) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={`/products?category=${slug}&subcategory=${sub.slug}`}
                  className="group flex flex-col items-center gap-1.5 md:gap-6"
                >
                  <div className="relative aspect-square w-full rounded-xl md:rounded-[2.5rem] overflow-hidden bg-soft-oatmeal/10 group-hover:shadow-lg transition-all duration-500 border border-soft-oatmeal/5">
                    <img 
                      src={sub.image} 
                      alt={sub.name} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-deep-espresso/0 group-hover:bg-deep-espresso/5 transition-colors duration-300" />
                  </div>
                  <span className="text-[9px] md:text-sm font-bold text-deep-espresso/90 group-hover:text-warm-sand text-center transition-colors leading-tight min-h-[2em] flex items-center justify-center">
                    {sub.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <h2 className="text-2xl font-bold text-deep-espresso/30 italic">No subcategories found for this collection.</h2>
            <Link to="/" className="mt-8 inline-block text-warm-sand font-black uppercase tracking-widest text-xs border-b-2 border-warm-sand pb-1">
              Back to Home
            </Link>
          </div>
        )}
      </div>

      {/* Explore More Categories Section */}
      <section className="mt-20 pt-16 border-t border-soft-oatmeal/10">
        <div className="max-w-7xl mx-auto px-4 md:px-12 mb-6">
          <h2 className="text-2xl md:text-4xl font-black text-deep-espresso tracking-tight">Explore More Collections</h2>
          <p className="text-deep-espresso/40 text-[10px] md:text-sm font-black tracking-[0.2em] uppercase mt-2">
            Discover other premium interior categories
          </p>
        </div>
        <CategoryQuickAccess isScrollable={true} />
      </section>

      {/* Brands in Focus Section */}
      <div className="mt-8">
        <BrandScroll title="Brands In Focus" />
      </div>
    </div>
  );
};

export default CategoryDetailPage;
