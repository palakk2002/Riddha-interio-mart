import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon: Icon, label, value, trend, data, color = 'seller-primary' }) => {
  const isPositive = trend >= 0;
  
  // Dummy sparkline data if none provided
  const chartData = data || [
    { value: 30 }, { value: 40 }, { value: 35 }, { value: 50 }, 
    { value: 45 }, { value: 60 }, { value: 55 }, { value: 70 }
  ];

  // Create a safe ID for the gradient by removing spaces and special characters
  const gradientId = `gradient-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-seller-light/50 group-hover:text-seller-primary transition-all duration-300">
          <Icon size={22} strokeWidth={2.5} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight ${isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{value}</h3>
      </div>

      <div className="mt-6 h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity={0.3}/>
                <stop offset="100%" stopColor={isPositive ? '#10B981' : '#F43F5E'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? '#10B981' : '#F43F5E'} 
              strokeWidth={3} 
              fillOpacity={1} 
              fill={`url(#${gradientId})`}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          vs. last month
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-pulse"></div>
      </div>
    </motion.div>
  );
};

export default React.memo(StatCard);
