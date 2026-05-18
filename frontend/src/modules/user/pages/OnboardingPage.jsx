import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const OnboardingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center font-sans overflow-y-auto md:px-4 md:py-8">
      {/* Device wrapper for desktop, seamless on mobile */}
      <div className="w-full max-w-[420px] min-h-screen md:min-h-[820px] bg-white flex flex-col justify-between md:rounded-3xl md:shadow-2xl overflow-hidden relative border-none md:border-slate-100">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 p-2.5 bg-black/20 backdrop-blur-md text-white hover:bg-black/40 rounded-full transition-all z-20 shadow-sm"
          aria-label="Go Back"
        >
          <FiArrowLeft size={20} />
        </button>

        {/* Top Half: Beautiful Interior Design Image */}
        <div className="h-[460px] w-full relative bg-slate-100 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000" 
            alt="Premium Living Room" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom Half: Premium Onboarding Content */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 bg-white -mt-10 rounded-t-[36px] relative z-10 px-8 pt-10 pb-8 flex flex-col justify-between shadow-[0_-15px_30px_rgba(0,0,0,0.04)]"
        >
          {/* Typography */}
          <div className="text-center mt-2">
            <h1 className="text-3xl font-black text-slate-800 leading-[1.2] tracking-tight">
              Discover Materials<br/>& Decor
            </h1>
            <p className="text-[15px] font-semibold text-slate-500 mt-3 leading-relaxed max-w-xs mx-auto">
              Discover homes and high-quality<br/>designed living rooms.
            </p>
          </div>

          <div className="w-full">
            {/* Active Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-8 h-1.5 bg-[#189D91] rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-[#189D91]/30 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-[#189D91]/30 rounded-full"></div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-4">
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-[#EC008C] hover:bg-[#d8007e] text-white py-4 rounded-2xl font-bold text-[15px] uppercase tracking-wider shadow-lg shadow-[#EC008C]/20 transition-all active:scale-[0.98]"
              >
                Continue
              </button>
              
              <button 
                onClick={() => navigate('/login')} 
                className="w-full text-center text-slate-400 hover:text-slate-600 font-bold text-[13px] uppercase tracking-wider transition-colors pt-1"
              >
                Skip
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingPage;
