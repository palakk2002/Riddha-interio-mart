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
    { label: 'Total Referrals', value: '156', icon: FiUsers, color: 'bg-brand-purple' },
    { label: 'Successful Referrals', value: '89', icon: FiCheck, color: 'bg-brand-teal' },
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-[#240046] tracking-tight leading-none">
              Referral <span className="text-[#240046]">System</span>
            </h1>
            <p className="subtitle mt-2">Manage user referrals and reward structures</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-lg border border-soft-oatmeal">
             <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEnabled ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
               System {isEnabled ? 'Active' : 'Disabled'}
             </div>
             <button 
               onClick={() => setIsEnabled(!isEnabled)}
               className={`w-14 h-8 rounded-full relative transition-all duration-300 ${isEnabled ? 'bg-brand-teal' : 'bg-gray-200'}`}
             >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm ${isEnabled ? 'right-1' : 'left-1'}`} />
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/50 p-1 rounded-[1.5rem] border border-soft-oatmeal backdrop-blur-md">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#240046] text-white shadow-xl' : 'text-gray-400 hover:text-[#240046]'}`}
             >
                <tab.icon size={18} />
                {tab.label}
             </button>
           ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
           {activeTab === 'dashboard' && (
             <motion.div
               key="dashboard"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-8"
             >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {stats.map((stat, i) => (
                     <StatCard key={i} {...stat} />
                   ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
                   <div className="bg-white rounded-[2.5rem] shadow-xl border border-soft-oatmeal p-8 md:p-12">
                      <div className="flex items-center justify-between mb-10">
                         <div>
                            <h3 className="text-xl font-display font-bold flex items-center gap-3 text-deep-espresso">
                               <FiActivity className="text-brand-teal" /> Referral Pulse
                            </h3>
                            <p className="text-xs text-brand-teal tracking-widest uppercase mt-1">Latest referral events</p>
                         </div>
                         <button className="text-[10px] font-black uppercase tracking-widest text-brand-purple border-b-2 border-brand-purple/10 pb-1">View All Activity</button>
                      </div>
                      
                      <div className="space-y-8">
                         {[1, 2, 3].map((item) => (
                           <div key={item} className="flex gap-6 items-start group">
                             <div className="w-3 h-3 rounded-full bg-brand-purple mt-2 shadow-[0_0_10px_rgba(153,27,27,0.3)] group-hover:scale-150 transition-transform"></div>
                             <div className="flex-1 pb-6 border-b border-soft-oatmeal/30 last:border-0">
                               <p className="text-sm font-medium text-deep-espresso/60">
                                 <span className="font-black text-deep-espresso text-base">New Referral Completed</span> 
                                 <span className="mx-2">by</span> 
                                 <span className="text-[#240046] font-black">Rahul Sharma</span>
                               </p>
                               <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-brand-teal uppercase tracking-widest">
                                 <span>Reward: ₹100 Issued</span>
                                 <span className="w-1 h-1 rounded-full bg-soft-oatmeal"></span>
                                 <span>2 mins ago</span>
                               </div>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-gradient-to-br from-[#240046] to-black rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[400px]">
                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md mb-8 border border-white/20">
                          <FiGift size={16} /> Strategy Insight
                        </div>
                        <h3 className="text-3xl font-display font-bold leading-tight">
                          Referral conversions are up <span className="text-emerald-400">18%</span> this month.
                        </h3>
                        <p className="mt-6 text-white/50 text-sm font-medium leading-relaxed">
                          The "Spring Luxury" campaign is driving high-quality leads. Consider increasing the Referrer Reward to ₹150 for the next weekend.
                        </p>
                      </div>
                      
                      <button className="relative z-10 bg-white text-deep-espresso font-black text-[10px] uppercase tracking-[0.2em] py-5 px-8 rounded-2xl w-full transition-all hover:bg-brand-teal hover:scale-[1.02] active:scale-95 shadow-xl flex items-center justify-center gap-3">
                        Launch Campaign <FiArrowRight />
                      </button>

                      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-purple/20 rounded-full blur-[100px]"></div>
                   </div>
                </div>
             </motion.div>
           )}

           {activeTab === 'users' && (
             <motion.div
               key="users"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="bg-white rounded-[2.5rem] shadow-xl border border-soft-oatmeal overflow-hidden"
             >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                       <tr className="bg-soft-oatmeal/5 border-b border-soft-oatmeal/10">
                         <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#240046]/40">User Name</th>
                         <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#240046]/40">Referral Code</th>
                         <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#240046]/40">Referred By</th>
                         <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#240046]/40">Status</th>
                         <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#240046]/40">Joined Date</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-soft-oatmeal/10">
                       {referralUsers.map((user) => (
                         <tr key={user.id} className="hover:bg-soft-oatmeal/5 transition-colors">
                           <td className="px-10 py-6 font-bold text-deep-espresso">{user.name}</td>
                           <td className="px-10 py-6 font-black text-brand-purple tracking-widest text-xs uppercase">{user.code}</td>
                           <td className="px-10 py-6 font-medium text-gray-500">{user.referredBy}</td>
                           <td className="px-10 py-6">
                              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] ${user.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                {user.status}
                              </span>
                           </td>
                           <td className="px-10 py-6 font-bold text-deep-espresso/40 text-xs">{user.date}</td>
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
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8"
             >
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-soft-oatmeal p-10 space-y-10">
                   <div className="flex items-center gap-4 mb-2">
                      <div className="h-12 w-12 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-brand-purple">
                        <FiDollarSign size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-deep-espresso uppercase tracking-tight">Reward Configuration</h3>
                        <p className="text-[10px] text-brand-teal font-black uppercase tracking-widest">Adjust monetary rewards for each milestone</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Reward for Referrer (₹)</label>
                         <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                            <input 
                              type="number" 
                              value={referralSettings.referrerReward}
                              onChange={(e) => setReferralSettings({...referralSettings, referrerReward: e.target.value})}
                              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-brand-purple/20 focus:bg-white focus:outline-none text-lg font-black text-deep-espresso transition-all" 
                            />
                         </div>
                         <p className="text-[9px] text-gray-400 italic">Issued after the new user's first order is completed.</p>
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Reward for New User (₹)</label>
                         <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                            <input 
                              type="number" 
                              value={referralSettings.newUserReward}
                              onChange={(e) => setReferralSettings({...referralSettings, newUserReward: e.target.value})}
                              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-soft-oatmeal/10 border-2 border-transparent focus:border-brand-purple/20 focus:bg-white focus:outline-none text-lg font-black text-deep-espresso transition-all" 
                            />
                         </div>
                         <p className="text-[9px] text-gray-400 italic">Applied as a discount on their very first purchase.</p>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-soft-oatmeal/20">
                      <button 
                        onClick={handleSaveSettings}
                        className="bg-brand-purple text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-deep-espresso transition-all shadow-xl shadow-brand-purple/20 active:scale-95"
                      >
                        Update Settings
                      </button>
                   </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl border border-soft-oatmeal p-10 space-y-8">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">System Status</h4>
                   <div className="p-6 rounded-[2rem] border-2 border-dashed border-soft-oatmeal space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-bold text-deep-espresso uppercase tracking-widest">Referral Engine</span>
                         <span className={`h-3 w-3 rounded-full ${isEnabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Disabling the system will hide all referral-related UI components for users and prevent new referral codes from being generated or used.
                      </p>
                   </div>
                   
                   <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between p-4 bg-soft-oatmeal/10 rounded-2xl">
                         <span className="text-[10px] font-black uppercase tracking-widest text-deep-espresso">Auto-Verify Referrals</span>
                         <div className="w-10 h-6 bg-brand-teal rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                         </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-soft-oatmeal/10 rounded-2xl">
                         <span className="text-[10px] font-black uppercase tracking-widest text-deep-espresso">Fraud Detection</span>
                         <div className="w-10 h-6 bg-brand-teal rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
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
