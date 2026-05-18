import React from 'react';
import PageWrapper from '../components/PageWrapper';
import EarningsCard from '../components/EarningsCard';
import { 
  LuWallet, 
  LuTrendingUp, 
  LuCalendar, 
  LuAward, 
  LuFileText,
  LuActivity
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
      <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
        
        {/* Financial Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#D63384] rounded-full"></div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic">
                Revenue <span className="text-[#D63384]">Stream</span>
              </h1>
            </div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
               <LuActivity className="text-[#D63384] animate-pulse" />
               Automated settlement & commission intelligence
            </p>
          </div>
          
          <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl">
             <LuFileText size={18} />
             Export Financial Log
          </button>
        </div>

        {/* Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <EarningsCard 
            label="Daily Velocity" 
            value={earningsData.today} 
            subtext="3/5 Targeted Missions"
            icon={LuWallet}
            trend={12}
          />
          <EarningsCard 
            label="Weekly Aggregation" 
            value={earningsData.thisWeek} 
            subtext="21 deployments completed"
            icon={LuCalendar}
            trend={-5}
          />
          <EarningsCard 
            label="Lifetime Yield" 
            value={earningsData.total} 
            subtext="Fleet Partner since Jan 2026"
            icon={LuAward}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Income Velocity Chart */}
          <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-slate-900 font-black text-xl tracking-tight uppercase italic">Income <span className="text-[#D63384]">Velocity</span></h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Distribution over active cycles</p>
                </div>
                <LuTrendingUp className="text-[#D63384]" size={24} />
             </div>

             <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                      <Tooltip 
                        cursor={{ fill: 'rgba(214, 51, 132, 0.05)' }}
                        contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px', color: '#fff' }}
                        itemStyle={{ color: '#D63384', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="income" radius={[12, 12, 0, 0]}>
                         {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === 4 ? '#D63384' : '#1F2937'} />
                         ))}
                      </Bar>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} dy={10} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Commission Intelligence */}
          <div className="bg-[#111827] rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-white/5">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#D63384]/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
             
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                      <LuTrendingUp className="text-[#D63384]" size={24} />
                   </div>
                   <div>
                      <h3 className="text-white font-black text-xl tracking-tight uppercase italic leading-tight">Contract <span className="text-[#D63384]">Model</span></h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Tier-based incentives active</p>
                   </div>
                </div>

                <div className="flex-1 space-y-6">
                   <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex justify-between items-center">
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Fixed Multiplier</p>
                         <p className="text-3xl font-black text-white italic">₹{earningsData.perOrderCommission}<span className="text-xs text-[#D63384] not-italic"> / UNIT</span></p>
                      </div>
                      <LuAward className="text-[#D63384]" size={32} />
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                         <span className="text-slate-400">Night Shift Premium</span>
                         <span className="text-emerald-500 uppercase tracking-widest">+₹25.00 Active</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold">
                         <span className="text-slate-400">Distance Surcharge</span>
                         <span className="text-slate-200">Scale 2.4x</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold">
                         <span className="text-slate-400">Performance Bonus</span>
                         <span className="text-emerald-500 uppercase tracking-widest">Unlocked</span>
                      </div>
                   </div>
                </div>

                <button className="w-full mt-10 bg-[#D63384] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#B6256B] transition-all shadow-xl shadow-pink-500/20">
                   Request Settlement
                </button>
             </div>
          </div>
        </div>

        {/* Historical Ledger */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
           <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                 <h3 className="text-slate-900 font-black text-xl tracking-tight uppercase italic">Financial <span className="text-[#D63384]">Ledger</span></h3>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Historical Yield Verification Log</p>
              </div>
              <button className="p-3 bg-slate-50 text-slate-400 hover:text-[#D63384] rounded-xl transition-all">
                 <LuCalendar size={20} />
              </button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50">
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Settlement Date</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Deployment Units</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Unit Commission</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">Net Aggregate</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {earningsData.recentEarnings.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-all group">
                        <td className="px-8 py-6">
                           <span className="text-xs font-black text-slate-900 tracking-tighter uppercase">{item.date}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <LuPackage size={14} className="text-[#D63384]" />
                              <span className="text-xs font-black text-slate-600">{item.orders} Deployments</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-xs font-black text-slate-400">₹{earningsData.perOrderCommission}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <span className="text-sm font-black text-slate-900 tracking-tighter">₹{item.amount.toLocaleString()}</span>
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
