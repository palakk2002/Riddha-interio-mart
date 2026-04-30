import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';
import { 
  LuPackage, 
  LuTags, 
  LuUsers, 
  LuClock, 
  LuTrendingUp, 
  LuSearch, 
  LuArrowRight, 
  LuNavigation, 
  LuTruck,
  LuDollarSign,
  LuBike,
  LuActivity,
  LuCreditCard,
  LuLayoutDashboard
} from 'react-icons/lu';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import api from '../../../shared/utils/api';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [trackId, setTrackId] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data: res } = await api.get('/auth/admin/dashboard-stats');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!trackId.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const { data: res } = await api.get(`/auth/admin/orders/search?query=${trackId}`);
        if (res.success) {
          setSearchResults(res.data);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [trackId]);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/admin/orders/tracking?id=${trackId.trim()}`);
    }
  };

  const COLORS = ['#189D91', '#240046', '#6366f1', '#f59e0b', '#ef4444'];
  const GRADIENTS = ['#189D91', '#240046'];

  const stats = data?.stats || {};
  const chartData = data?.revenueChart || [];
  const recentActivity = data?.recentActivity || [];
  
  const statusPieData = (stats.statusBreakdown || []).map(item => ({
    name: item._id,
    value: item.count
  }));

  const paymentPieData = (stats.paymentBreakdown || []).map(item => ({
    name: item._id || 'COD',
    value: item.count
  }));

  const userTypeData = (stats.userTypeBreakdown || []).map(item => ({
    name: item._id === 'customer' ? 'Individual' : 'Enterpriser',
    count: item.count
  }));

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-display font-black text-[#240046] tracking-tight"
            >
              Control <span className="text-brand-teal">Center</span>
            </motion.h1>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
               Unified Business Intelligence & Operational Oversight
            </p>
          </div>
          
          {/* Quick Track Section */}
          <div className="w-full lg:w-auto relative">
             <form onSubmit={handleTrack} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-teal rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-2xl border border-soft-oatmeal">
                   <LuSearch className="ml-4 text-brand-teal" size={20} />
                   <input 
                      type="text" 
                      placeholder="Search Order ID..." 
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 text-sm font-bold text-deep-espresso px-4 py-2 w-full lg:w-64"
                   />
                   <button 
                      type="submit"
                      className="border border-brand-purple text-brand-purple px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-brand-purple hover:text-white transition-all active:scale-95"
                   >
                      Track <LuArrowRight size={14} />
                   </button>
                </div>
             </form>

             {/* Search Results Dropdown */}
             { (searchResults.length > 0 || isSearching) && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-soft-oatmeal overflow-hidden z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs font-bold text-gray-400 animate-pulse uppercase tracking-widest">
                       Searching...
                    </div>
                  ) : (
                    <div className="divide-y divide-soft-oatmeal/30">
                       {searchResults.map(order => (
                         <div 
                           key={order._id}
                           onClick={() => {
                              setTrackId('');
                              setSearchResults([]);
                              navigate(`/admin/orders/view/${order._id}`);
                           }}
                           className="p-4 hover:bg-soft-oatmeal/10 cursor-pointer transition-colors group"
                         >
                            <div className="flex justify-between items-start mb-1">
                               <p className="text-xs font-black text-brand-purple">#{order._id.toString().slice(-8).toUpperCase()}</p>
                               <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-soft-oatmeal/20">{order.status}</span>
                            </div>
                            <p className="text-[10px] font-bold text-deep-espresso">{order.shippingAddress?.fullName}</p>
                            <p className="text-[10px] font-black text-brand-teal mt-1">₹{order.totalPrice.toLocaleString()}</p>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
             )}
          </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Gross Revenue" 
            value={loading ? '...' : `₹${stats.totalRevenue?.toLocaleString()}`} 
            icon={LuDollarSign} 
            color="bg-brand-purple" 
            onClick={() => navigate('/admin/payments/users')}
          />
          <StatCard 
            label="Total Users" 
            value={loading ? '...' : stats.users} 
            icon={LuUsers} 
            color="bg-brand-teal" 
            onClick={() => navigate('/admin/customers')}
          />
          <StatCard 
            label="Active Sellers" 
            value={loading ? '...' : stats.sellers} 
            icon={LuLayoutDashboard} 
            color="bg-indigo-600" 
            onClick={() => navigate('/admin/sellers/active')}
          />
          <StatCard 
            label="Delivery Fleet" 
            value={loading ? '...' : stats.delivery} 
            icon={LuBike} 
            color="bg-emerald-600" 
            onClick={() => navigate('/admin/delivery')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Revenue Analytics Chart */}
           <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-xl border border-soft-oatmeal p-8">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-xl font-display font-black text-deep-espresso flex items-center gap-2">
                       <LuTrendingUp className="text-brand-teal" /> Revenue Performance
                    </h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">7-Day Financial Trajectory</p>
                 </div>
                 <div className="bg-brand-teal/5 px-4 py-2 rounded-xl border border-brand-teal/10">
                    <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest">Live Feed</span>
                 </div>
              </div>

              <div className="h-[350px] min-h-[350px] w-full">
                 <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                    <AreaChart data={chartData}>
                       <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#189D91" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#189D91" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                       <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                          dy={10}
                       />
                       <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                       />
                       <Tooltip 
                          cursor={{ stroke: '#189D91', strokeWidth: 2 }}
                          contentStyle={{ 
                             borderRadius: '20px', 
                             border: 'none', 
                             boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                             fontSize: '12px',
                             fontWeight: 'black',
                             padding: '12px 16px'
                          }}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#189D91" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorRev)" 
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Operations Matrix */}
           <div className="bg-white rounded-[2.5rem] border border-soft-oatmeal p-8 shadow-xl flex flex-col gap-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">Operations Center</h4>
              
              <div className="space-y-4">
                 <button 
                   onClick={() => navigate('/admin/catalog/add')}
                   className="w-full p-6 bg-soft-oatmeal/20 rounded-[2rem] flex items-center gap-4 hover:bg-brand-purple hover:text-white transition-all group"
                 >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform shadow-sm">
                       <LuPackage size={20} />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest leading-none">Inventory</p>
                       <p className="text-[8px] font-bold opacity-60 mt-1 uppercase">Manage Stock</p>
                    </div>
                 </button>

                 <button 
                   onClick={() => navigate('/admin/delivery/assign')}
                   className="w-full p-6 bg-soft-oatmeal/20 rounded-[2rem] flex items-center gap-4 hover:bg-brand-teal hover:text-white transition-all group"
                 >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform shadow-sm">
                       <LuTruck size={20} />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest leading-none">Dispatcher</p>
                       <p className="text-[8px] font-bold opacity-60 mt-1 uppercase">Assign Fleet</p>
                    </div>
                 </button>

                 <button 
                   onClick={() => navigate('/admin/payments/users')}
                   className="w-full p-6 bg-soft-oatmeal/20 rounded-[2rem] flex items-center gap-4 hover:bg-amber-500 hover:text-white transition-all group"
                 >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform shadow-sm">
                       <LuDollarSign size={20} />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest leading-none">Finances</p>
                       <p className="text-[8px] font-bold opacity-60 mt-1 uppercase">Review Payments</p>
                    </div>
                 </button>
              </div>

              <div className="mt-auto pt-6 border-t border-soft-oatmeal">
                 <button 
                    onClick={() => navigate('/admin/orders/tracking')}
                    className="w-full py-4 px-6 bg-deep-espresso text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-purple transition-all flex items-center justify-center gap-2"
                 >
                    Orders Portal <LuArrowRight size={14} />
                 </button>
              </div>
           </div>
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Order Status Distribution */}
           <div className="bg-white rounded-[2.5rem] shadow-xl border border-soft-oatmeal p-8">
              <h3 className="text-xl font-display font-black text-deep-espresso mb-1">Status Mix</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Real-time order state</p>
              
              <div className="h-[220px] min-h-[220px] w-full relative">
                 <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                    <PieChart>
                       <Pie
                          data={statusPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {statusPieData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-[#240046]">{stats.statusBreakdown?.reduce((a,b) => a + b.count, 0) || 0}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase">Orders</span>
                 </div>
              </div>
           </div>

           {/* Payment Method Distribution */}
           <div className="bg-white rounded-[2.5rem] shadow-xl border border-soft-oatmeal p-8">
              <h3 className="text-xl font-display font-black text-deep-espresso mb-1">Payment Mix</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Preferred channels</p>
              
              <div className="h-[220px] w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={paymentPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {paymentPieData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <LuCreditCard className="text-brand-teal mb-1" size={24} />
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Finance</span>
                 </div>
              </div>
           </div>

           {/* Customer Segmentation */}
           <div className="bg-white rounded-[2.5rem] shadow-xl border border-soft-oatmeal p-8">
              <h3 className="text-xl font-display font-black text-deep-espresso mb-1">User Base</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">Audience segments</p>
              
              <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userTypeData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                       <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                       />
                       <YAxis axisLine={false} tickLine={false} hide />
                       <Tooltip 
                          cursor={{ fill: '#f1f5f9' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                       />
                       <Bar 
                          dataKey="count" 
                          fill="#240046" 
                          radius={[8, 8, 0, 0]} 
                          barSize={40}
                       />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Operational Flow Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-soft-oatmeal p-8 overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h3 className="text-xl font-display font-black text-deep-espresso flex items-center gap-2">
                    <LuActivity className="text-brand-teal" /> Operations Stream
                 </h3>
                 <p className="text-xs text-brand-teal font-black uppercase tracking-widest mt-1">Real-time event ledger</p>
              </div>
              <button 
                 onClick={() => navigate('/admin/activity')}
                 className="px-6 py-2.5 border border-soft-oatmeal rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-teal hover:bg-brand-teal hover:text-white transition-all shadow-sm"
              >
                 Full Activity Log
              </button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-soft-oatmeal/50">
                       <th className="pb-6 px-4">Order Entity</th>
                       <th className="pb-6 px-4">Stakeholder</th>
                       <th className="pb-6 px-4">Event Status</th>
                       <th className="pb-6 px-4">Value</th>
                       <th className="pb-6 px-4 text-right">Timestamp</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-soft-oatmeal/30">
                    {recentActivity.map((item) => (
                       <tr 
                          key={item.id} 
                          onClick={() => item.orderId && navigate(`/admin/orders/view/${item.orderId}`)}
                          className="group hover:bg-soft-oatmeal/10 transition-colors cursor-pointer"
                        >
                          <td className="py-6 px-4">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-brand-teal group-hover:scale-150 transition-transform"></div>
                                <span className="font-black text-[#240046] text-xs tracking-tight">{item.target}</span>
                             </div>
                          </td>
                          <td className="py-6 px-4 font-bold text-gray-600 text-xs">{item.user}</td>
                          <td className="py-6 px-4">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                item.action.includes('Delivered') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                item.action.includes('Shipped') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                'bg-brand-purple/5 text-brand-purple border-brand-purple/10'
                             }`}>
                                {item.action}
                             </span>
                          </td>
                          <td className="py-6 px-4 font-black text-deep-espresso text-xs">₹{item.amount?.toLocaleString()}</td>
                          <td className="py-6 px-4 text-[10px] font-bold text-gray-400 uppercase text-right">
                             {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {recentActivity.length === 0 && !loading && (
                 <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                    No operational data available for this cycle
                 </div>
              )}
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
