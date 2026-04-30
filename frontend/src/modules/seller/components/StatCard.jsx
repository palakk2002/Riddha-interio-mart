import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-4 md:p-6 rounded-2xl md:rounded-xl shadow-sm md:shadow-md border border-soft-oatmeal flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-3 md:gap-4 transition-all duration-300 hover:shadow-lg"
    >
      <div className={`p-3 md:p-4 rounded-xl md:rounded-lg ${color} bg-opacity-10 text-lg md:text-2xl`}>
        <Icon className={`${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-[9px] md:text-sm font-black text-red-800/60 uppercase tracking-widest">{label}</p>
        <h3 className="text-lg md:text-2xl font-black text-deep-espresso mt-0.5">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
