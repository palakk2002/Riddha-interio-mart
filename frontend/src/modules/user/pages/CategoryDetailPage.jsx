import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiGrid, FiArrowRight, FiFilter, FiHome } from 'react-icons/fi';
import api from '../../../shared/utils/api';
import ProductCard from '../components/ProductCard';
import BrandScroll from '../components/BrandScroll';

const CategoryDetailPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current category by slug
        const catRes = await api.get(`/categories/slug/${slug}`);
        const currentCategory = catRes.data.data;
        setCategory(currentCategory);

        // Fetch products for this category
        const productRes = await api.get(`/products?category=${currentCategory.name}`);
        setProducts(productRes.data.data);

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
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center bg-[#FDFBF9]">
        <div className="w-16 h-16 border-4 border-warm-sand/20 border-t-warm-sand rounded-full animate-spin mb-6" />
        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-deep-espresso/40 animate-pulse">Curating Selection</h2>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center text-center p-8">
        <div className="mb-8 p-10 bg-soft-oatmeal/10 rounded-full text-deep-espresso/10">
          <FiHome size={64} />
        </div>
        <h2 className="text-3xl font-display font-bold text-deep-espresso mb-4">Collection Unavailable</h2>
        <p className="text-deep-espresso/40 max-w-xs mb-10 leading-relaxed">This category might have moved or is currently being updated by our curators.</p>
        <Link to="/" className="bg-deep-espresso text-white px-10 py-4 rounded-full font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-[#FDFBF9]">
      {/* Category Hero */}
      <div className="relative h-[300px] md:h-[450px] overflow-hidden">
        <img 
          src={category.image && !category.image.startsWith('C:') ? category.image : 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80'} 
          alt={category.name} 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-24 max-w-4xl">
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             className="space-y-4 md:space-y-6"
           >
             <nav className="flex items-center gap-2 text-white/50 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4">
               <Link to="/" className="hover:text-white transition-colors">Home</Link>
               <FiChevronRight size={14} />
               <span className="text-white">Collections</span>
             </nav>
             <h1 className="text-4xl md:text-8xl font-display font-bold text-white tracking-tighter leading-none">
               {category.name}
             </h1>
             <p className="text-white/70 text-sm md:text-xl font-light leading-relaxed max-w-2xl border-l-2 border-warm-sand pl-6 italic">
                {category.description || `Exquisite pieces curated from the world's finest artisans, designed to bring character and timeless elegance to your modern living spaces.`}
             </p>
           </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-4 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 md:gap-24 relative">
          
          {/* Professional Sidebar - Categories Navigation */}
          <aside className="lg:w-72 shrink-0">
             <div className="sticky top-32 space-y-12">
                <div className="space-y-8">
                   <div className="flex items-center justify-between border-b border-soft-oatmeal pb-4">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-deep-espresso/30">Collections</h3>
                     <FiFilter className="text-warm-sand h-4 w-4" />
                   </div>
                   <div className="flex flex-col gap-2">
                      {allCategories.map(cat => (
                        <Link
                          key={cat._id}
                          to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className={`group flex items-center justify-between py-3.5 px-5 rounded-2xl transition-all duration-300 ${cat._id === category._id ? 'bg-deep-espresso text-white shadow-2xl shadow-black/20' : 'text-deep-espresso/60 hover:bg-soft-oatmeal/10 hover:text-deep-espresso'}`}
                        >
                           <span className={`text-sm font-bold ${cat._id === category._id ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform`}>
                             {cat.name}
                           </span>
                           {cat._id === category._id && <div className="w-1.5 h-1.5 rounded-full bg-warm-sand shadow-[0_0_10px_rgba(182,143,101,0.5)]" />}
                        </Link>
                      ))}
                   </div>
                </div>

                {/* Sub-collections Visual Links */}
                {category.subcategories && category.subcategories.length > 0 && (
                   <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-deep-espresso/30 border-b border-soft-oatmeal pb-4">Refine Search</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {category.subcategories.map(sub => (
                          <Link 
                            key={sub._id}
                            to={`/category/${slug}?sub=${sub.name.toLowerCase()}`}
                            className="relative h-20 rounded-2xl overflow-hidden group border border-soft-oatmeal/20"
                          >
                            <img 
                              src={sub.image && !sub.image.startsWith('C:') ? sub.image : 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&q=80'} 
                              alt="" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-[10px] font-black uppercase tracking-widest">{sub.name}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                   </div>
                )}
             </div>
          </aside>

          {/* Main Visual Grid Area */}
          <main className="flex-1">
             <div className="flex flex-col md:flex-row items-baseline justify-between mb-4 md:mb-16 gap-6">
                <div>
                   <h2 className="text-3xl md:text-5xl font-display font-bold text-deep-espresso mb-3 leading-tight">Superior {category.name}</h2>
                   <div className="flex items-center gap-3">
                     <span className="h-px w-8 bg-warm-sand" />
                     <p className="text-sm text-warm-sand font-black uppercase tracking-widest">Showing {products.length} Masterpieces</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-deep-espresso/30">
                   <span>Sort By:</span>
                   <select className="bg-transparent border-b border-soft-oatmeal pb-1 focus:outline-none text-deep-espresso font-bold cursor-pointer">
                     <option>Handpicked</option>
                     <option>Price: Low to High</option>
                     <option>Newest First</option>
                   </select>
                </div>
             </div>

             {/* Products Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-12">
                <AnimatePresence mode="wait">
                  {products.length > 0 ? (
                    products.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                         <ProductCard product={product} index={index} variant="list" />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full py-32 text-center"
                    >
                       <p className="text-2xl font-display font-medium text-deep-espresso/20 italic mb-6">These pieces are currently being curated...</p>
                       <Link to="/products" className="text-warm-sand font-black uppercase tracking-widest text-[10px] border-b-2 border-warm-sand pb-1 hover:text-deep-espresso hover:border-deep-espresso transition-all">Explore Full Collection</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* Footer call to action in center */}
             {products.length > 0 && (
                <div className="mt-24 py-20 border-t border-soft-oatmeal/20 text-center space-y-8">
                   <h3 className="text-2xl md:text-4xl font-display font-bold text-deep-espresso underline decoration-warm-sand/20 decoration-8 underline-offset-[12px]">Request a Custom Selection?</h3>
                   <p className="text-deep-espresso/40 max-w-lg mx-auto text-sm md:text-lg font-light italic">
                      Can't find the exact piece for your vision? Our designers can source exclusive materials tailored to your specific architectural requirements.
                   </p>
                   <Link to="/contact">
                      <button className="px-12 py-5 bg-deep-espresso text-white rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-black hover:scale-105 active:scale-95 transition-all mt-4">
                        Contact Curator
                      </button>
                   </Link>
                </div>
             )}
          </main>
        </div>
      </div>

      <div className="border-t border-soft-oatmeal/10 py-12 md:py-24 bg-white/30 backdrop-blur-xl">
        <BrandScroll title="Premium Partners" />
      </div>
    </div>
  );
};

export default CategoryDetailPage;
