import React from 'react';
import PageWrapper from '../components/PageWrapper';
import EarningsCard from '../components/EarningsCard';
import { LuWallet, LuTrendingUp, LuCalendar, LuAward } from 'react-icons/lu';
import { earningsData } from '../../models/deliveryData';

const Earnings = () => {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">My Earnings</h1>
          <p className="text-warm-sand mt-2">Track your daily income and delivery commissions.</p>
        </div>

        {/* Earnings Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EarningsCard 
            label="Today's Earnings" 
            value={earningsData.today} 
            subtext="3 deliveries completed"
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
            label="Total Earnings" 
            value={earningsData.total} 
            subtext="Since joining Jan 2026"
            icon={LuAward}
          />
        </div>

        {/* Commission Box */}
        <div className="bg-soft-oatmeal/20 border border-soft-oatmeal rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-deep-espresso text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-deep-espresso/10">
              <LuTrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-deep-espresso">Commission Structure</h3>
              <p className="text-sm text-dusty-cocoa">You earn a flat commission per successful delivery.</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-bold text-warm-sand uppercase tracking-widest">Fixed Rate</p>
            <p className="text-3xl font-display font-bold text-deep-espresso">₹{earningsData.perOrderCommission}<span className="text-sm text-warm-sand"> / order</span></p>
          </div>
        </div>

        {/* Recent Earnings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-soft-oatmeal overflow-hidden">
          <div className="p-6 border-b border-soft-oatmeal flex items-center justify-between">
            <h3 className="text-xl font-display font-bold text-deep-espresso">Weekly History</h3>
            <button className="text-xs font-bold text-warm-sand uppercase tracking-wider hover:text-deep-espresso transition-colors">
              Download Statement
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-soft-oatmeal/10">
                  <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest">Orders</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest">Commission</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-oatmeal/50">
                {earningsData.recentEarnings.map((item, idx) => (
                  <tr key={idx} className="hover:bg-soft-oatmeal/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-deep-espresso">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-dusty-cocoa">{item.orders}</td>
                    <td className="px-6 py-4 text-sm text-dusty-cocoa">₹{earningsData.perOrderCommission}</td>
                    <td className="px-6 py-4 text-sm font-bold text-deep-espresso text-right">₹{item.amount}</td>
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
