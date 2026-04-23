import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useUser } from '../../../user/models/UserContext';
import { LuMenu, LuBell, LuUser, LuLogOut, LuChevronDown, LuCheck, LuX } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { connectSocket, disconnectSocket } from '../../../../shared/utils/socket';
import { playNewOrderChime, primeNotificationAudio, isSoundEnabled } from '../../seller/utils/notificationSound';
import { getAdminNotifications, setAdminNotifications, prependAdminNotification } from '../utils/adminNotifications';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => getAdminNotifications());
  const [toast, setToast] = useState(null);
  const { logout, user } = useUser();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, status: 'read' } : n);
    setNotifications(updated);
    setAdminNotifications(updated);
  };

  useEffect(() => {
    const sync = () => setNotifications(getAdminNotifications());
    window.addEventListener('admin_notifications_updated', sync);
    return () => window.removeEventListener('admin_notifications_updated', sync);
  }, []);

  // Prime audio
  useEffect(() => {
    const onFirstGesture = () => {
      primeNotificationAudio();
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
    window.addEventListener('pointerdown', onFirstGesture);
    window.addEventListener('keydown', onFirstGesture);
    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, []);

  // Socket setup
  useEffect(() => {
    if (!user?.token || user?.role !== 'admin') return;

    const socket = connectSocket({ token: user.token });

    const onOrderNew = async (payload) => {
      const shortId = String(payload?.orderId || '').slice(-8).toUpperCase();
      const message = `New order #${shortId} received for ₹${Number(payload?.totalPrice || 0).toLocaleString()}.`;
      
      setToast({ title: 'New Order', message, type: 'success', link: `/admin/orders` });
      prependAdminNotification({ title: 'New Order', message, time: 'Just now', status: 'unread', link: '/admin/orders' });
      if (isSoundEnabled()) await playNewOrderChime();
    };

    const onProductNewRequest = async (payload) => {
      const message = payload.message || 'A new product requires your approval.';
      setToast({ title: 'Product Request', message, type: 'warning', link: '/admin/products' });
      prependAdminNotification({ title: 'Product Request', message, time: 'Just now', status: 'unread', link: '/admin/products' });
      if (isSoundEnabled()) await playNewOrderChime();
    };

    const onDeliveryNewRegistration = async (payload) => {
      const message = `New delivery partner registration: ${payload.fullName}.`;
      setToast({ title: 'New Registration', message, type: 'info', link: '/admin/delivery' });
      prependAdminNotification({ title: 'New Registration', message, time: 'Just now', status: 'unread', link: '/admin/delivery' });
      if (isSoundEnabled()) await playNewOrderChime();
    };

    const onDeliveryResponse = async (payload) => {
      const message = `Delivery ${payload.status} for order #${String(payload.orderId).slice(-8).toUpperCase()} by ${payload.deliveryBoyName}.`;
      setToast({ title: 'Delivery Update', message, type: payload.status === 'Accepted' ? 'success' : 'danger', link: '/admin/orders' });
      prependAdminNotification({ title: 'Delivery Update', message, time: 'Just now', status: 'unread', link: '/admin/orders' });
      if (isSoundEnabled()) await playNewOrderChime();
    };

    socket.on('order:new', onOrderNew);
    socket.on('product:new_request', onProductNewRequest);
    socket.on('delivery:new_registration', onDeliveryNewRegistration);
    socket.on('delivery:response', onDeliveryResponse);

    return () => {
      socket.off('order:new', onOrderNew);
      socket.off('product:new_request', onProductNewRequest);
      socket.off('delivery:new_registration', onDeliveryNewRegistration);
      socket.off('delivery:response', onDeliveryResponse);
    };
  }, [user?.token, user?.role]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogout = () => {
    logout();
    disconnectSocket();
    navigate('/admin/login');
  };

  return (
    <div 
      className="flex h-screen w-full bg-white text-deep-espresso overflow-hidden"
      onClick={() => {
        setShowUserMenu(false);
        setShowNotifications(false);
      }}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            onClick={() => { if (toast.link) navigate(toast.link); setToast(null); }}
            className="fixed top-6 right-6 z-[100] w-[380px] max-w-[calc(100vw-3rem)] cursor-pointer"
          >
            <div className="bg-white rounded-[32px] shadow-2xl border border-soft-oatmeal overflow-hidden">
              <div className="p-6 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  toast.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                  toast.type === 'danger' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {toast.type === 'success' ? <LuCheck size={24} /> :
                   toast.type === 'danger' ? <LuX size={24} /> : <LuBell size={24} />}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand">System Alert</p>
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
                    toast.type === 'success' ? 'bg-emerald-500' :
                    toast.type === 'warning' ? 'bg-amber-500' :
                    toast.type === 'danger' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white shadow-sm border-b border-soft-oatmeal px-4 md:px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-soft-oatmeal rounded-lg"
            >
              <LuMenu size={24} />
            </button>
            <h2 className="text-sm font-medium text-warm-sand hidden sm:block">
              Welcome back, <span className="font-bold text-deep-espresso">Admin!</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                className={`p-2 rounded-full transition-all relative ${showNotifications ? 'bg-soft-oatmeal text-deep-espresso' : 'text-dusty-cocoa hover:bg-soft-oatmeal'}`}
              >
                <LuBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
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
                      <h3 className="font-bold text-sm">Admin Alerts</h3>
                      <span className="text-[10px] font-bold text-warm-sand uppercase tracking-wider">{unreadCount} NEW</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            markAsRead(n.id);
                            setShowNotifications(false);
                            if (n.link) navigate(n.link);
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
                    <div className="p-3 text-center bg-soft-oatmeal/5">
                      <Link 
                        to="/admin/activity"
                        className="text-[10px] font-bold text-warm-sand uppercase tracking-widest hover:text-deep-espresso transition-colors block"
                        onClick={() => setShowNotifications(false)}
                      >
                        See All System Logs
                      </Link>
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
                  <p className="text-sm font-bold leading-tight">{user?.name || 'Alex Johnson'}</p>
                  <p className="text-xs text-warm-sand">Super Admin</p>
                </div>
                <div className={`w-10 h-10 rounded-full bg-dusty-cocoa flex items-center justify-center text-white ring-2 shadow-sm transition-all ${showUserMenu ? 'ring-warm-sand' : 'ring-white group-hover:ring-soft-oatmeal'}`}>
                  <LuUser size={20} />
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
                      to="/admin/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-deep-espresso hover:bg-soft-oatmeal/30 transition-colors group"
                    >
                      <LuUser size={18} className="text-warm-sand group-hover:scale-110 transition-transform" />
                      View Profile
                    </Link>
                    <div className="h-[1px] bg-soft-oatmeal my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors group"
                    >
                      <LuLogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
