import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { 
  LuPackage, 
  LuClock, 
  LuCheck, 
  LuTrendingUp, 
  LuWallet, 
  LuPercent, 
  LuZap, 
  LuNavigation, 
  LuUsers, 
  LuTriangleAlert,
  LuMapPin,
  LuArrowRight,
  LuLayoutGrid,
  LuActivity,
  LuSearch,
  LuFilter,
  LuTruck
} from 'react-icons/lu';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../../../shared/utils/api';
import { useUser } from '../../user/data/UserContext';

const Dashboard = () => {
  const { user, setUser } = useUser();
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [analytics, setAnalytics] = useState({
    stats: {
      totalAssigned: 0,
      completedDeliveries: 0,
      pendingDeliveries: 0,
      rejectedDeliveries: 0
    },
    earnings: {
      totalEarnings: 0,
      codToDeposit: 0
    },
    performance: {
      successRate: 0,
      avgDeliveryTimeHours: 0
    },
    recentDeliveries: []
  });

  // Mock data for charts - keeping it realistic for logistics
  const performanceData = [
    { name: 'Mon', completed: 12, rejected: 1 },
    { name: 'Tue', completed: 18, rejected: 2 },
    { name: 'Wed', completed: 15, rejected: 0 },
    { name: 'Thu', completed: 22, rejected: 3 },
    { name: 'Fri', completed: 30, rejected: 1 },
    { name: 'Sat', completed: 25, rejected: 2 },
    { name: 'Sun', completed: 10, rejected: 0 },
  ];

  const revenueData = [
    { name: '08:00', value: 400 },
    { name: '10:00', value: 1200 },
    { name: '12:00', value: 2400 },
    { name: '14:00', value: 1800 },
    { name: '16:00', value: 3600 },
    { name: '18:00', value: 2800 },
    { name: '20:00', value: 1500 },
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: profileData } = await api.get('/delivery/me');
      if (profileData.success) {
        setUser(prev => ({ ...prev, ...profileData.data }));
      }
      const { data: analyticsData } = await api.get('/delivery/analytics');
      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const toggleStatus = async () => {
    if (user?.approvalStatus !== 'Approved') return;
    setUpdating(true);
    try {
      const nextStatus = user?.status === 'Available' ? 'Offline' : 'Available';
      const { data } = await api.put('/delivery/status', { status: nextStatus });
      if (data.success) {
        setUser({ ...user, status: data.data.status });
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  const { stats, earnings, performance, recentDeliveries } = analytics;

  return (
    <PageWrapper>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
        
        {/* Hero & Operations Command */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-8 bg-[#D63384] rounded-full"></div>
                 <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic">
                    Logistics <span className="text-[#D63384]">Control</span> Center
                 </h1>
              </div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                 <LuActivity className="text-[#D63384] animate-pulse" />
                 Real-time fleet monitoring & dispatch intelligence
              </p>
           </div>

           <div className="flex flex-wrap items-center gap-4">
              <div className="bg-white border border-slate-100 p-2 rounded-2xl flex items-center gap-2 shadow-sm">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                    <LuClock size={14} className="text-[#D63384]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Shift: 08h 12m</span>
                 </div>
                 <button 
                   onClick={toggleStatus}
                   disabled={updating}
                   className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all ${
                     user?.status === 'Available' 
                       ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
                       : 'bg-slate-100 text-slate-400 border-slate-200'
                   }`}
                 >
                    <div className={`w-2 h-2 rounded-full ${user?.status === 'Available' ? 'bg-white animate-pulse' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                       {user?.status === 'Available' ? 'System Online' : 'System Offline'}
                    </span>
                 </button>
              </div>
           </div>
        </div>

        {/* Premium KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
           {[
             { label: 'Total Missions', value: stats.totalAssigned, icon: LuPackage, trend: '+12.5%', color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'Active Routes', value: stats.pendingDeliveries, icon: LuNavigation, trend: 'Normal', color: 'text-amber-600', bg: 'bg-amber-50' },
             { label: 'Success Rate', value: `${performance.successRate}%`, icon: LuCheck, trend: '+2.1%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
             { label: 'Fleet Rank', value: 'Elite', icon: LuZap, trend: 'Top 5%', color: 'text-pink-600', bg: 'bg-pink-50' },
             { label: 'Net Earnings', value: `₹${earnings.totalEarnings.toLocaleString()}`, icon: LuWallet, trend: '+₹2.4k', color: 'text-slate-900', bg: 'bg-slate-100' },
             { label: 'COD Pipeline', value: `₹${earnings.codToDeposit.toLocaleString()}`, icon: LuTriangleAlert, trend: 'Pay Hub', color: 'text-rose-600', bg: 'bg-rose-50' },
           ].map((card, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
             >
                <div className="flex justify-between items-start mb-4">
                   <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <card.icon size={24} />
                   </div>
                   <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${card.bg} ${card.color} uppercase tracking-tighter`}>{card.trend}</span>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter">{loading ? '---' : card.value}</p>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Live Operations & Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
           
           {/* Live Monitoring Panel */}
           <div className="xl:col-span-2 bg-[#111827] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D63384]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                          <LuNavigation className="text-[#D63384]" size={24} />
                       </div>
                       <div>
                          <h3 className="text-white font-black text-xl tracking-tight uppercase italic">Live Route <span className="text-[#D63384]">Monitoring</span></h3>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">3 Orders in transit • 1 Pickup nearby</p>
                    </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                       <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Link</span>
                    </div>
                 </div>

                 {/* Simulated Map / Route Visualization */}
                 <div className="flex-1 min-h-[300px] bg-slate-900/50 rounded-[2rem] border border-white/5 p-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    
                    {/* Simulated Path */}
                    <svg className="absolute inset-0 w-full h-full p-10 opacity-30">
                       <motion.path 
                         d="M 50 250 Q 150 50 300 200 T 550 150" 
                         fill="none" 
                         stroke="#D63384" 
                         strokeWidth="4" 
                         strokeDasharray="8 8"
                         initial={{ pathLength: 0 }}
                         animate={{ pathLength: 1 }}
                         transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                       />
                    </svg>

                    {/* Markers */}
                    <div className="absolute top-20 left-1/4">
                       <div className="relative">
                          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center border-4 border-[#111827] shadow-xl animate-bounce">
                             <LuPackage size={14} className="text-white" />
                          </div>
                          <div className="absolute top-10 left-0 bg-white p-2 rounded-xl border border-slate-200 shadow-2xl min-w-[120px]">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ORD-7721</p>
                             <p className="text-[10px] font-black text-slate-900">Picked Up</p>
                          </div>
                       </div>
                    </div>

                    <div className="absolute bottom-1/4 right-1/4">
                       <div className="relative">
                          <div className="w-10 h-10 bg-[#D63384] rounded-full flex items-center justify-center border-4 border-[#111827] shadow-2xl scale-110">
                             <LuTruck size={18} className="text-white" />
                          </div>
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#D63384] text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl">
                             In Transit • You
                          </div>
                       </div>
                    </div>

                    {/* Bottom Status Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4">
                       <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                          <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center text-[#D63384]">
                             <LuActivity size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Network Stability</p>
                             <p className="text-xs font-black text-emerald-500 uppercase tracking-tighter leading-none">99.4% Latency Optimize</p>
                          </div>
                       </div>
                       <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                          Expand Map
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Analytics Widget */}
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-slate-900 font-black text-xl tracking-tight uppercase italic">Yield <span className="text-[#D63384]">Flow</span></h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Revenue Performance Matrix</p>
                 </div>
                 <LuTrendingUp className="text-[#D63384]" size={24} />
              </div>

              <div className="flex-1 min-h-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                       <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#D63384" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#D63384" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px', color: '#fff' }}
                         itemStyle={{ color: '#D63384', fontSize: '12px', fontWeight: 'bold' }}
                       />
                       <Area 
                         type="monotone" 
                         dataKey="value" 
                         stroke="#D63384" 
                         strokeWidth={4} 
                         fillOpacity={1} 
                         fill="url(#colorRevenue)" 
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Trip Value</span>
                    <span className="text-sm font-black text-slate-900">₹842.00</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incentive Tier</span>
                    <span className="px-2 py-0.5 bg-pink-50 text-[#D63384] rounded-md text-[8px] font-black uppercase tracking-widest">Gold Partner</span>
                 </div>
                 <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                    View Full Earnings
                 </button>
              </div>
           </div>
        </div>

        {/* Table & Matrix Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           
           {/* Recent Missions Table */}
           <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-slate-900 font-black text-xl tracking-tight uppercase italic">Recent <span className="text-[#D63384]">Missions</span></h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Deployment Log • Last 10 Task</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#D63384] rounded-xl transition-all"><LuSearch size={18} /></button>
                    <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#D63384] rounded-xl transition-all"><LuFilter size={18} /></button>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/50">
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Task ID</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Client Identity</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Dispatch State</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Timestamp</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {loading ? (
                          [...Array(3)].map((_, i) => (
                             <tr key={i} className="animate-pulse">
                                <td colSpan={5} className="px-8 py-6 h-16 bg-slate-50/30"></td>
                             </tr>
                          ))
                       ) : recentDeliveries.length === 0 ? (
                          <tr>
                             <td colSpan={5} className="px-8 py-20 text-center">
                                <div className="flex flex-col items-center gap-3">
                                   <LuActivity className="text-slate-200" size={40} />
                                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No Active Missions Found</p>
                                </div>
                             </td>
                          </tr>
                       ) : (
                          recentDeliveries.map((order) => (
                             <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                                <td className="px-8 py-6">
                                   <span className="text-xs font-black text-slate-900 tracking-tighter">#{order.id}</span>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#D63384] flex items-center justify-center font-black text-[10px]">
                                         {order.customerName.charAt(0)}
                                      </div>
                                      <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{order.customerName}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <StatusBadge status={order.status} />
                                </td>
                                <td className="px-8 py-6">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      {new Date(order.dateTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                   </p>
                                </td>
                                <td className="px-8 py-6">
                                   <button className="p-2 text-slate-400 hover:text-[#D63384] transition-all"><LuArrowRight size={18} /></button>
                                </td>
                             </tr>
                          ))
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Performance Matrix Panel */}
           <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                          <LuPercent className="text-[#D63384]" size={24} />
                       </div>
                       <div>
                          <h3 className="text-white font-black text-xl tracking-tight uppercase italic leading-tight">System <span className="text-[#D63384]">Matrix</span></h3>
                          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">Operational Health Score</p>
                       </div>
                    </div>
                    
                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between items-end mb-2">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fleet Efficiency</span>
                             <span className="text-2xl font-black text-[#D63384] italic">{performance.successRate}%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${performance.successRate}%` }}
                               className="h-full bg-gradient-to-r from-[#D63384] to-[#B6256B]"
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">Avg Arrival</p>
                             <p className="text-lg font-black text-white">{performance.avgDeliveryTimeHours}h</p>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">Reliability</p>
                             <p className="text-lg font-black text-emerald-500">Tier 1</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Hub Deposit Action */}
              <div className="bg-[#D63384] rounded-[2.5rem] p-8 text-white shadow-xl shadow-pink-500/20 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                 
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                       <p className="text-[10px] font-black uppercase tracking-widest">Action Required • Hub Deposit</p>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-2 uppercase italic leading-none">COD Pipeline</h3>
                    <p className="text-white/70 text-xs font-bold leading-relaxed mb-6 uppercase tracking-tight">Funds ready for hub reconciliation</p>
                    
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex justify-between items-center mb-6">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Pending Deposit</span>
                       <span className="text-2xl font-black tracking-tighter">₹{earnings.codToDeposit.toLocaleString()}</span>
                    </div>

                    <button className="w-full bg-white text-[#D63384] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl">
                       Initialize Settlement
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
