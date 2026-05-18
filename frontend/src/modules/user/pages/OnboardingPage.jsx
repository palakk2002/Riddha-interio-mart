import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OnboardingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col relative max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* Background Image (Top Half) */}
      <div className="h-[55vh] w-full relative bg-gray-100">
        <img 
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000" 
          alt="Premium Living Room" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Content Card */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 bg-white -mt-8 rounded-t-[32px] relative z-10 px-6 pt-10 pb-8 flex flex-col items-center shadow-[0_-10px_20px_rgba(0,0,0,0.05)]"
      >
        <h1 className="text-[28px] font-extrabold text-gray-900 text-center leading-[1.2] tracking-tight">
          Discover Materials<br/>& Decor
        </h1>
        
        <p className="text-[15px] font-medium text-gray-500 text-center mt-4 px-4 leading-relaxed">
          Discover themes and high-quality<br/>designed living rooms.
        </p>

        {/* Paginator Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 mb-auto">
          <div className="w-6 h-[5px] bg-[#36A18B] rounded-full"></div>
          <div className="w-[5px] h-[5px] bg-[#36A18B]/30 rounded-full"></div>
          <div className="w-[5px] h-[5px] bg-[#36A18B]/30 rounded-full"></div>
        </div>

        {/* Actions */}
        <div className="w-full mt-10">
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-[#E54876] hover:bg-[#d83f6b] text-white py-4 rounded-full font-bold text-[17px] shadow-lg shadow-[#E54876]/20 transition-all active:scale-[0.98]"
          >
            Continue
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="w-full text-center text-gray-400 hover:text-gray-600 font-bold text-[15px] mt-4 pb-2 transition-colors"
          >
            Skip
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
