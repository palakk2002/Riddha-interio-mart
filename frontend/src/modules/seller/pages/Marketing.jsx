import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { 
  Megaphone, 
  Tag, 
  Percent, 
  Zap, 
  TrendingUp, 
  Calendar, 
  Users, 
  Plus, 
  ChevronRight, 
  ArrowUpRight,
  Target,
  BarChart3,
  Gift,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('Campaigns');

  const campaigns = [
    { id: 1, title: 'Summer Solstice Sale', type: 'Flash Sale', status: 'Active', reach: '12.4k', conversions: '840', spend: '₹2,500' },
    { id: 2, title: 'New Arrival Boost', type: 'Product Boost', status: 'Scheduled', reach: '0', conversions: '0', spend: '₹1,200' },
  ];

  const coupons = [
    { id: 1, code: 'WELCOME20', discount: '20% OFF', usage: '142/500', expiry: '2024-05-20' },
    { id: 2, code: 'FESTIVE500', discount: '₹500 OFF', usage: '89/200', expiry: '2024-06-10' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4 md:px-0">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Growth Center</h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Deploying advanced merchant marketing strategies</p>
          </div>
          
          <button className="flex items-center gap-2 px-8 py-4 bg-seller-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-seller-primary/20 hover:bg-seller-dark transition-all">
             <Plus size={18} /> Create New Campaign
          </button>
        </div>

        {/* Marketing Hub Tabs */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
           {['Campaigns', 'Coupons', 'Intelligence'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-seller-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
              >
                 {tab}
              </button>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Main Content Area */}
           <div className="lg:col-span-2 space-y-8">
              
              <AnimatePresence mode="wait">
                 {activeTab === 'Campaigns' && (
                   <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="space-y-6"
                   >
                      {campaigns.map((camp, i) => (
                        <div key={i} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-200/40 transition-all">
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex items-center gap-5">
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${camp.status === 'Active' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-amber-500 shadow-lg shadow-amber-500/20'}`}>
                                    {camp.status === 'Active' ? <Zap size={24} /> : <Clock size={24} />}
                                 </div>
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                       <h3 className="text-lg font-black text-slate-900 tracking-tight">{camp.title}</h3>
                                       <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${camp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                          {camp.status}
                                       </span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{camp.type}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
                                 <div className="text-center md:text-left">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Reach</p>
                                    <h4 className="text-lg font-black text-slate-900">{camp.reach}</h4>
                                 </div>
                                 <div className="text-center md:text-left">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Spend</p>
                                    <h4 className="text-lg font-black text-slate-900">{camp.spend}</h4>
                                 </div>
                                 <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-seller-primary hover:bg-white transition-all border border-transparent hover:border-slate-100">
                                    <ChevronRight size={18} />
                                 </button>
                              </div>
                           </div>
                        </div>
                      ))}

                      {/* Empty Placeholder Style */}
                      <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:border-seller-primary/30 transition-all">
                         <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 group-hover:bg-seller-primary/5 group-hover:text-seller-primary transition-all">
                            <Megaphone size={32} />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">New Growth Strategy</h4>
                            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">No additional campaigns scheduled</p>
                         </div>
                      </div>
                   </motion.div>
                 )}

                 {activeTab === 'Coupons' && (
                   <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="grid grid-cols-1 md:grid-cols-2 gap-6"
                   >
                      {coupons.map((coupon, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-24 h-24 bg-seller-primary/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
                           <div className="relative z-10 space-y-6">
                              <div className="flex items-center justify-between">
                                 <div className="w-12 h-12 bg-seller-primary/10 rounded-2xl flex items-center justify-center text-seller-primary">
                                    <Tag size={20} />
                                 </div>
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{coupon.expiry}</span>
                              </div>
                              <div className="space-y-1">
                                 <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{coupon.code}</h3>
                                 <p className="text-xs font-black text-seller-primary uppercase tracking-widest">{coupon.discount}</p>
                              </div>
                              <div className="space-y-2">
                                 <div className="flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Redemption Rate</span>
                                    <span>{coupon.usage}</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-seller-primary rounded-full" style={{ width: '40%' }}></div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      ))}
                   </motion.div>
                 )}
              </AnimatePresence>

           </div>

           {/* Performance Sidebar */}
           <div className="space-y-8">
              <div className="bg-gradient-to-br from-seller-primary via-[#D63384] to-[#B6256B] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-seller-primary/30">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px] -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-[40px] -ml-16 -mb-16"></div>
                  
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                           <BarChart3 size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-black tracking-tight uppercase italic !text-white">Analytics</h3>
                     </div>
                     <div className="space-y-5">
                        {[
                          { label: 'Marketing ROI', val: '4.2x', trend: '+12%' },
                          { label: 'Avg conversion', val: '5.8%', trend: '+0.4%' },
                          { label: 'Cust. Acquisition', val: '₹142', trend: '-₹12' },
                        ].map((stat, i) => (
                          <div key={i} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0 last:pb-0">
                             <div>
                                <p className="text-[9px] font-black !text-white/90 uppercase tracking-[0.15em] mb-1.5">{stat.label}</p>
                                <p className="text-lg font-black tracking-tight !text-white">{stat.val}</p>
                             </div>
                             <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] font-black text-white bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">{stat.trend}</span>
                                <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                                   <div className="h-full bg-white" style={{ width: '60%' }}></div>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-seller-primary/5 rounded-full blur-[50px] -mr-16 -mt-16 transition-all duration-700"></div>
                  <div className="relative z-10 space-y-5">
                     <div className="w-11 h-11 bg-seller-primary/10 rounded-xl flex items-center justify-center text-seller-primary">
                        <Target size={22} />
                     </div>
                     <div className="space-y-1">
                       <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none">Smart Targeting</h4>
                       <p className="text-[8px] text-slate-400 leading-relaxed font-black uppercase tracking-[0.2em]">AI-Driven Merchant Ads</p>
                     </div>
                     <button className="w-full py-3 bg-seller-primary text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-seller-primary/20 hover:bg-seller-dark transition-all">
                        Optimize Audience
                     </button>
                  </div>
               </div>
           </div>

        </div>

        {/* Global Insight Banner */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 shrink-0">
                 <TrendingUp size={32} />
              </div>
              <div className="text-center md:text-left space-y-2">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Market Share Growth</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-sm">Your brand visibility has increased by 14% in the last 30 days. Deploy more flash sales to capture the current trend.</p>
              </div>
           </div>
           <button className="px-10 py-4 bg-seller-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-seller-dark transition-all shadow-lg shadow-seller-primary/20">
              Analyze Trends
           </button>
        </div>

      </div>
    </PageWrapper>
  );
};

export default Marketing;
