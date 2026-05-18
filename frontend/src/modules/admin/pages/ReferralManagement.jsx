import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';
import { FiGift, FiUsers, FiDollarSign, FiSettings, FiCheck, FiX, FiActivity, FiArrowRight } from 'react-icons/fi';
import { LuTrendingUp } from 'react-icons/lu';
import { toast } from 'react-hot-toast';

const ReferralManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEnabled, setIsEnabled] = useState(true);
  const [referralSettings, setReferralSettings] = useState({
    referrerReward: 100,
    newUserReward: 50
  });

  const stats = [
    { label: 'Total Referrals', value: '156', icon: FiUsers, color: 'bg-[var(--color-primary)]' },
    { label: 'Successful Referrals', value: '89', icon: FiCheck, color: 'bg-[var(--color-accent-pink)]' },
    { label: 'Total Rewards Given', value: '₹17,800', icon: FiDollarSign, color: 'bg-emerald-600' },
  ];

  const referralUsers = [
    { id: 1, name: 'Rahul Sharma', code: 'RIDDHA-A1B2', referredBy: 'Priya Patel', status: 'Completed', date: '24 Apr 2026' },
    { id: 2, name: 'Anita Singh', code: 'RIDDHA-C3D4', referredBy: 'Rahul Sharma', status: 'Pending', date: '28 Apr 2026' },
    { id: 3, name: 'Vikram Mehta', code: 'RIDDHA-E5F6', referredBy: 'Sanjay Gupta', status: 'Completed', date: '20 Apr 2026' },
    { id: 4, name: 'Sneha Rao', code: 'RIDDHA-G7H8', referredBy: 'Vikram Mehta', status: 'Pending', date: '29 Apr 2026' },
  ];

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LuTrendingUp },
    { id: 'users', label: 'Referral Users', icon: FiUsers },
    { id: 'settings', label: 'Reward Settings', icon: FiSettings },
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-5 pb-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <FiGift className="text-[var(--color-primary)]" size={20} /> Referral System
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Configure client viral onboarding rewards</p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-lg border border-slate-200/60">
             <div className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${isEnabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/55' : 'bg-rose-50 text-rose-600 border border-rose-100/55'}`}>
               Engine {isEnabled ? 'Active' : 'Disabled'}
             </div>
             <button 
               onClick={() => setIsEnabled(!isEnabled)}
               className={`w-10 h-5.5 rounded-full relative transition-all duration-300 ${isEnabled ? 'bg-[var(--color-primary)]' : 'bg-slate-200'}`}
             >
                <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all duration-300 shadow-sm ${isEnabled ? 'right-0.5' : 'left-0.5'}`} />
             </button>
          </div>
        </div>

        {/* Navigation Tabs (Compact Pill Bar) */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm border border-slate-200/30' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <tab.icon size={14} />
                {tab.label}
             </button>
           ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
           {activeTab === 'dashboard' && (
             <motion.div
               key="dashboard"
               initial={{ opacity: 0, y: 12 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -12 }}
               className="space-y-5"
             >
                {/* Stats cards in grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {stats.map((stat, i) => (
                     <StatCard key={i} {...stat} />
                   ))}
                </div>

                {/* Dashboard layout with zero dark boxes */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-5">
                   {/* Left Side: Referral Pulse */}
                   <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                         <div>
                            <h3 className="text-xs font-bold flex items-center gap-2 text-slate-800">
                               <FiActivity className="text-[var(--color-primary)]" /> Referral Activity Stream
                            </h3>
                            <p className="text-[9px] text-[var(--color-primary)] font-bold tracking-wider uppercase mt-0.5">Real-time conversions</p>
                         </div>
                         <button className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-accent-pink)] border-b border-transparent hover:border-[var(--color-accent-pink)] pb-0.5">
                           Export Logs
                         </button>
                      </div>
                      
                      <div className="divide-y divide-slate-100">
                         {[1, 2, 3].map((item) => (
                           <div key={item} className="flex gap-3 py-3 items-start group first:pt-0 last:pb-0">
                             <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 shadow-[0_0_6px_rgba(24,157,145,0.4)] group-hover:scale-125 transition-transform" />
                             <div className="flex-1">
                               <p className="text-xs font-semibold text-slate-600">
                                 New Referral Completed by <span className="text-slate-800 font-bold">Rahul Sharma</span>
                               </p>
                               <div className="flex items-center gap-2 mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                 <span className="text-[var(--color-primary)]">Reward: ₹100 Issued</span>
                                 <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                 <span>2 mins ago</span>
                                </div>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Right Side: Clean Light Campaign Box (Zero dark color!) */}
                   <div className="bg-gradient-to-br from-teal-50/50 to-pink-50/50 rounded-xl p-5 text-slate-800 border border-slate-200/60 relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[220px]">
                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 bg-white/80 text-[var(--color-primary)] px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border border-teal-200/20 backdrop-blur-sm mb-3">
                          <FiGift size={13} /> Strategy Recommendation
                        </div>
                        <h3 className="text-base font-bold text-slate-800 leading-snug">
                          Referral sign-ups increased by <span className="text-[var(--color-primary)] font-black">18%</span> this period.
                        </h3>
                        <p className="mt-2 text-slate-500 text-[10px] font-semibold leading-relaxed">
                          Your active campaign is performing at high-density conversion levels. Consider boosting parameters for seasonal rewards to expand metrics.
                        </p>
                      </div>
                      
                      <button className="relative z-10 mt-4 bg-[var(--color-primary)] text-white hover:opacity-90 font-bold text-[9px] uppercase tracking-wider py-2 px-4 rounded-lg w-full transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98]">
                        Optimize Referral Caps <FiArrowRight />
                      </button>
                   </div>
                </div>
             </motion.div>
           )}

           {activeTab === 'users' && (
             <motion.div
               key="users"
               initial={{ opacity: 0, x: 12 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -12 }}
               className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden"
             >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/30 border-b border-slate-150">
                          <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">User Name</th>
                          <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">Referral Code</th>
                          <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">Referred By</th>
                          <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                          <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {referralUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/20 transition-colors">
                            <td className="px-4 py-2.5 font-bold text-slate-700 text-xs">{user.name}</td>
                            <td className="px-4 py-2.5 font-bold text-[var(--color-accent-pink)] tracking-wider text-xs uppercase">{user.code}</td>
                            <td className="px-4 py-2.5 font-semibold text-slate-500 text-xs">{user.referredBy}</td>
                            <td className="px-4 py-2.5">
                               <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border tracking-wider ${user.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-amber-50 text-amber-600 border-amber-100/50'}`}>
                                 {user.status}
                               </span>
                            </td>
                            <td className="px-4 py-2.5 font-bold text-slate-400 text-[10px]">{user.date}</td>
                          </tr>
                        ))}
                      </tbody>
                  </table>
                </div>
             </motion.div>
           )}

           {activeTab === 'settings' && (
             <motion.div
               key="settings"
               initial={{ opacity: 0, y: 12 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -12 }}
               className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-5"
             >
                {/* Reward Configuration Left Box */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-6">
                   <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="h-9 w-9 bg-teal-50 rounded-lg flex items-center justify-center text-[var(--color-primary)]">
                        <FiDollarSign size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Reward Settings</h3>
                        <p className="text-[9px] text-[var(--color-primary)] font-bold uppercase tracking-wider">Set payouts for user cycles</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 ml-0.5">Referrer Bonus (₹)</label>
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 font-bold text-xs">₹</span>
                            <input 
                              type="number" 
                              value={referralSettings.referrerReward}
                              onChange={(e) => setReferralSettings({...referralSettings, referrerReward: e.target.value})}
                              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[var(--color-primary)] text-xs font-bold text-slate-800 transition-all" 
                            />
                         </div>
                         <p className="text-[8px] text-slate-400 italic">Given once referred user settles their initial purchase.</p>
                      </div>

                      <div className="space-y-1.5">
                         <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 ml-0.5">Invited User Bonus (₹)</label>
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 font-bold text-xs">₹</span>
                            <input 
                              type="number" 
                              value={referralSettings.newUserReward}
                              onChange={(e) => setReferralSettings({...referralSettings, newUserReward: e.target.value})}
                              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[var(--color-primary)] text-xs font-bold text-slate-800 transition-all" 
                            />
                         </div>
                         <p className="text-[8px] text-slate-400 italic">Disbursed as onboarding checkout coupons.</p>
                      </div>
                   </div>

                   <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={handleSaveSettings}
                        className="bg-[var(--color-primary)] hover:opacity-90 text-white px-6 py-2 rounded-lg font-bold text-[9px] uppercase tracking-wider transition-all shadow-sm active:scale-[0.98]"
                      >
                        Apply Changes
                      </button>
                   </div>
                </div>

                {/* Right Side: Status Details */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 space-y-6">
                   <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-50">Logistics Settings</h4>
                   <div className="p-3.5 rounded-lg border border-dashed border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Referral Core API</span>
                         <span className={`h-2 w-2 rounded-full ${isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal font-medium">
                        Halting coordinates disables front-facing client interfaces immediately.
                      </p>
                   </div>
                   
                   <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                         <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700">Auto-Approve Rewards</span>
                         <div className="w-8 h-4.5 bg-[var(--color-primary)] rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full"></div>
                         </div>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                         <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700">Fraud Telemetry</span>
                         <div className="w-8 h-4.5 bg-[var(--color-primary)] rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full"></div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default ReferralManagement;
