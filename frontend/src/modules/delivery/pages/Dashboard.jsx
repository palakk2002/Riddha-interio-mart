import React from 'react';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { LuPackage, LuClock, LuCheck, LuTrendingUp, LuWallet } from 'react-icons/lu';
import { initialAvailableOrders, initialMyOrders, earningsData } from '../data/deliveryData';

import api from '../../../shared/utils/api';
import { useUser } from '../../user/data/UserContext';

const Dashboard = () => {
  const { user, setUser } = useUser();
  const [updating, setUpdating] = React.useState(false);
  const partnerStatus = user?.status || 'Offline';

  React.useEffect(() => {
    const syncProfile = async () => {
      try {
        const { data } = await api.get('/delivery/me');
        if (data.success) {
          // IMPORTANT: Preserve the existing token when updating user profile data
          setUser(prev => ({ 
            ...prev, 
            ...data.data,
            token: prev?.token // Explicitly keep the token
          }));
        }
      } catch (err) {
        console.error('Failed to sync partner profile:', err);
      }
    };
    syncProfile();
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

  const recentDeliveries = [
    ...initialMyOrders,
    { id: "ORD-1122", customerName: "Anjali Devi", status: "Delivered", dateTime: "05 Apr, 06:15 PM" },
    { id: "ORD-4433", customerName: "Karan Johar", status: "Delivered", dateTime: "05 Apr, 02:40 PM" },
  ].slice(0, 5);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso uppercase italic tracking-tight">
              Partner <span className="text-warm-sand">Dashboard</span>
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
               className={`relative inline-flex h-10 w-20 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 ${partnerStatus === 'Available' ? 'bg-red-800' : 'bg-soft-oatmeal'}`}
             >
               <span className={`pointer-events-none inline-block h-9 w-9 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${partnerStatus === 'Available' ? 'translate-x-10' : 'translate-x-0'}`} />
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Orders" 
            value="156" 
            icon={LuPackage} 
            color="bg-warm-sand" 
          />
          <StatCard 
            label="Pending" 
            value={initialMyOrders.length} 
            icon={LuClock} 
            color="bg-soft-oatmeal" 
          />
          <StatCard 
            label="Completed" 
            value="142" 
            icon={LuCheck} 
            color="bg-dusty-cocoa" 
          />
          <StatCard 
            label="Earnings" 
            value={`₹${earningsData.total}`} 
            icon={LuWallet} 
            color="bg-deep-espresso" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Deliveries */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-soft-oatmeal overflow-hidden">
            <div className="p-6 border-b border-soft-oatmeal flex items-center justify-between">
              <h3 className="text-xl font-display font-bold flex items-center gap-2 text-deep-espresso">
                <LuTrendingUp className="text-warm-sand" /> Recent Deliveries
              </h3>
              <button className="text-xs font-bold text-warm-sand uppercase tracking-wider hover:text-deep-espresso transition-colors">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-soft-oatmeal/10">
                    <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-warm-sand uppercase tracking-widest">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-oatmeal/50">
                  {recentDeliveries.map((order) => (
                    <tr key={order.id} className="hover:bg-soft-oatmeal/5 transition-colors group">
                      <td className="px-6 py-4 text-sm font-bold text-deep-espresso">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-dusty-cocoa">{order.customerName}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-warm-sand font-medium">{order.dateTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats/Tip */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-deep-espresso to-dusty-cocoa rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                  <LuCheck size={24} className="text-warm-sand" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 leading-tight">Partner Tip</h3>
                <p className="text-soft-oatmeal/80 text-sm leading-relaxed">
                  Completing 5 more deliveries today will unlock a bonus of ₹200! Keep up the great work.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-warm-sand/20 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-warm-sand/10 border border-warm-sand/20 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-deep-espresso mb-4 uppercase tracking-wider">Today's Goal</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-deep-espresso">Deliveries</span>
                  <span className="text-warm-sand">3/8</span>
                </div>
                <div className="h-2 bg-soft-oatmeal rounded-full overflow-hidden">
                  <div className="h-full bg-warm-sand w-[37.5%] rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
