import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import DeliverySidebar from './DeliverySidebar';
import DeliveryBottomNavbar from './DeliveryBottomNavbar';
import { LuMenu, LuBell, LuUser, LuChevronDown, LuTruck, LuCheck, LuX } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../user/data/UserContext';
import { connectSocket, disconnectSocket } from '../../../shared/utils/socket';
import { playNewOrderChime, primeNotificationAudio, isSoundEnabled } from '../../seller/utils/notificationSound';
import { getDeliveryNotifications, setDeliveryNotifications, prependDeliveryNotification } from '../utils/deliveryNotifications';
import api from '../../../shared/utils/api';

const notifications = [
  { id: 1, title: 'New Order Available', message: 'Pick up from Raja Park, Jaipur.', time: 'Just now', status: 'unread', link: '/delivery/orders' },
  { id: 2, title: 'Payment Received', message: 'Earnings for ORD-5541 credited.', time: '2h ago', status: 'read', link: '/delivery/earnings' },
  { id: 3, title: 'Profile Updated', message: 'Your vehicle details have been verified.', time: '1d ago', status: 'read', link: '/delivery/profile' },
];

const DeliveryLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState(() => getDeliveryNotifications());
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [assignmentRequest, setAssignmentRequest] = React.useState(null);
  const [approvalNotification, setApprovalNotification] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const { user, setUser, logout } = useUser();
  const [updatingStatus, setUpdatingStatus] = React.useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, status: 'read' } : n);
    setNotifications(updated);
    setDeliveryNotifications(updated);
  };

  React.useEffect(() => {
    const sync = () => setNotifications(getDeliveryNotifications());
    window.addEventListener('delivery_notifications_updated', sync);
    return () => window.removeEventListener('delivery_notifications_updated', sync);
  }, []);

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
      if (isSoundEnabled()) playNewOrderChime();
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    };

    const onApprovalUpdate = (payload) => {
      setApprovalNotification(payload);
      if (payload.status === 'Approved') {
        setUser(prev => ({ ...prev, approvalStatus: 'Approved' }));
      }
      setToast({ title: 'Account Status', message: payload.message, type: payload.status === 'Approved' ? 'success' : 'danger' });
      prependDeliveryNotification({ title: 'Approval Update', message: payload.message, time: 'Just now', status: 'unread', link: '/delivery/profile' });
      if (isSoundEnabled()) playNewOrderChime();
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
    <div 
      className="flex h-screen w-full bg-white text-deep-espresso overflow-hidden delivery-theme" 
      onClick={() => {
        setShowNotifications(false);
        setShowUserMenu(false);
      }}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            onClick={() => setToast(null)}
            className="fixed top-6 right-6 z-[130] w-[380px] max-w-[calc(100vw-3rem)] cursor-pointer"
          >
            <div className="bg-white rounded-[32px] shadow-2xl border border-soft-oatmeal overflow-hidden">
              <div className="p-6 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  toast.type === 'success' ? 'bg-[#001B4E]/10 text-[#001B4E]' :
                  toast.type === 'danger' ? 'bg-[#001B4E]/10 text-[#001B4E]' :
                  'bg-[#001B4E]/10 text-[#001B4E]'
                }`}>
                  {toast.type === 'success' ? <LuCheck size={24} /> :
                   toast.type === 'danger' ? <LuX size={24} /> : <LuTruck size={24} />}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand">Partner Update</p>
                  <h4 className="text-base font-black text-deep-espresso mt-1">{toast.title}</h4>
                  <p className="text-sm text-dusty-cocoa mt-1 line-clamp-2 leading-relaxed italic">"{toast.message}"</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-soft-oatmeal/20">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className={`h-full ${
                    toast.type === 'success' ? 'bg-[#001B4E]' :
                    toast.type === 'danger' ? 'bg-[#001B4E]' :
                    'bg-[#001B4E]'
                  }`}
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
                className="absolute inset-0 bg-deep-espresso/60 backdrop-blur-xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden"
              >
                <div className="bg-[#001B4E] p-8 text-white text-center flex flex-col items-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50" />
                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-lg border border-white/20">
                      <LuTruck size={32} />
                   </div>
                   <h3 className="text-2xl font-display font-black uppercase tracking-tight italic">New Order <span className="text-warm-sand">Request</span></h3>
                   <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Incoming Dispatch Task</p>
                </div>

                <div className="p-8 space-y-6 text-center">
                   <div>
                      <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest mb-1">Potential Earnings</p>
                      <p className="text-3xl font-black text-deep-espresso tracking-tighter">₹{Number(assignmentRequest.totalPrice || 0).toLocaleString()}</p>
                   </div>

                   <div className="bg-soft-oatmeal/20 rounded-2xl p-4 text-left">
                      <p className="text-[10px] font-black text-warm-sand uppercase tracking-widest mb-3 border-b border-soft-oatmeal pb-2">Destiantion Profile</p>
                      <p className="text-sm font-black text-deep-espresso uppercase">{assignmentRequest.customerName}</p>
                      <p className="text-xs text-dusty-cocoa font-medium mt-1 leading-relaxed">
                        {assignmentRequest.shippingAddress?.fullAddress}, {assignmentRequest.shippingAddress?.city}
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-4 pt-4">
                      <button 
                        onClick={() => handleResponse('Rejected')}
                        className="bg-white border-2 border-soft-oatmeal text-deep-espresso py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-soft-oatmeal/20 transition-all"
                      >
                         Decline
                      </button>
                      <button 
                        onClick={() => handleResponse('Accepted')}
                        className="bg-deep-espresso text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-deep-espresso/20 flex items-center justify-center gap-2"
                      >
                         <LuCheck size={16} />
                         Accept Task
                      </button>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Approval Status Modal */}
        <AnimatePresence>
          {approvalNotification && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-deep-espresso/40 backdrop-blur-md"
                onClick={() => setApprovalNotification(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 text-center overflow-hidden"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
                  approvalNotification.status === 'Approved' ? 'bg-[#001B4E]/10 text-[#001B4E]' : 'bg-[#001B4E]/10 text-[#001B4E]'
                }`}>
                  {approvalNotification.status === 'Approved' ? <LuCheck size={40} /> : <LuX size={40} />}
                </div>
                
                <h3 className="text-2xl font-display font-black text-deep-espresso italic mb-2">
                  {approvalNotification.status === 'Approved' ? 'Account Approved!' : 'Account Rejected'}
                </h3>
                <p className="text-warm-sand font-bold text-xs uppercase tracking-widest mb-6">
                  {approvalNotification.status === 'Approved' ? 'You are now an active partner' : 'Moderation complete'}
                </p>
                
                <div className="bg-soft-oatmeal/20 rounded-2xl p-4 mb-8">
                  <p className="text-xs text-dusty-cocoa font-medium italic leading-relaxed">
                    "{approvalNotification.message}"
                  </p>
                </div>

                <button 
                  onClick={() => setApprovalNotification(null)}
                  className="w-full py-4 rounded-2xl bg-deep-espresso text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-deep-espresso/10"
                >
                   Continue
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <DeliverySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-20 bg-white shadow-sm border-b border-soft-oatmeal px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }}
              className="lg:hidden p-2 hover:bg-soft-oatmeal rounded-lg transition-colors"
            >
              <LuMenu size={24} />
            </button>
            <h2 className="text-sm font-medium text-warm-sand hidden sm:block">
              Welcome back, <span className="font-bold text-deep-espresso">Partner!</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Toggle */}
            {user?.approvalStatus === 'Approved' && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleStatus(); }}
                disabled={updatingStatus}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all group ${
                  status === 'Available' 
                    ? 'bg-[#001B4E]/5 border-[#001B4E]/10 text-[#001B4E] shadow-sm shadow-[#001B4E]/10' 
                    : 'bg-soft-oatmeal/20 border-soft-oatmeal/40 text-warm-sand grayscale'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${status === 'Available' ? 'bg-[#001B4E] animate-pulse' : 'bg-warm-sand'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {updatingStatus ? 'Syncing...' : status === 'Available' ? 'Online' : 'Offline'}
                </span>
              </button>
            )}

            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                className={`p-2 rounded-full transition-all relative ${showNotifications ? 'bg-soft-oatmeal text-deep-espresso' : 'text-dusty-cocoa hover:bg-soft-oatmeal'}`}
              >
                <LuBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#001B4E] rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-soft-oatmeal overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-soft-oatmeal flex items-center justify-between bg-soft-oatmeal/10">
                      <h3 className="font-bold text-sm">Notifications</h3>
                      <span className="text-[10px] font-bold text-warm-sand uppercase tracking-wider">{unreadCount} New</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(n.id);
                            if (n.link) {
                              navigate(n.link);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-4 border-b border-soft-oatmeal/50 hover:bg-soft-oatmeal/20 transition-colors cursor-pointer group ${n.status === 'unread' ? 'bg-warm-sand/5' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-bold text-deep-espresso">{n.title}</h4>
                            <span className="text-[10px] text-warm-sand uppercase font-medium">{n.time}</span>
                          </div>
                          <p className="text-xs text-dusty-cocoa line-clamp-2">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-8 w-[1px] bg-soft-oatmeal mx-2"></div>
            <div className="relative">
              <div 
                onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold leading-tight">{user?.fullName || 'Partner'}</p>
                  <p className="text-xs text-warm-sand font-medium uppercase tracking-tighter">
                    {user?.approvalStatus === 'Approved' ? 'Verified Partner' : 'Pending Verification'}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ring-2 shadow-sm transition-all overflow-hidden ${showUserMenu ? 'ring-warm-sand bg-[#001B4E]' : 'ring-white group-hover:ring-soft-oatmeal bg-warm-sand/20'}`}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <LuUser size={20} className="text-warm-sand" />
                  )}
                </div>
                <LuChevronDown size={14} className={`text-dusty-cocoa transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-soft-oatmeal overflow-hidden z-50 p-2"
                  >
                    <Link 
                      to="/delivery/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-deep-espresso hover:bg-soft-oatmeal/30 transition-colors group"
                    >
                      <LuUser size={18} className="text-warm-sand group-hover:scale-110 transition-transform" />
                      View Profile
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-32 lg:pb-8 custom-scrollbar bg-white">
          <Outlet />
        </main>
        
        {/* Mobile Bottom Navigation */}
        <DeliveryBottomNavbar />
      </div>
    </div>
  );
};

export default DeliveryLayout;
