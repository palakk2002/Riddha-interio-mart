import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import TransparentLogo from "../../../assets/transparent_logo.png";

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#36A18B] flex flex-col items-center justify-between py-12 px-6 max-w-md mx-auto relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
        
        {/* Logo Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[24px] px-8 py-6 shadow-xl w-[260px] flex flex-col items-center justify-center relative mb-8"
        >
          <img src={TransparentLogo} alt="Interio Promo Mart" className="w-full object-contain" />


          {/* Fake Shopping Cart Icon next to logo box as seen in screenshot */}
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-white/50">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-white text-center text-[18px] font-medium mt-2 leading-snug tracking-wide"
        >
          Connecting India to<br/>Premium Interiors.
        </motion.p>
      </div>

      {/* Loading Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full max-w-[200px] mx-auto flex flex-col items-center mb-10 z-10"
      >
        <span className="text-white/90 text-[14px] font-medium tracking-widest mb-3">Loading...</span>
        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="h-full bg-[#F3F4F6] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          >
            <div className="h-full bg-gradient-to-r from-[#E54876]/80 to-[#E54876] w-3/4 rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SplashPage;
