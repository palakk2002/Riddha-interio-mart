import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import offerBannerImg from '../../../assets/offer_banner.png';

const OfferBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 py-4">
      <div className="flex flex-row h-32 sm:h-40 md:h-64 rounded-xl md:rounded-[2.5rem] overflow-hidden shadow-lg border border-soft-oatmeal/10 bg-white">
        {/* Left Content (Flexible split) with White Background */}
        <div className="w-[42%] min-[400px]:w-[38%] md:w-[30%] bg-white flex flex-col justify-center px-3 min-[400px]:px-4 md:px-12 py-2 md:py-8 space-y-1 md:space-y-4">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[13px] min-[360px]:text-[15px] sm:text-lg md:text-3xl font-black text-deep-espresso leading-[1.1] md:leading-tight uppercase tracking-tight"
          >
            Turn On <br className="md:block"/> The Charm
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/products" className="text-[9px] min-[360px]:text-[10px] sm:text-xs md:text-lg font-bold text-warm-sand hover:text-deep-espresso uppercase tracking-[0.05em] md:tracking-widest flex items-center gap-1 md:gap-2 transition-colors">
              Min. 40% Off <span className="text-sm md:text-xl transform md:translate-y-[1px]">→</span>
            </Link>
          </motion.div>
        </div>
        
        {/* Right Product Image (62-70%) */}
        <div className="w-[62%] md:w-[70%] relative overflow-hidden group bg-soft-oatmeal/5">
          <motion.img 
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            src={offerBannerImg} 
            alt="Exclusive Offer" 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Slider-style Dots from Reference */}
          <div className="absolute bottom-2 md:bottom-6 left-4 md:left-10 flex gap-1.5 md:gap-3">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div 
                key={i} 
                className={`h-1 md:h-2 rounded-full transition-all duration-300 ${
                  i === 1 ? 'w-3 md:w-8 bg-[#FF6B35]' : 'w-1 md:w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
          
          {/* Small Legal Text from Reference */}
          <p className="absolute bottom-2 md:bottom-6 right-4 md:right-10 text-[6px] md:text-[10px] text-white/50 font-bold tracking-widest uppercase pointer-events-none">
            *T&C Apply
          </p>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
