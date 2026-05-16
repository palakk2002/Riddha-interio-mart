import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Info, Globe, ShieldCheck, Zap } from 'lucide-react';
import warehouseImg from '../../../assets/seller_onboarding_warehouse_1778923798789.png';
import logo from "../../../assets/transparent_logo.png";

const SellerLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-['Outfit'] overflow-hidden">
      {/* Left Section: Image (Hidden on Mobile, or shown as top) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-[55%] h-[40vh] md:h-screen relative overflow-hidden"
      >
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          src={warehouseImg} 
          alt="Warehouse" 
          className="w-full h-full object-cover"
        />
        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-transparent" />
        
        {/* Branding on Image */}
        <div className="absolute top-12 left-12 z-20 hidden md:block">
           <img src={logo} alt="Logo" className="h-16 brightness-0 invert" />
        </div>

        {/* Floating Value Proposition (Web Only) */}
        <div className="absolute bottom-20 left-12 right-12 z-20 hidden md:block">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.8 }}
             className="bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/20 max-w-xl shadow-2xl"
           >
              <h2 className="text-4xl font-black text-white leading-tight mb-4">
                The future of <span className="text-[#E36666]">Interior Materials</span> starts here.
              </h2>
              <div className="flex gap-8">
                 <div className="flex flex-col">
                    <span className="text-2xl font-black text-[#E36666]">5000+</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Active Sellers</span>
                 </div>
                 <div className="w-px h-10 bg-white/10" />
                 <div className="flex flex-col">
                    <span className="text-2xl font-black text-[#E36666]">Pan-India</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Delivery Network</span>
                 </div>
              </div>
           </motion.div>
        </div>
      </motion.div>

      {/* Right Section: Content */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-[45%] min-h-screen bg-[#FDF8F8] flex flex-col justify-center items-center p-8 md:p-20 relative"
      >
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 md:hidden">
           <img src={logo} alt="Logo" className="h-10" />
        </div>

        <div className="w-full max-w-[420px] flex flex-col items-center text-center">
          {/* Carousel Dots */}
          <div className="flex gap-2 mb-10">
            <div className="w-8 h-2 bg-[#E36666] rounded-full" />
            <div className="w-2 h-2 bg-slate-200 rounded-full" />
            <div className="w-2 h-2 bg-slate-200 rounded-full" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Join India's Largest <br />
            <span className="text-[#E36666]">Interior Materials</span> <br />
            Market.
          </h1>

          <p className="text-base font-medium text-slate-400 mb-12 leading-relaxed">
            Empower your business with direct access to millions of premium customers across the country.
          </p>

          <div className="w-full space-y-5">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/seller/signup')}
              className="w-full py-6 bg-[#E36666] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#E36666]/30 transition-all flex items-center justify-center gap-3"
            >
              Join as a Seller <ArrowRight size={18} />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate('/seller/login-form')}
              className="w-full py-6 border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
            >
              Login to Dashboard
            </motion.button>
          </div>

          {/* Quick Stats/Trust */}
          <div className="mt-16 pt-10 border-t border-slate-100 w-full grid grid-cols-3 gap-4">
             <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#189D91]">
                   <Globe size={18} />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Pan India Coverage</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#189D91]">
                   <ShieldCheck size={18} />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Secure Payments</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#189D91]">
                   <Zap size={18} />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Fast Growth</span>
             </div>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 text-sm font-bold text-slate-400"
          >
            Already a partner? <Link to="/seller/login-form" className="text-slate-900 underline decoration-[#E36666] decoration-4 underline-offset-8 hover:text-[#E36666] transition-colors">Sign In Now</Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default SellerLogin;
