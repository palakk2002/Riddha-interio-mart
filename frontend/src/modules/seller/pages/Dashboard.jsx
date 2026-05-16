import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';
import { FiPackage, FiClock, FiCheck, FiTrendingUp, FiBarChart2, FiAlertTriangle, FiCalendar } from 'react-icons/fi';
import { LuWallet } from 'react-icons/lu';
import api from '../../../shared/utils/api';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [analytics, setAnalytics] = useState({
    stats: {
      totalRevenue: 0,
      periodRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0
    },
    revenueTrends: [],
    topProducts: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/seller/analytics?timeRange=${timeRange}`);
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const { stats, revenueTrends, topProducts, lowStockProducts } = analytics;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 tracking-tighter uppercase italic">
              Merchant <span className="text-red-800">Intelligence</span>
            </h1>
            <p className="text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mt-3">
              Real-time Business Performance Monitoring
            </p>
          </div>
          
          <div className="flex items-center gap-4 self-center md:self-end">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest py-3 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent cursor-pointer shadow-sm"
              >
                <option value="today">Today</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400 w-4 h-4" />
              </div>
            </div>

            <div className="bg-gray-50 px-4 md:px-6 py-3 rounded-xl border border-gray-100 flex items-center gap-4 hidden sm:flex">
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-800 shadow-sm">
                  <FiBarChart2 size={20} />
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</p>
                  <p className="text-xs font-black text-green-600 uppercase mt-1">Operational</p>
               </div>
            </div>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            label="Gross Settlement (All Time)" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={LuWallet} 
            color="bg-gray-900" 
          />
          <StatCard 
            label="Period Revenue" 
            value={`₹${stats.periodRevenue.toLocaleString()}`} 
            icon={FiTrendingUp} 
            color="bg-red-800" 
          />
          <StatCard 
            label="Total Orders (Period)" 
            value={stats.totalOrders} 
            icon={FiPackage} 
            color="bg-gray-900" 
          />
          <StatCard 
            label="Pending Fulfillment" 
            value={stats.pendingOrders} 
            icon={FiClock} 
            color="bg-red-800" 
          />
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-6 md:p-8">
          <h3 className="font-black text-gray-900 tracking-widest uppercase text-[10px] md:text-xs mb-6">Revenue Trends</h3>
          <div className="h-72 w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                Loading Chart...
              </div>
            ) : revenueTrends.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                No revenue data for this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#991b1b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#991b1b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }}
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    itemStyle={{ color: '#991b1b', fontWeight: 'bold' }}
                    labelStyle={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#991b1b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          {/* Top Selling Products */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
             <div className="px-6 md:px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-black text-gray-900 tracking-widest uppercase text-[10px] md:text-xs">Top Selling Products</h3>
             </div>
             <div className="divide-y divide-gray-50">
                {loading ? (
                  <div className="p-10 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                    Synchronizing...
                  </div>
                ) : topProducts.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                    No sales data available
                  </div>
                ) : topProducts.map((product) => (
                  <div key={product._id} className="p-4 md:p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                           <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="text-xs md:text-sm font-black text-gray-900 tracking-tight line-clamp-1">{product.name}</p>
                           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{product.totalQuantity} Units Sold</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs md:text-sm font-black text-red-800 tracking-tighter">₹{product.totalRevenue.toLocaleString()}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 bg-red-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <FiAlertTriangle size={14} />
              </div>
              <h3 className="font-black text-red-900 tracking-widest uppercase text-[10px] md:text-xs">Low Stock Alerts</h3>
            </div>
            
            <div className="divide-y divide-gray-50 flex-1">
              {loading ? (
                 <div className="p-10 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                   Checking inventory...
                 </div>
              ) : lowStockProducts.length === 0 ? (
                 <div className="p-10 text-center text-green-600 font-bold uppercase text-[10px] tracking-widest flex flex-col items-center gap-2">
                   <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                     <FiCheck size={20} />
                   </div>
                   Inventory looks good!
                 </div>
              ) : lowStockProducts.map(product => (
                <div key={product._id} className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                    <p className="text-[10px] font-black text-red-600 mt-1 uppercase tracking-wider">{product.countInStock} Left in Stock</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button 
                onClick={() => navigate('/seller/my-products')}
                className="w-full py-3 rounded-xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-800 transition-colors"
              >
                Manage Inventory
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
