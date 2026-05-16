import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import DeliverySidebar from './DeliverySidebar';
import DeliveryBottomNavbar from './DeliveryBottomNavbar';
import { 
  LuMenu, 
  LuUser, 
  LuChevronDown, 
  LuTruck, 
  LuCheck, 
  LuX, 
  LuSearch, 
  LuBell, 
  LuZap,
  LuClock,
  LuCircleDot,
  LuNavigation
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../user/data/UserContext';
import NotificationDropdown from '../../../shared/components/NotificationDropdown';
import api from '../../../shared/utils/api';

const DeliveryLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [assignmentRequest, setAssignmentRequest] = React.useState(null);
  const [approvalNotification, setApprovalNotification] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const { user, setUser } = useUser();
  const [updatingStatus, setUpdatingStatus] = React.useState(false);
  const navigate = useNavigate();

  const status = user?.status || 'Offline';

  // Sync status if user profile changes - Removed redundant useEffect as we use status variable now

  // Prime audio
  React.useEffect(() => {
    const onFirstGesture = () => {
      primeNotificationAudio();
      window.removeEventListener('pointerdown', onFirstGesture);
    };
    window.addEventListener('pointerdown', onFirstGesture);
    return () => window.removeEventListener('pointerdown', onFirstGesture);
  }, []);

  // Socket setup
  React.useEffect(() => {
    if (!user?.token || user?.role !== 'delivery') return;

    const socket = connectSocket({ token: user.token });

    const onAssigned = (payload) => {
      setAssignmentRequest(payload);
      setToast({ title: 'New Task', message: 'A new order is available for pickup!', type: 'info' });
      prependDeliveryNotification({ title: 'Order Assigned', message: 'New order task received.', time: 'Just now', status: 'unread', link: '/delivery/orders' });
      if (isSoundEnabled()) playNotificationSound();
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    };

    const onApprovalUpdate = (payload) => {
      setApprovalNotification(payload);
      if (payload.status === 'Approved') {
        setUser(prev => ({ ...prev, approvalStatus: 'Approved' }));
      }
      setToast({ title: 'Account Status', message: payload.message, type: payload.status === 'Approved' ? 'success' : 'danger' });
      prependDeliveryNotification({ title: 'Approval Update', message: payload.message, time: 'Just now', status: 'unread', link: '/delivery/profile' });
      if (isSoundEnabled()) playNotificationSound();
    };

    socket.on('delivery:assigned', onAssigned);
    socket.on('delivery:approval_update', onApprovalUpdate);

    return () => {
      socket.off('delivery:assigned', onAssigned);
      socket.off('delivery:approval_update', onApprovalUpdate);
    };
  }, [user?.token, user?.role]);

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleResponse = async (responseStatus) => {
    try {
      await api.put(`/orders/${assignmentRequest.orderId}/delivery-response`, { status: responseStatus });
      setAssignmentRequest(null);
    } catch (err) {
      console.error('Response failed:', err);
    }
  };

  const toggleStatus = async () => {
    if (user?.approvalStatus !== 'Approved') return;
    setUpdatingStatus(true);
    try {
      const newStatus = status === 'Available' ? 'Offline' : 'Available';
      const { data } = await api.put('/delivery/status', { status: newStatus });
      if (data.success) {
        setUser({ ...user, status: data.data.status });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            onClick={() => setToast(null)}
            className="fixed top-6 right-6 z-[130] w-[380px] max-w-[calc(100vw-3rem)] cursor-pointer"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-6 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-pink-50 text-[#D63384]`}>
                   <LuZap size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D63384]">Logistics Alert</p>
                  <h4 className="text-sm font-black text-slate-900 mt-1">{toast.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{toast.message}</p>
                </div>
              </div>
              <div className="h-1 w-full bg-slate-50">
                <motion.div 
                   initial={{ width: "100%" }}
                   animate={{ width: "0%" }}
                   transition={{ duration: 6, ease: "linear" }}
                   className="h-full bg-[#D63384]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignment Request Modal */}
      <AnimatePresence>
        {assignmentRequest && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="bg-gradient-to-br from-[#D63384] to-[#B6256B] p-10 text-white text-center flex flex-col items-center relative">
                 <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center mb-6 backdrop-blur-xl border border-white/30">
                    <LuZap size={40} className="animate-pulse" />
                 </div>
                 <h3 className="text-3xl font-black tracking-tight leading-none uppercase italic">Dispatch <span className="text-pink-200">Priority</span></h3>
                 <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em] mt-3">High Yield Delivery Task</p>
              </div>

              <div className="p-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Net Earnings</p>
                       <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{Number(assignmentRequest.totalPrice || 0).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">ETA Range</p>
                       <p className="text-lg font-black text-[#D63384]">25-40 min</p>
                    </div>
                 </div>

                 <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                    <p className="text-[9px] font-black text-[#D63384] uppercase tracking-widest mb-4 border-b border-slate-200 pb-3">Destination Intel</p>
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                          <LuNavigation size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{assignmentRequest.customerName}</p>
                          <p className="text-xs text-slate-500 font-bold mt-1 leading-relaxed">
                            {assignmentRequest.shippingAddress?.fullAddress}, {assignmentRequest.shippingAddress?.city}
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleResponse('Rejected')}
                      className="bg-white border-2 border-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                       Decline Task
                    </button>
                    <button 
                      onClick={() => handleResponse('Accepted')}
                      className="bg-[#D63384] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#B6256B] transition-all shadow-xl shadow-pink-500/20 flex items-center justify-center gap-2"
                    >
                       <LuCheck size={18} />
                       Accept Mission
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeliverySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-24 bg-white border-b border-slate-100 px-8 flex items-center justify-between z-30 sticky top-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }}
              className="lg:hidden p-3 bg-slate-50 rounded-xl text-slate-600"
            >
              <LuMenu size={24} />
            </button>
            <div className="hidden lg:block">
               <h2 className="text-xl font-black text-slate-900 tracking-tight">Operations <span className="text-[#D63384]">Center</span></h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time logistics monitoring</p>
            </div>
            
            {/* Search Bar (Desktop) */}
            <div className="hidden xl:flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl w-80 group focus-within:border-[#D63384]/30 transition-all">
               <LuSearch size={18} className="text-slate-400 group-focus-within:text-[#D63384]" />
               <input type="text" placeholder="Track shipment ID..." className="bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400 w-full" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Toggle */}
            {user?.approvalStatus === 'Approved' && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleStatus(); }}
                disabled={updatingStatus}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border-2 transition-all group ${
                  status === 'Available' 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${status === 'Available' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                  {updatingStatus ? 'Syncing...' : status === 'Available' ? 'Online' : 'Offline'}
                </span>
              </button>
            )}

            <div className="flex items-center gap-2">
               <button className="p-3 text-slate-400 hover:text-[#D63384] hover:bg-pink-50 rounded-xl transition-all relative">
                  <LuBell size={22} />
                  <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#D63384] border-2 border-white rounded-full"></div>
               </button>
               <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
               
               <div className="relative">
                 <div 
                   onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                   className="flex items-center gap-3 cursor-pointer group"
                 >
                   <div className="text-right hidden sm:block">
                     <p className="text-sm font-black text-slate-900 leading-tight">{user?.fullName || 'Partner'}</p>
                     <p className="text-[9px] text-[#D63384] font-black uppercase tracking-widest mt-0.5">
                       {user?.approvalStatus === 'Approved' ? 'Fleet Elite' : 'Review Phase'}
                     </p>
                   </div>
                   <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-lg shadow-slate-200 ring-2 ring-slate-50 group-hover:ring-[#D63384]/20 transition-all">
                      <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName || 'Partner'}&background=D63384&color=fff`} className="w-full h-full object-cover" alt="avatar" />
                   </div>
                 </div>

                 <AnimatePresence>
                   {showUserMenu && (
                     <motion.div
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-3"
                     >
                        <div className="p-4 border-b border-slate-50 mb-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Shift</p>
                           <div className="flex items-center gap-2 text-slate-900">
                              <LuClock size={14} className="text-[#D63384]" />
                              <span className="text-xs font-black">08:30 AM - 06:00 PM</span>
                           </div>
                        </div>
                       <Link 
                         to="/delivery/profile"
                         className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-[#D63384] hover:bg-pink-50 transition-all"
                       >
                         <LuUser size={18} />
                         Partner Profile
                       </Link>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 pb-32 lg:pb-8 custom-scrollbar bg-[#F8FAFC]">
           <div className="max-w-[1600px] mx-auto">
              <Outlet />
           </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <DeliveryBottomNavbar />
      </div>
    </div>
  );
};

export default DeliveryLayout;
