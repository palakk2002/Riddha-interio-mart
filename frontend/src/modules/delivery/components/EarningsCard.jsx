import React from 'react';
import { motion } from 'framer-motion';
import { LuTrendingUp, LuTrendingDown, LuActivity } from 'react-icons/lu';

const EarningsCard = ({ label, value, subtext, icon: Icon, trend }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-all"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-full blur-[40px] -mr-12 -mt-12 group-hover:bg-[#189D91]/10 transition-colors"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#189D91] group-hover:bg-[#189D91] group-hover:text-white transition-colors shadow-sm">
            <Icon size={20} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${
              trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {trend > 0 ? <LuTrendingUp size={12} /> : <LuTrendingDown size={12} />}
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">₹{value.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-slate-500">
             <LuActivity size={12} className="text-[#189D91]" />
             <p className="text-xs font-medium">{subtext}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
         <Icon size={40} className="text-[#189D91]" />
      </div>
    </motion.div>
  );
};

export default EarningsCard;
