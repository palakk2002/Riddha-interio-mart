import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color, onClick }) => {
  const textColor = color.replace('bg-', 'text-');

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`bg-white p-6 rounded-3xl shadow-sm border border-soft-oatmeal flex flex-col gap-4 transition-all duration-300 hover:shadow-xl hover:border-brand-teal/20 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}/10 transition-colors`}>
        <Icon size={22} className={textColor} />
      </div>
      <div>
        <p className="text-[10px] font-black text-warm-sand uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-2xl font-black text-[#240046] mt-1 tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
