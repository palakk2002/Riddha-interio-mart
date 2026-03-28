import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuChevronRight, LuChevronLeft } from 'react-icons/lu';
import { brandData } from '../data/brandData';
import { AnimatePresence, motion } from 'framer-motion';

const BrandPage = () => {
  const { brandName } = useParams();
  const brand = brandData[brandName?.toLowerCase()];
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Auto-scroll carousel
  useEffect(() => {
    if (!brand?.banners?.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % brand.banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [brand]);

  // Scroll to top when brand changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentSlide(0);
  }, [brandName]);

  if (!brand) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-white">
        <h1 className="text-3xl font-bold text-deep-espresso uppercase tracking-tighter italic">Brand Not Found</h1>
        <p className="text-warm-sand mt-2">We are currently updating our brand directories.</p>
        <Link to="/" className="mt-8 bg-[#922724] text-white px-10 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#922724]/20 hover:scale-105 transition-all">Back to Home</Link>
      </div>
    );
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % brand.banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + brand.banners.length) % brand.banners.length);

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Brand Hero Carousel */}
      <section className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden bg-gray-50 group/carousel">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            <img 
              src={brand.banners[currentSlide]} 
              alt={`${brand.name} Banner ${currentSlide + 1}`} 
              className="w-full h-full object-cover"
            />
            {/* Subtle overlay for placeholder banners only if they are just images */}
            {brand.banners[currentSlide].startsWith('http') && (
              <div className="absolute inset-0 bg-black/10 flex items-center px-6 md:px-20">
                 <h1 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter drop-shadow-2xl">
                    {brand.name}
                 </h1>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
           <button onClick={prevSlide} className="p-2 md:p-4 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-all active:scale-90">
              <LuChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
           </button>
           <button onClick={nextSlide} className="p-2 md:p-4 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-all active:scale-90">
              <LuChevronRight className="w-6 h-6 md:w-8 md:h-8" />
           </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
           {brand.banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-10 bg-white' : 'w-4 bg-white/40'}`}
              />
           ))}
        </div>
      </section>

      {/* Shop By Category - Horizontal Scroll */}
      <section className="max-w-7xl mx-auto py-12 md:py-20">
        <div className="px-4 md:px-12 flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-xl md:text-4xl font-display font-bold text-gray-900 tracking-tight">Shop By Category</h2>
          <Link to="/categories" className="text-xs md:text-sm font-bold text-[#922724] flex items-center gap-1 hover:underline uppercase tracking-widest">
            View All <LuChevronRight />
          </Link>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-8 px-4 md:px-12 pb-6 snap-x">
          {brand.categories.map((cat) => (
            <Link 
              key={cat.id}
              to={`/products?brand=${brand.name}&category=${cat.slug}`}
              className="flex flex-col flex-shrink-0 w-[140px] md:w-[220px] snap-start group relative bg-white rounded-xl md:rounded-3xl overflow-hidden shadow-sm border border-soft-oatmeal/10 transition-all hover:shadow-xl"
            >
              {/* Image Container matching Home Page aspect ratios */}
              <div className="aspect-square md:aspect-[4/5] overflow-hidden bg-[#F9F9F9] relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-contain p-4 md:p-6 transition-transform duration-700 group-hover:scale-110 mix-blend-multiply" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Category Label matching Home Page style */}
              <div className="py-4 px-2 text-center bg-white border-t border-soft-oatmeal/5">
                <span className="text-[10px] md:text-sm font-bold text-deep-espresso/80 group-hover:text-[#922724] transition-colors tracking-tight line-clamp-1 uppercase">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Highlight Promo */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-8">
         <div className="rounded-[40px] bg-[#F2F2F2] p-8 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-16 border border-gray-100">
            <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#922724]">Official Brand Partner</span>
               <h2 className="text-3xl md:text-5xl font-display font-bold text-deep-espresso leading-tight">
                  Authentic {brand.name} <br /> Products at Wholesale.
               </h2>
               <p className="text-sm md:text-lg text-warm-sand max-w-xl">
                  Get the best deals on {brand.name} electrical and interior solutions. Direct from warehouse with guaranteed quality and fast delivery.
               </p>
               <button className="bg-deep-espresso text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl transition-all hover:bg-[#922724] hover:scale-105 active:scale-95">
                  Explore Catalog
               </button>
            </div>
            <div className="hidden md:block w-1/3 aspect-square bg-white rounded-full p-12 border-4 border-white shadow-2xl">
               <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-black italic tracking-tighter uppercase text-[#922724]/20">
                     {brand.name}
                  </span>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default BrandPage;
