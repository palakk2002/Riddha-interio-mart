import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Assets
import heroMinimal from '../../../assets/hero-minimal.png';
import homeHero1 from '../../../assets/home_hero_1.png';
import homeHero2 from '../../../assets/home_hero_2.png';
import homeHero3 from '../../../assets/home_hero_3.png';

const banners = [
  { id: 1, image: heroMinimal, title: 'Luxury Minimalist Interiors', subtitle: 'Crafting spaces with character' },
  { id: 2, image: homeHero1, title: 'Bespoke Living Spaces', subtitle: 'Modern elegance redefined' },
  { id: 3, image: homeHero2, title: 'Culinary Excellence', subtitle: 'Premium kitchen hardware and design' },
  { id: 4, image: homeHero3, title: 'Serene Sanctuary', subtitle: 'Minimalist bedroom essentials' },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative h-[200px] md:h-[480px] w-full overflow-hidden md:rounded-3xl rounded-none group shadow-2xl bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={banners[current].image}
            alt={banners[current].title}
            className="h-full w-full object-cover"
          />
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent flex items-center px-4 md:px-20">
             <div className="max-w-xl space-y-1.5 md:space-y-6">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#189D91] font-black uppercase tracking-[0.3em] text-[10px] md:text-sm bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full inline-block border border-white/20"
                >
                  Premium Collection
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl md:text-7xl font-display font-bold text-white leading-[1.1] tracking-tighter"
                >
                  {banners[current].title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/60 text-[10px] md:text-xl font-light italic"
                >
                  {banners[current].subtitle}
                </motion.p>
             </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
         <button onClick={prevSlide} className="p-2 md:p-5 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/40 border border-white/20 transition-all active:scale-90 shadow-2xl">
            <FiChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
         </button>
         <button onClick={nextSlide} className="p-2 md:p-5 rounded-full bg-white/20 backdrop-blur-xl text-white hover:bg-white/40 border border-white/20 transition-all active:scale-90 shadow-2xl">
            <FiChevronRight className="w-6 h-6 md:w-10 md:h-10" />
         </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
         {banners.map((_, idx) => (
            <button
               key={idx}
               onClick={() => setCurrent(idx)}
               className={`h-1 rounded-full transition-all duration-700 ${current === idx ? 'w-12 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'w-4 bg-white/30'}`}
            />
         ))}
      </div>
    </div>
  );
};

export default Banner;
