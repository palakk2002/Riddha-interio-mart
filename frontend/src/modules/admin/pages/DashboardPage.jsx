import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';
import { LuPackage, LuTags, LuUsers, LuClock, LuTrendingUp, LuSearch, LuArrowRight, LuNavigation, LuTruck } from 'react-icons/lu';
import api from '../../../shared/utils/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    sellers: 0,
    activeDeliveries: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [trackId, setTrackId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data: res } = await api.get('/auth/admin/dashboard-stats');
        
        if (res.success) {
          setStats({
            products: res.data.products || 0,
            categories: res.data.categories || 0,
            sellers: res.data.sellers || 0,
            activeDeliveries: res.data.activeDeliveries || 0
          });

          // Process recent activity from backend
          const activity = (res.data.recentActivity || []).map(item => ({
            ...item,
            time: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setRecentActivity(activity);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/admin/orders/tracking?id=${trackId.trim()}`);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-deep-espresso">Admin <span className="text-warm-sand">Overview</span></h1>
            <p className="text-warm-sand/60 text-sm md:text-base font-medium uppercase tracking-[0.2em]">Real-time system performance & logistics</p>
          </div>
          
          {/* Quick Track Section */}
          <div className="w-full md:w-auto">
             <form onSubmit={handleTrack} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-800 to-warm-sand rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative flex items-center bg-white rounded-2xl p-1 shadow-xl border border-soft-oatmeal">
                   <LuSearch className="ml-4 text-warm-sand" size={20} />
                   <input 
                      type="text" 
                      placeholder="Track my product order..." 
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 text-sm font-bold text-deep-espresso px-4 py-2 w-48 lg:w-64"
                   />
                   <button 
                     type="submit"
                     className="bg-red-800 text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-deep-espresso transition-all active:scale-95"
                   >
                      Track <LuArrowRight size={14} />
                   </button>
                </div>
             </form>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Live Catalog" 
            value={loading ? '...' : stats.products} 
            icon={LuPackage} 
            color="bg-red-800" 
          />
          <StatCard 
            label="Collections" 
            value={loading ? '...' : stats.categories} 
            icon={LuTags} 
            color="bg-red-800" 
          />
          <StatCard 
            label="Active Sellers" 
            value={loading ? '...' : stats.sellers} 
            icon={LuUsers} 
            color="bg-red-800" 
          />
          <StatCard 
            label="Moving Now" 
            value={loading ? '...' : stats.activeDeliveries} 
            icon={LuNavigation} 
            color="bg-emerald-600" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          {/* Recent Activity Section */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-soft-oatmeal overflow-hidden p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-display font-bold flex items-center gap-3 text-deep-espresso">
                  <LuClock className="text-warm-sand" /> Activity Pulse
                </h3>
                <p className="text-xs text-warm-sand tracking-widest uppercase mt-1">Latest system events</p>
              </div>
              <button 
                onClick={() => navigate('/admin/activity')}
                className="px-4 py-2 border border-soft-oatmeal rounded-xl text-[10px] font-black uppercase tracking-widest text-warm-sand hover:bg-soft-oatmeal/20 transition-all"
              >
                Full Log
              </button>
            </div>
            
            <div className="space-y-6">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-6 items-start animate-pulse">
                    <div className="w-3 h-3 rounded-full bg-soft-oatmeal mt-2"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-soft-oatmeal rounded w-3/4"></div>
                      <div className="h-3 bg-soft-oatmeal/50 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <div key={item.id} className="flex gap-6 items-start group">
                    <div className="w-3 h-3 rounded-full bg-red-800 mt-2 shadow-[0_0_10px_rgba(153,27,27,0.3)] group-hover:scale-150 transition-transform"></div>
                    <div className="flex-1 pb-6 border-b border-soft-oatmeal/30 last:border-0">
                      <p className="text-sm font-medium text-deep-espresso/60">
                        <span className="font-black text-deep-espresso text-base">{item.action}</span> 
                        <span className="mx-2">for</span> 
                        <span className="text-red-800 font-black">{item.target}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-warm-sand uppercase tracking-widest">
                        <span>Initiated by {item.user}</span>
                        <span className="w-1 h-1 rounded-full bg-soft-oatmeal"></span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-warm-sand font-medium">No recent activity detected.</p>
              )}
            </div>
          </div>

          {/* Logistics Insight */}
          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-br from-deep-espresso to-black rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[350px]">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md mb-6 border border-white/20">
                  <LuTrendingUp size={16} /> Market Sentiment
                </div>
                <h3 className="text-3xl font-display font-bold leading-tight">
                  Logistics efficiency is up <span className="text-emerald-400">24%</span>
                </h3>
                <p className="mt-4 text-white/50 text-sm font-medium leading-relaxed">
                  Real-time GPS tracking integration has reduced average delivery cycles. Check the monitoring portal for detailed heatmaps.
                </p>
              </div>
              
              <button 
                onClick={() => navigate('/admin/orders/tracking')}
                className="relative z-10 bg-white text-deep-espresso font-black text-[10px] uppercase tracking-[0.2em] py-5 px-8 rounded-2xl w-full transition-all hover:bg-warm-sand hover:scale-[1.02] active:scale-95 shadow-xl"
              >
                Go to Monitoring Portal
              </button>

              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-red-800/20 rounded-full blur-[100px]"></div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-[2rem] border border-soft-oatmeal p-8 shadow-sm">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-warm-sand mb-6">Quick Infrastructure</h4>
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => navigate('/admin/catalog/add')}
                    className="p-4 bg-soft-oatmeal/20 rounded-[1.5rem] flex flex-col items-center gap-2 hover:bg-red-800 hover:text-white transition-all group"
                  >
                     <LuPackage size={20} className="group-hover:scale-110 transition-transform" />
                     <span className="text-[9px] font-black uppercase tracking-widest">New Catalog</span>
                  </button>
                  <button 
                    onClick={() => navigate('/admin/delivery/assign')}
                    className="p-4 bg-soft-oatmeal/20 rounded-[1.5rem] flex flex-col items-center gap-2 hover:bg-red-800 hover:text-white transition-all group"
                  >
                     <LuTruck size={20} className="group-hover:scale-110 transition-transform" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Assign Order</span>
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
