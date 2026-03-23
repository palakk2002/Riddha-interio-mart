import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-md border border-soft-oatmeal flex items-center gap-4 transition-all duration-300 hover:shadow-lg"
    >
      <div className={`p-4 rounded-lg ${color} bg-opacity-10 text-xl md:text-2xl`}>
        <Icon className={`${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-[10px] md:text-sm font-medium text-warm-sand uppercase tracking-wider">{label}</p>
        <h3 className="text-xl md:text-2xl font-bold text-deep-espresso mt-1">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
