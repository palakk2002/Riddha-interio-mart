import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../data/UserContext';
import { FiArrowLeft, FiSmartphone } from 'react-icons/fi';
import Button from '../../../shared/components/Button';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (identifier.trim()) {
      login({ name: 'Guest User', id: identifier });
      navigate('/cart');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <div className="px-6 py-6 flex items-center gap-6 border-b border-soft-oatmeal/10">
        <button onClick={() => navigate(-1)}>
          <FiArrowLeft className="h-6 w-6 text-deep-espresso" />
        </button>
        <h1 className="text-xl font-bold text-deep-espresso">Sign Up Or Log In</h1>
      </div>

      {/* Promotional Banner */}
      <div className="relative bg-[#FFF5F2] mx-4 mt-6 rounded-3xl overflow-hidden p-6 flex items-center justify-between border border-red-50">
        <div className="relative z-10 max-w-[60%]">
          <h2 className="text-2xl font-black text-[#F44336] leading-tight">
            Sign Up Now & Get Upto Rs. 1,500 Off
          </h2>
          <p className="text-sm font-bold text-[#F44336] mt-1 flex items-center gap-1">
            On Your First Purchase <span className="text-lg">›</span>
          </p>
          <div className="mt-4 inline-block bg-white border-2 border-dashed border-[#F44336]/20 px-3 py-1.5 rounded-lg">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Use Coupon : <span className="text-deep-espresso text-xs font-black">HELLO1500</span></p>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-44 h-44 opacity-90">
             {/* Mock image placeholder using background color or an icon if img not available */}
             <img 
               src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80" 
               alt="promo" 
               className="w-full h-full object-cover object-top mask-linear-gradient"
             />
        </div>
      </div>

      {/* Form */}
      <div className="px-6 mt-12 space-y-8">
        <div className="space-y-6">
           <p className="text-center text-lg font-bold text-deep-espresso">Sign Up Or Log In</p>
           
           <div className="space-y-2">
             <div className="relative">
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter Mobile Number or Email Id" 
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:border-warm-sand focus:outline-none text-base font-medium transition-all"
                />
             </div>
           </div>

           <Button 
             onClick={handleLogin}
             size="lg" 
             className="w-full h-16 rounded-xl bg-[#F44336] hover:bg-[#D32F2F] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200"
           >
             CONTINUE
           </Button>

           <p className="text-[10px] text-center text-gray-400 font-medium leading-relaxed">
             By continuing, you agree to our <span className="text-[#F44336] font-bold">Terms & Conditions</span>
           </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
           <div className="h-px flex-1 bg-gray-100" />
           <span className="text-xs font-bold text-gray-400">Or</span>
           <div className="h-px flex-1 bg-gray-100" />
        </div>
        <p className="text-center text-[10px] text-gray-400 font-black tracking-widest uppercase">Continue with</p>

        {/* Social Buttons */}
        <div className="grid grid-cols-1 gap-4 pb-20">
           <button className="flex items-center justify-center gap-4 py-4 border-2 border-gray-100 rounded-xl font-bold text-deep-espresso hover:bg-gray-50 transition-all">
             <img src="https://www.google.com/favicon.ico" className="h-5 w-5" alt="google" />
             Google
           </button>
           <button className="flex items-center justify-center gap-4 py-4 border-2 border-gray-100 rounded-xl font-bold text-deep-espresso hover:bg-gray-50 transition-all">
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="h-5 w-5" alt="facebook" />
             Facebook
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
