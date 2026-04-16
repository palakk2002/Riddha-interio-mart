import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiGrid, FiList } from 'react-icons/fi';
import api from '../../../shared/utils/api';
import CategoryQuickAccess from '../components/CategoryQuickAccess';
import BrandScroll from '../components/BrandScroll';

const CategoryDetailPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current category by slug
        const catRes = await api.get(`/categories/slug/${slug}`);
        setCategory(catRes.data.data);

        // Fetch all categories for sidebar
        const allRes = await api.get('/categories');
        setAllCategories(allRes.data.data);
      } catch (err) {
        console.error('Failed to fetch category data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-display font-black text-warm-sand uppercase tracking-widest animate-pulse">Refining Collections...</div>;
  }

  if (!category) {
    return (
      <div className="min-h-screen text-center py-40">
        <h2 className="text-2xl font-bold text-deep-espresso/30 italic">Collection not found.</h2>
        <Link to="/" className="mt-8 inline-block text-warm-sand font-black uppercase tracking-widest text-xs border-b-2 border-warm-sand pb-1">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header */}
      <div className="relative h-[250px] md:h-[400px] bg-deep-espresso overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name} 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-espresso via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-4"
           >
             {category.name}
           </motion.h1>
           <p className="text-white/70 text-[10px] md:text-sm font-black tracking-[0.4em] uppercase">
             Luxury within reach
           </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar - Subcategories & Navigation */}
          <aside className="lg:w-80 shrink-0">
             <div className="sticky top-28 space-y-10">
                {/* Current Category Sub-menu */}
                <div className="space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-sand flex items-center gap-3">
                     <span className="w-8 h-px bg-warm-sand/30" />
                     Sub Collections
                   </h3>
                   <div className="flex flex-col gap-1">
                      {category.subcategories?.map(sub => (
                        <Link
                          key={sub._id}
                          to={`/category/${slug}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex items-center justify-between group py-3 px-4 rounded-xl hover:bg-soft-oatmeal/10 transition-all border border-transparent hover:border-soft-oatmeal/20"
                        >
                           <span className="text-sm font-bold text-deep-espresso/70 group-hover:text-deep-espresso transition-colors">{sub.name}</span>
                           <FiChevronRight className="text-warm-sand opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}
                      {(!category.subcategories || category.subcategories.length === 0) && (
                        <p className="px-4 text-xs font-medium text-deep-espresso/30 italic">No sub-collections available.</p>
                      )}
                   </div>
                </div>

                {/* All Collections Shortcut */}
                <div className="space-y-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-warm-sand flex items-center gap-3">
                     <span className="w-8 h-px bg-warm-sand/30" />
                     Other Categories
                   </h3>
                   <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                      {allCategories.filter(c => c._id !== category._id).slice(0, 6).map(cat => (
                        <Link
                          key={cat._id}
                          to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-soft-oatmeal/5 transition-colors group"
                        >
                           <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-soft-oatmeal/10">
                              <img src={cat.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                           </div>
                           <span className="text-xs font-black uppercase tracking-widest text-deep-espresso/40 group-hover:text-deep-espresso transition-colors line-clamp-1">
                             {cat.name}
                           </span>
                        </Link>
                      ))}
                   </div>
                </div>
             </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
             <div className="flex items-center justify-between mb-12 border-b border-soft-oatmeal/10 pb-6">
                <div className="space-y-1">
                   <h2 className="text-2xl md:text-3xl font-black text-deep-espresso">{category.name} Selection</h2>
                   <p className="text-sm text-warm-sand font-medium italic">{category.description || 'Premium curated items for your interior spaces.'}</p>
                </div>
                <div className="hidden md:flex gap-4">
                   <button className="p-3 rounded-full bg-soft-oatmeal/10 text-deep-espresso hover:bg-warm-sand hover:text-white transition-all shadow-sm"><FiGrid size={20} /></button>
                </div>
             </div>

             {/* Subcategories Grid */}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {category.subcategories?.map((sub, index) => (
                  <motion.div
                    key={sub._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      to={`/category/${slug}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="group block space-y-4"
                    >
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-soft-oatmeal/10 border border-soft-oatmeal/5 shadow-sm group-hover:shadow-2xl transition-all duration-500 relative">
                        <img 
                          src={sub.image} 
                          alt={sub.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="px-2 space-y-1">
                         <h4 className="text-sm md:text-lg font-black text-deep-espresso group-hover:text-warm-sand transition-colors">{sub.name}</h4>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand/50">Explore Collection</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
             </div>
          </main>
        </div>
      </div>

      <div className="mt-20 border-t border-soft-oatmeal/10">
        <BrandScroll title="Trusted Manufacturers" />
      </div>
    </div>
  );
};

export default CategoryDetailPage;
