import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';
import { FiPackage, FiClock, FiCheck, FiTrendingUp, FiBarChart2, FiEye } from 'react-icons/fi';
import { LuWallet } from 'react-icons/lu';
import api from '../../../shared/utils/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    totalRevenue: 0,
    pendingApproval: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      // 1. Fetch Orders
      const { data: orderData } = await api.get('/orders');
      if (orderData.success) {
        const orders = orderData.data;
        const active = orders.filter(o => o.status !== 'Delivered').length;
        const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        
        setStats(prev => ({ 
          ...prev, 
          activeOrders: active,
          totalRevenue: revenue
        }));
        setRecentOrders(orders.slice(0, 4));
      }

      // 2. Fetch Products
      const { data: productData } = await api.get('/products/my-products');
      if (productData.success) {
        setStats(prev => ({
          ...prev,
          totalProducts: productData.count,
          pendingApproval: productData.data.filter(p => !p.isActive).length
        }));
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-display font-black text-gray-900 tracking-tighter uppercase italic">
              Merchant <span className="text-red-800">Intelligence</span>
            </h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] mt-3">
              Real-time Business Performance Monitoring
            </p>
          </div>
          <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-4">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-800 shadow-sm">
                <FiBarChart2 size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</p>
                <p className="text-xs font-black text-green-600 uppercase mt-1">Operational</p>
             </div>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Gross Settlement" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={LuWallet} 
            color="bg-gray-900" 
          />
          <StatCard 
            label="Active Pipeline" 
            value={stats.activeOrders} 
            icon={FiClock} 
            color="bg-red-800" 
          />
          <StatCard 
            label="Inventory Hub" 
            value={stats.totalProducts} 
            icon={FiPackage} 
            color="bg-gray-900" 
          />
          <StatCard 
            label="Awaiting Audit" 
            value={stats.pendingApproval} 
            icon={FiCheck} 
            color="bg-red-800" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Orders Overview */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/20 overflow-hidden">
             <div className="px-10 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-black text-gray-900 tracking-widest uppercase text-xs">Recent Transactions</h3>
                <button 
                  onClick={() => navigate('/seller/orders')}
                  className="text-[10px] font-black text-red-800 uppercase tracking-widest hover:underline"
                >
                  View All
                </button>
             </div>
             <div className="divide-y divide-gray-50">
                {loading ? (
                  <div className="p-10 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                    Synchronizing...
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                    No recent data
                  </div>
                ) : recentOrders.map((order) => (
                  <div key={order._id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white transition-all">
                           <FiPackage size={20} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">#{order._id.slice(-8).toUpperCase()}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{order.shippingAddress.fullName}</p>
                        </div>
                     </div>
                     <div className="text-right flex items-center gap-8">
                        <div>
                           <p className="text-sm font-black text-gray-900 tracking-tighter">₹{order.totalPrice.toLocaleString()}</p>
                           <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${order.status === 'Delivered' ? 'text-green-600' : 'text-amber-600'}`}>
                             {order.status}
                           </p>
                        </div>
                        <button 
                          onClick={() => navigate(`/seller/order/${order._id}`)}
                          className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-800 hover:border-red-800 transition-all shadow-sm"
                        >
                           <FiEye size={18} />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Performance Insight Card */}
          <div className="bg-gray-950 rounded-[2.5rem] p-10 text-white border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-black/20">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-red-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-lg shadow-red-900/30">
                <FiTrendingUp size={14} /> Analytics Live
              </div>
              <h3 className="text-4xl font-display font-black leading-tight tracking-tighter italic mb-6">
                PROFITABILITY <br/> <span className="text-red-800">OPTIMIZED.</span>
              </h3>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-widest leading-relaxed max-w-[250px]">
                Your store generated ₹{stats.totalRevenue.toLocaleString()} in total volume. Strategy: Focus on higher volume categories.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/seller/orders')}
              className="mt-10 relative z-10 bg-white text-gray-950 font-black py-4 px-8 rounded-2xl w-full transition-all hover:bg-red-800 hover:text-white hover:-translate-y-1 active:scale-95 shadow-xl text-[10px] uppercase tracking-[0.2em]"
            >
              Examine Traffic
            </button>

            {/* Decorative background circle */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-800/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
