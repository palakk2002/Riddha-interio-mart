import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiShoppingBag, FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiActivity } from 'react-icons/fi';

const AnalyticsPage = () => {
  const stats = [
    { label: 'Total Revenue', value: '₹12,45,000', change: '+12.5%', trend: 'up', icon: FiTrendingUp, color: 'text-green-600' },
    { label: 'Active Sellers', value: '48', change: '+4', trend: 'up', icon: FiUsers, color: 'text-warm-sand' },
    { label: 'Monthly Orders', value: '1,284', change: '-2.1%', trend: 'down', icon: FiShoppingBag, color: 'text-red-500' },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.8%', trend: 'up', icon: FiActivity, color: 'text-deep-espresso' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-deep-espresso">Analytics Control Center</h1>
            <p className="text-warm-sand mt-2">Real-time performance metrics and store insights.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-soft-oatmeal rounded-xl font-bold text-sm text-deep-espresso hover:bg-soft-oatmeal/20 transition-all">Export Report</button>
            <button className="px-4 py-2 bg-deep-espresso text-white rounded-xl font-bold text-sm hover:bg-dusty-cocoa transition-all shadow-lg">Last 30 Days</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-soft-oatmeal shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-2xl bg-soft-oatmeal/20 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black ${stat.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.change} {stat.trend === 'up' ? <FiArrowUpRight /> : <FiArrowDownRight />}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-deep-espresso mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Placeholder Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-soft-oatmeal shadow-sm h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-bold text-deep-espresso flex items-center gap-2">
                    <FiTrendingUp className="text-warm-sand" /> Revenue Growth
                 </h3>
                 <div className="flex gap-2">
                    <span className="w-3 h-3 bg-warm-sand rounded-full"></span>
                    <span className="w-3 h-3 bg-deep-espresso rounded-full"></span>
                 </div>
              </div>
              <div className="flex-1 flex items-center justify-center border-t border-soft-oatmeal/50 border-dashed relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-warm-sand/5 to-transparent"></div>
                 <p className="text-sm font-bold text-warm-sand uppercase tracking-[0.2em] relative z-10">Chart Visualization (Simulated)</p>
                 
                 {/* Decorative chart bars */}
                 <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between h-48 px-10">
                    {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        className="w-4 bg-warm-sand/20 rounded-t-lg group relative"
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-deep-espresso text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">7.5k</div>
                      </motion.div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-deep-espresso p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-display font-bold mb-4">Top Performing Categories</h3>
                <div className="space-y-6 mt-8">
                   {[
                      { name: 'Living Room', share: '45%' },
                      { name: 'Decorative Arts', share: '30%' },
                      { name: 'Kitchen & Dining', share: '15%' },
                      { name: 'Outdoor', share: '10%' },
                   ].map((cat, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                            <span>{cat.name}</span>
                            <span className="text-warm-sand">{cat.share}</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: cat.share }}
                               transition={{ duration: 1+i*0.2 }}
                               className="h-full bg-warm-sand"
                            ></motion.div>
                         </div>
                      </div>
                   ))}
                </div>
              </div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-warm-sand/10 rounded-full blur-3xl"></div>
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AnalyticsPage;
