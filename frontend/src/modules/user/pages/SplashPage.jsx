import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import TransparentLogo from "../../../assets/transparent_logo.png";

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem('splashCompleted', 'true');
      navigate('/onboarding');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-[#189D91] flex items-center justify-center font-sans overflow-y-auto px-4 py-8">
      {/* Device wrapper for desktop, seamless on mobile */}
      <div className="w-full max-w-[420px] min-h-[820px] bg-[#189D91] flex flex-col items-center justify-between py-16 px-8 rounded-3xl md:shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow rings for high-end look */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
          
          {/* Logo Card with floating shopping cart icon */}
          <div className="relative mb-12">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white rounded-[24px] px-8 py-6 shadow-xl shadow-black/10 w-[240px] flex items-center justify-center"
            >
              <img src={TransparentLogo} alt="Interio Mega Mart" className="w-full object-contain" />
            </motion.div>

            {/* Shopping Cart Icon next to logo box as seen in screenshot */}
            <motion.div 
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -right-10 top-1/2 -translate-y-1/2 text-white/70"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </motion.div>
          </div>

          {/* Tagline */}
          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white text-center text-[19px] font-bold tracking-wide leading-snug max-w-xs"
          >
            Connecting India to<br/> Premium Interiors.
          </motion.p>
        </div>

        {/* Loading Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-[200px] mx-auto flex flex-col items-center mb-6 z-10"
        >
          <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest mb-3">Loading...</span>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.7, ease: "easeInOut" }}
              className="h-full bg-[#EC008C] rounded-full shadow-[0_0_8px_rgba(236,0,140,0.6)]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashPage;
