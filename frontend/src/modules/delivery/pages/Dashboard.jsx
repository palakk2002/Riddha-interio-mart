import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { LuPackage, LuClock, LuCheck, LuTrendingUp, LuWallet, LuPercent } from 'react-icons/lu';
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

  const partnerStatus = user?.status || 'Offline';

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch Profile Status
      const { data: profileData } = await api.get('/delivery/me');
      if (profileData.success) {
        setUser(prev => ({ 
          ...prev, 
          ...profileData.data,
          token: prev?.token 
        }));
      }

      // Fetch Analytics
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
    if (user?.approvalStatus !== 'Approved') {
      alert('Verification Pending: You can go online once your account is verified by the admin.');
      return;
    }
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
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">
              Partner Dashboard
            </h1>
            <p className="text-dusty-cocoa font-bold text-xs uppercase tracking-widest mt-2">
              Welcome back, {user?.fullName || 'Partner'}! Here's your delivery summary.
            </p>
          </div>
          
          {/* Status Toggle */}
          <div className="bg-white border text-deep-espresso border-soft-oatmeal p-4 rounded-[2rem] flex items-center gap-4 shadow-sm">
             <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest text-warm-sand">{partnerStatus === 'Available' ? 'Online' : 'Offline'}</span>
               <span className="text-xs font-bold">{partnerStatus === 'Available' ? 'Ready for Work' : 'Currently Resting'}</span>
             </div>
             <button 
               onClick={toggleStatus}
               disabled={updating}
               className={`relative inline-flex h-10 w-20 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#001B4E] focus:ring-offset-2 ${partnerStatus === 'Available' ? 'bg-[#001B4E]' : 'bg-soft-oatmeal'}`}
             >
               <span className={`pointer-events-none inline-block h-9 w-9 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${partnerStatus === 'Available' ? 'translate-x-10' : 'translate-x-0'}`} />
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Assigned" 
            value={loading ? '-' : stats.totalAssigned} 
            icon={LuPackage} 
            color="bg-warm-sand" 
          />
          <StatCard 
            label="Active Pending" 
            value={loading ? '-' : stats.pendingDeliveries} 
            icon={LuClock} 
            color="bg-soft-oatmeal" 
          />
          <StatCard 
            label="Completed" 
            value={loading ? '-' : stats.completedDeliveries} 
            icon={LuCheck} 
            color="bg-dusty-cocoa" 
          />
          <StatCard 
            label="Total Earnings" 
            value={loading ? '-' : `₹${earnings.totalEarnings.toLocaleString()}`} 
            icon={LuWallet} 
            color="bg-deep-espresso" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Deliveries */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-soft-oatmeal overflow-hidden flex flex-col">
            <div className="p-6 border-b border-soft-oatmeal flex items-center justify-between">
              <h3 className="text-xl font-display font-bold flex items-center gap-2 text-deep-espresso">
                <LuTrendingUp className="text-warm-sand" /> Recent Deliveries
              </h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-soft-oatmeal/10">
                    <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest">Date Assigned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-oatmeal/50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-xs font-bold text-warm-sand uppercase tracking-widest">
                        Loading deliveries...
                      </td>
                    </tr>
                  ) : recentDeliveries.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-xs font-bold text-warm-sand uppercase tracking-widest">
                        No deliveries assigned yet
                      </td>
                    </tr>
                  ) : (
                    recentDeliveries.map((order) => (
                      <tr key={order.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                        <td className="px-6 py-4 text-sm font-bold text-deep-espresso">#{order.id}</td>
                        <td className="px-6 py-4 text-sm text-dusty-cocoa">{order.customerName}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-warm-sand font-medium">
                          {new Date(order.dateTime).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance & Cash to Deposit */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#001B4E] to-[#002b7a] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                    <LuPercent size={24} className="text-[#A29A88]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold leading-tight">Success Rate</h3>
                    <p className="text-white/60 text-xs font-bold tracking-widest uppercase mt-1">Performance Matrix</p>
                  </div>
                </div>
                
                <div className="flex items-end justify-between">
                  <span className="text-5xl font-black">{performance.successRate}%</span>
                  <span className="text-sm font-bold text-[#A29A88] uppercase tracking-wider">{stats.completedDeliveries} / {stats.totalAssigned}</span>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                   <p className="text-white/80 text-xs leading-relaxed font-medium">
                     Average delivery time: <span className="font-bold text-white">{performance.avgDeliveryTimeHours} hours</span>
                   </p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#A29A88]/20 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 relative overflow-hidden">
              <h4 className="text-xs font-black text-rose-900 mb-2 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                Action Required
              </h4>
              <h3 className="text-xl font-display font-bold text-rose-950 mb-1">COD Collections</h3>
              <p className="text-xs text-rose-700/80 mb-4">Amount to be deposited at the hub</p>
              
              <div className="bg-white rounded-xl p-4 border border-rose-100/50 flex justify-between items-center shadow-sm">
                 <span className="font-bold text-dusty-cocoa text-sm">Pending Deposit</span>
                 <span className="font-black text-rose-600 text-lg">₹{earnings.codToDeposit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
