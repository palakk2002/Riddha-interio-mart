import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color, onClick }) => {
  const textColor = color.replace('bg-', 'text-');

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:border-[#6D28D9] ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-100 transition-colors`}>
        <Icon size={20} className={textColor} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
