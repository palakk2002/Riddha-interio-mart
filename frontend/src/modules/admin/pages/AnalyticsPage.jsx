import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiArrowUpRight, 
  FiArrowDownRight, 
  FiCalendar, 
  FiPieChart,
  FiActivity,
  FiZap
} from 'react-icons/fi';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('This Month');

  // Mock Data for Frontend Display
  const stats = [
    { label: 'Total Revenue', value: '₹12,45,800', change: '+14.5%', isUp: true, icon: FiDollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Total Orders', value: '1,284', change: '+8.2%', isUp: true, icon: FiShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Profit Margin', value: '28.4%', change: '-2.1%', isUp: false, icon: FiTrendingUp, color: 'bg-warm-sand/10 text-warm-sand' },
    { label: 'Avg Order Value', value: '₹970', change: '+5.4%', isUp: true, icon: FiZap, color: 'bg-purple-50 text-purple-600' }
  ];

  const topSellers = [
    { name: 'Royal Interiors', sales: '₹4,20,000', orders: 142, growth: '+12%' },
    { name: 'Modern Decor Pvt', sales: '₹2,80,000', orders: 98, growth: '+8%' },
    { name: 'Luxury Lighting', sales: '₹1,50,000', orders: 56, growth: '-2%' },
    { name: 'Artisan Woodwork', sales: '₹95,000', orders: 34, growth: '+15%' }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-deep-espresso tracking-tight uppercase italic flex items-center gap-3">
              <FiActivity className="text-warm-sand" /> Performance <span className="text-warm-sand">Insights</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Real-time business intelligence and revenue metrics.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            {['Today', 'Last 7 Days', 'This Month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-deep-espresso text-white shadow-lg' : 'text-gray-400 hover:text-deep-espresso hover:bg-gray-50'}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 group hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-2xl transition-transform group-hover:rotate-12`}>
                  <stat.icon />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full ${stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
                  {stat.change}
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-deep-espresso tracking-tighter">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart Placeholder */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/20 relative overflow-hidden">
             <div className="flex items-center justify-between mb-12">
               <div>
                 <h3 className="text-xl font-black text-deep-espresso uppercase tracking-tight italic">Revenue Growth</h3>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Daily sales performance analysis</p>
               </div>
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-warm-sand" />
                   <span className="text-[10px] font-black uppercase text-gray-400">Current</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-gray-100" />
                   <span className="text-[10px] font-black uppercase text-gray-400">Previous</span>
                 </div>
               </div>
             </div>

             {/* Mock Chart SVG */}
             <div className="h-64 w-full relative group cursor-crosshair">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,80 Q10,75 20,40 T40,60 T60,20 T80,45 T100,10" fill="none" stroke="#8B2323" strokeWidth="4" className="drop-shadow-2xl" />
                  <path d="M0,80 Q10,75 20,40 T40,60 T60,20 T80,45 T100,10 L100,100 L0,100 Z" fill="url(#chartGradient)" className="opacity-10" />
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B2323" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
                  {[...Array(5)].map((_, i) => <div key={i} className="h-px bg-black w-full" />)}
                </div>
             </div>

             <div className="flex justify-between mt-8">
               {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                 <span key={day} className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{day}</span>
               ))}
             </div>
          </div>

          {/* Top Sellers */}
          <div className="bg-deep-espresso rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-deep-espresso/40">
             <div className="absolute top-0 right-0 w-48 h-48 bg-warm-sand/5 rounded-full -mr-24 -mt-24 blur-3xl" />
             <h3 className="text-xl font-black uppercase tracking-tight italic mb-8 flex items-center gap-3">
               <FiTrendingUp className="text-warm-sand" /> Top Performers
             </h3>

             <div className="space-y-6">
                {topSellers.map((seller, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-warm-sand group-hover:bg-warm-sand group-hover:text-deep-espresso transition-all">
                         {i + 1}
                       </div>
                       <div>
                         <p className="text-xs font-black uppercase tracking-tight">{seller.name}</p>
                         <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{seller.orders} Orders</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black tracking-tight">{seller.sales}</p>
                       <p className={`text-[9px] font-black uppercase tracking-widest ${seller.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                         {seller.growth}
                       </p>
                    </div>
                  </div>
                ))}
             </div>

             <button className="w-full mt-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-warm-sand hover:text-deep-espresso transition-all">
               View Full Leaderboard
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
