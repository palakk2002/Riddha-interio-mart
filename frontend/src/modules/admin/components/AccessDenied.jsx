import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShieldOff, FiArrowLeft, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-16 max-w-lg w-full text-center border border-soft-oatmeal relative overflow-hidden"
      >
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#240046]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-warm-sand/10 rounded-full -ml-16 -mb-16 blur-2xl" />

        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 relative z-10">
          <FiShieldOff size={48} />
        </div>

        <h1 className="text-3xl font-black text-deep-espresso tracking-tight uppercase italic mb-4 relative z-10">
          Access <span className="text-warm-sand">Denied</span>
        </h1>
        
        <p className="text-dusty-cocoa font-medium mb-10 relative z-10">
          You do not have the required permissions to access this module. Please contact the administrator if you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-soft-oatmeal/30 hover:bg-soft-oatmeal/50 text-deep-espresso font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all"
          >
            <FiArrowLeft /> Go Back
          </button>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-deep-espresso text-white hover:bg-[#240046] font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-purple-900/20"
          >
            <FiHome /> Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
