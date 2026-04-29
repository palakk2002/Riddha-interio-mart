import React from 'react';
import { motion } from 'framer-motion';

const EarningsCard = ({ label, value, subtext, icon: Icon, trend }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-soft-oatmeal flex flex-col justify-between h-full relative overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-xl bg-warm-sand/10 text-warm-sand">
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-[#001B4E]/10 text-[#001B4E]'}`}>
            {trend > 0 ? '+' : ''}{trend}% vs last week
          </span>
        )}
      </div>
      
      <div className="mt-6">
        <p className="text-[10px] font-bold text-warm-sand uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold text-deep-espresso">₹{value}</span>
        </div>
        <p className="text-xs text-dusty-cocoa mt-1">{subtext}</p>
      </div>

      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-soft-oatmeal/20 rounded-full blur-2xl"></div>
    </motion.div>
  );
};

export default EarningsCard;
