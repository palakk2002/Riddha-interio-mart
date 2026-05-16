import React from 'react';
import { motion } from 'framer-motion';
import { LuTrendingUp, LuTrendingDown, LuActivity } from 'react-icons/lu';

const EarningsCard = ({ label, value, subtext, icon: Icon, trend }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-2xl transition-all"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-[#D63384]/10 transition-colors"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-[#D63384] transition-colors shadow-lg">
            <Icon size={28} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
              trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {trend > 0 ? <LuTrendingUp size={12} /> : <LuTrendingDown size={12} />}
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{value.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 mt-4 text-slate-500">
             <LuActivity size={14} className="text-[#D63384]" />
             <p className="text-xs font-bold">{subtext}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
         <Icon size={80} className="text-slate-900" />
      </div>
    </motion.div>
  );
};

export default EarningsCard;
