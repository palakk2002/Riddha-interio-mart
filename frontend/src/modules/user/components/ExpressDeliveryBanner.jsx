import React from 'react';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';

const ExpressDeliveryBanner = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-1">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#FEF2F2] to-[#FDFBF9] border border-[#FEE2E2] p-3 md:p-6 flex items-center justify-between gap-4 md:gap-8"
      >
        {/* Decorative background elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#922724]/5 rounded-full blur-2xl"></div>
        
        {/* Text Content */}
        <div className="relative z-10 space-y-1.5 flex-1 pl-1 md:pl-2">
          <div className="flex items-center gap-2">
             <div className="bg-[#922724] p-1.5 rounded-lg text-white shadow-md shadow-[#922724]/10 text-sm md:text-lg">
                <FiZap />
             </div>
             <h2 className="text-[15px] md:text-3xl font-display font-bold text-[#922724] tracking-tight leading-none">
                Express Delivery in <span className="underline decoration-wavy decoration-[#922724]/20 underline-offset-4">4 hours</span>
             </h2>
          </div>
          
          <div className="space-y-0.5">
            <p className="text-[#922724]/80 text-[11px] md:text-lg font-semibold leading-tight">
                Order before <span className="text-[#922724] font-bold">6 PM</span> for <span className="text-[#922724] font-bold">4hr delivery*</span>
            </p>
            <p className="text-[#922724]/40 text-[9px] md:text-sm font-medium tracking-tight">
                *On select products & locations
            </p>
          </div>
        </div>

        {/* Illustration Section - Compact */}
        <div className="relative z-10 flex-shrink-0 pr-1 md:pr-4">
            <div className="relative flex items-center justify-center">
                {/* Clock - Smaller */}
                <motion.div 
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-3 -right-1 w-10 h-10 md:w-16 md:h-16 bg-white rounded-full shadow-lg flex items-center justify-center z-20 border-[3px] border-[#FEF2F2]"
                >
                    <svg viewBox="0 0 100 100" className="w-7 h-7 md:w-11 md:h-11 text-red-500">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
                        <path d="M50 50 L50 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                        <path d="M50 50 L70 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="4" fill="currentColor" />
                    </svg>
                </motion.div>

                {/* Truck - Smaller */}
                <motion.div 
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    <svg viewBox="0 0 160 100" className="w-24 min-[400px]:w-32 md:w-56 drop-shadow-xl">
                        <ellipse cx="80" cy="85" rx="70" ry="10" fill="black" opacity="0.05" />
                        <path d="M20 20 H110 V75 H20 Z" fill="#922724" />
                        <path d="M110 35 H150 L150 75 H110 Z" fill="#7a1f1b" />
                        <path d="M115 40 H140 L135 60 H115 Z" fill="#fff" opacity="0.2" />
                        <text x="35" y="55" fill="white" fontSize="12" fontWeight="bold" opacity="0.3">EXPRESS</text>
                        <circle cx="45" cy="80" r="12" fill="#333" />
                        <circle cx="125" cy="80" r="12" fill="#333" />
                    </svg>
                </motion.div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpressDeliveryBanner;
