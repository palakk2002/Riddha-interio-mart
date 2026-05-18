import React from 'react';
import PageWrapper from '../components/PageWrapper';
import EarningsCard from '../components/EarningsCard';
import { 
  LuWallet, 
  LuTrendingUp, 
  LuCalendar, 
  LuAward, 
  LuFileText,
  LuActivity,
  LuPackage
} from 'react-icons/lu';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { earningsData } from '../data/deliveryData';

const Earnings = () => {
  // Mock data for weekly distribution
  const chartData = [
    { day: 'Mon', income: 1200 },
    { day: 'Tue', income: 1800 },
    { day: 'Wed', income: 1400 },
    { day: 'Thu', income: 2400 },
    { day: 'Fri', income: 3200 },
    { day: 'Sat', income: 2800 },
    { day: 'Sun', income: 900 },
  ];

  return (
    <PageWrapper>
      <div className="max-w-[1600px] mx-auto space-y-4 pb-8">
        
        {/* Financial Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-[#2A458A] rounded-full"></div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Your <span className="text-[#2A458A]">Earnings</span>
              </h1>
            </div>
            <p className="text-slate-500 font-medium text-xs flex items-center gap-1.5">
               <LuActivity className="text-[#2A458A]" />
               Track your deliveries and income
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs transition-all shadow-sm">
             <LuFileText size={16} />
             Export Report
          </button>
        </div>

        {/* Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <EarningsCard 
            label="Today's Earnings" 
            value={earningsData.today} 
            subtext="3/5 Deliveries completed"
            icon={LuWallet}
            trend={12}
          />
          <EarningsCard 
            label="This Week" 
            value={earningsData.thisWeek} 
            subtext="21 deliveries completed"
            icon={LuCalendar}
            trend={-5}
          />
          <EarningsCard 
            label="Total Lifetime" 
            value={earningsData.total} 
            subtext="Partner since Jan 2026"
            icon={LuAward}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          
          {/* Income Velocity Chart */}
          <div className="xl:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <div>
                   <h3 className="text-slate-900 font-bold text-base">Weekly Earnings</h3>
                   <p className="text-slate-500 text-xs mt-0.5">Your income over the last 7 days</p>
                </div>
                <LuTrendingUp className="text-[#2A458A]" size={20} />
             </div>

             <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height={220}>
                   <BarChart data={chartData}>
                      <Tooltip 
                        cursor={{ fill: 'rgba(24, 157, 145, 0.05)' }}
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }}
                        itemStyle={{ color: '#189D91', fontSize: '14px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="income" radius={[8, 8, 0, 0]}>
                         {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === 4 ? '#189D91' : '#e2e8f0'} />
                         ))}
                      </Bar>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} dy={10} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Commission Intelligence */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-[#2A458A]/10 rounded-xl flex items-center justify-center border border-[#2A458A]/20">
                      <LuTrendingUp className="text-[#2A458A]" size={20} />
                   </div>
                   <div>
                      <h3 className="text-slate-900 font-bold text-base">Earnings Breakdown</h3>
                      <p className="text-slate-500 text-xs mt-0.5">Current incentive structure</p>
                   </div>
                </div>

                <div className="flex-1 space-y-4">
                   <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex justify-between items-center">
                      <div>
                         <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Per Delivery</p>
                         <p className="text-2xl font-bold text-slate-900">₹{earningsData.perOrderCommission}</p>
                      </div>
                      <LuAward className="text-[#2A458A]" size={24} />
                   </div>

                   <div className="space-y-3 px-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                         <span className="text-slate-600">Night Shift Surcharge</span>
                         <span className="text-emerald-600">+₹25.00 Active</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                         <span className="text-slate-600">Distance Premium</span>
                         <span className="text-slate-500">2.4x</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                         <span className="text-slate-600">Weekly Bonus</span>
                         <span className="text-emerald-600">Unlocked</span>
                      </div>
                   </div>
                </div>

                <button className="w-full mt-6 bg-[#189D91] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#137A71] transition-all shadow-sm">
                   Withdraw Earnings
                </button>
             </div>
          </div>
        </div>

        {/* Historical Ledger */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                 <h3 className="text-slate-900 font-bold text-base">Earnings History</h3>
                 <p className="text-slate-500 text-xs mt-0.5">Past payouts and delivery records</p>
              </div>
              <button className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-[#2A458A] hover:border-[#2A458A]/30 rounded-lg transition-all shadow-sm">
                 <LuCalendar size={16} />
              </button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 text-slate-500">
                       <th className="px-5 py-3 text-[10px] uppercase tracking-wider font-semibold border-b border-slate-200">Date</th>
                       <th className="px-5 py-3 text-[10px] uppercase tracking-wider font-semibold border-b border-slate-200">Deliveries</th>
                       <th className="px-5 py-3 text-[10px] uppercase tracking-wider font-semibold border-b border-slate-200">Base Pay</th>
                       <th className="px-5 py-3 text-[10px] uppercase tracking-wider font-semibold border-b border-slate-200 text-right">Total Payout</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {earningsData.recentEarnings.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-5 py-3">
                           <span className="text-xs font-semibold text-slate-900">{item.date}</span>
                        </td>
                        <td className="px-5 py-3">
                           <div className="flex items-center gap-2">
                              <LuPackage size={14} className="text-slate-400 group-hover:text-[#2A458A] transition-colors" />
                              <span className="text-xs font-medium text-slate-700">{item.orders}</span>
                           </div>
                        </td>
                        <td className="px-5 py-3">
                           <span className="text-xs font-medium text-slate-500">₹{earningsData.perOrderCommission}</span>
                        </td>
                        <td className="px-5 py-3 text-right">
                           <span className="text-xs font-bold text-slate-900">₹{item.amount.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Earnings;
