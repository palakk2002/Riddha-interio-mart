import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import SellerBottomNavbar from './SellerBottomNavbar';
import { useUser } from '../../user/data/UserContext';
import { FiMenu, FiBell, FiUser, FiLogOut, FiChevronDown, FiCheck, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { connectSocket, disconnectSocket } from '../../../shared/utils/socket';
import { playNotificationSound, primeNotificationAudio, isSoundEnabled } from '../../../shared/utils/notificationSound';
import { getSellerNotifications, setSellerNotifications, prependSellerNotification } from '../utils/sellerNotifications';

const SellerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    return getSellerNotifications();
  });
  const [toast, setToast] = useState(null);
  
  // Update notifications state from localStorage periodically or when dropdown opens
  useEffect(() => {
    const sync = () => setNotifications(getSellerNotifications());
    window.addEventListener('storage', sync);
    window.addEventListener('seller_notifications_updated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('seller_notifications_updated', sync);
    };
  }, []);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, status: 'read' } : n);
    setNotifications(updated);
    setSellerNotifications(updated);
  };
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout, user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    disconnectSocket();
    navigate('/seller/login');
  };

  // Prime notification audio on first user interaction (browser requirement)
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

  // Real-time new order notifications (seller)
  useEffect(() => {
    if (!user?.token || user?.role !== 'seller') return;

    const socket = connectSocket({ token: user.token });

    const onNewOrder = async (payload) => {
      const shortId = String(payload?.orderId || '').slice(-8).toUpperCase();
      const amount = Number(payload?.totalPrice || 0);
      const customer = payload?.customerName || 'a customer';
      const city = payload?.shippingCity ? ` • ${payload.shippingCity}` : '';

      const message = `New order #${shortId} for ₹${amount.toLocaleString()} from ${customer}${city}.`;

      setToast({
        orderId: payload?.orderId,
        title: 'New Order Received',
        message,
        type: 'order'
      });

      prependSellerNotification({
        id: Date.now() + Math.random(),
        title: 'New Order Received',
        message,
        time: 'Just now',
        status: 'unread',
        type: 'warning',
        link: payload?.orderId ? `/seller/order/${payload.orderId}` : '/seller/orders'
      });

      if (isSoundEnabled()) {
        await playNotificationSound();
      }

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([90, 40, 90]);
      }

      window.dispatchEvent(new CustomEvent('seller:new-order', { detail: payload }));
    };

    const onProductApprovalUpdate = async (payload) => {
      const message = payload.message || `Your product status has been updated.`;
      
      setToast({
        title: 'Product Status Update',
        message,
        type: payload.status === 'approved' ? 'success' : 'danger'
      });

      prependSellerNotification({
        id: Date.now() + Math.random(),
        title: 'Product Status Update',
        message,
        time: 'Just now',
        status: 'unread',
        type: payload.status === 'approved' ? 'success' : 'danger',
        link: '/seller/my-products'
      });

      if (isSoundEnabled()) {
        await playNotificationSound();
      }

      window.dispatchEvent(new CustomEvent('seller:product-approval', { detail: payload }));
    };

    const onDeliveryResponse = async (payload) => {
      const status = payload?.status; // 'Accepted' or 'Rejected'
      const orderId = String(payload?.orderId || '').slice(-8).toUpperCase();
      const partner = payload?.deliveryBoyName || 'Delivery Partner';

      const message = status === 'Accepted' 
        ? `${partner} has accepted the delivery for order #${orderId}.`
        : `${partner} has rejected the delivery for order #${orderId}. Please assign another partner.`;

      setToast({
        orderId: payload?.orderId,
        title: status === 'Accepted' ? 'Delivery Accepted' : 'Delivery Rejected',
        message,
        type: status === 'Accepted' ? 'success' : 'danger'
      });

      prependSellerNotification({
        id: Date.now() + Math.random(),
        title: status === 'Accepted' ? 'Delivery Accepted' : 'Delivery Rejected',
        message,
        time: 'Just now',
        status: 'unread',
        type: status === 'Accepted' ? 'success' : 'danger',
        link: payload?.orderId ? `/seller/order/${payload.orderId}` : '/seller/orders'
      });

      if (isSoundEnabled()) {
        await playNotificationSound();
      }

      window.dispatchEvent(new CustomEvent('delivery:response_received', { detail: payload }));
    };

    socket.on('order:new', onNewOrder);
    socket.on('product:approval_update', onProductApprovalUpdate);
    socket.on('delivery:response', onDeliveryResponse);

    return () => {
      socket.off('order:new', onNewOrder);
      socket.off('product:approval_update', onProductApprovalUpdate);
      socket.off('delivery:response', onDeliveryResponse);
    };
  }, [user?.token, user?.role]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 6500);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div 
      className="seller-theme flex h-screen w-full bg-white text-deep-espresso overflow-hidden" 
      onClick={() => {
        setShowNotifications(false);
        setShowUserMenu(false);
      }}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            className="fixed right-6 top-6 z-[60] w-[360px] max-w-[calc(100vw-3rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-3xl bg-white border border-soft-oatmeal shadow-2xl overflow-hidden">
              <div className="p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                  toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                  toast.type === 'danger' ? 'bg-red-100 text-red-600' : 
                  'bg-warm-sand/15 text-warm-sand'
                }`}>
                  {toast.type === 'success' ? <FiCheck size={20} /> : 
                   toast.type === 'danger' ? <FiX size={20} /> : '₹'}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-warm-sand">Realtime Notification</p>
                  <h4 className={`text-sm font-black mt-1 ${
                    toast.type === 'success' ? 'text-emerald-700' : 
                    toast.type === 'danger' ? 'text-red-700' : 'text-deep-espresso'
                  }`}>{toast.title}</h4>
                  <p className="text-xs text-dusty-cocoa mt-1 leading-relaxed">{toast.message}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => {
                        if (toast.orderId) navigate(`/seller/order/${toast.orderId}`);
                        setToast(null);
                      }}
                      className="px-4 py-2 rounded-2xl bg-deep-espresso text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                    >
                      View Order
                    </button>
                    <button
                      onClick={() => setToast(null)}
                      className="px-4 py-2 rounded-2xl bg-soft-oatmeal/40 text-deep-espresso text-[10px] font-black uppercase tracking-widest hover:bg-soft-oatmeal/60 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
              <div className="h-1 bg-warm-sand/70" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SellerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* App-like Header */}
        <header className="h-16 md:h-20 bg-white shadow-sm border-b border-soft-oatmeal px-4 md:px-8 flex items-center justify-between z-30 pt-safe sticky top-0">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }}
              className="lg:hidden p-2 hover:bg-soft-oatmeal/50 rounded-xl transition-colors text-deep-espresso"
            >
              <FiMenu size={22} />
            </button>
            <h2 className="text-sm font-bold text-deep-espresso hidden lg:block">
              Welcome back, <span className="text-warm-sand">Seller!</span>
            </h2>
          </div>

          <div className="lg:hidden flex-1 flex justify-center">
            <span className="font-display font-black text-xl tracking-tighter text-[#bd3b64] uppercase italic">
              Riddha<span className="text-deep-espresso">Seller</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                className={`p-2 rounded-full transition-all relative ${showNotifications ? 'bg-soft-oatmeal text-deep-espresso' : 'text-dusty-cocoa hover:bg-soft-oatmeal'}`}
              >
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-warm-sand rounded-full border-2 border-white animate-pulse"></span>
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
                      {notifications.slice(0, 4).map((n) => (
                        <div 
                          key={n.id} 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            markAsRead(n.id);
                            setShowNotifications(false);
                            setSelectedNotification(n);
                          }}
                          className={`p-4 border-b border-soft-oatmeal/50 hover:bg-soft-oatmeal/20 transition-colors cursor-pointer group ${n.status === 'unread' ? 'bg-warm-sand/5' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-bold transition-all ${n.status === 'unread' ? 'text-deep-espresso' : 'text-warm-sand'}`}>{n.title}</h4>
                            <span className="text-[10px] text-warm-sand uppercase font-medium">{n.time}</span>
                          </div>
                          <p className="text-xs text-dusty-cocoa line-clamp-2">{n.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center bg-soft-oatmeal/5">
                      <button 
                        onClick={() => navigate('/seller/notifications')}
                        className="text-[10px] font-bold text-warm-sand uppercase tracking-widest hover:text-deep-espresso transition-colors"
                      >
                        View All Notifications
                      </button>
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
                  <p className="text-sm font-bold leading-tight">{user?.fullName || user?.shopName || 'Seller'}</p>
                  <p className="text-xs text-warm-sand font-medium uppercase tracking-tighter">Premium Seller</p>
                </div>
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white ring-2 shadow-sm transition-all overflow-hidden ${showUserMenu ? 'ring-brand-pink bg-brand-pink' : 'ring-white group-hover:ring-soft-oatmeal bg-warm-sand/20'}`}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser size={18} className="text-warm-sand" />
                  )}
                </div>
                <FiChevronDown size={12} className={`text-dusty-cocoa transition-transform duration-300 hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`} />
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
                      to="/seller/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-deep-espresso hover:bg-soft-oatmeal/30 transition-colors group"
                    >
                      <FiUser size={18} className="text-warm-sand group-hover:scale-110 transition-transform" />
                      View Profile
                    </Link>
                    <div className="h-[1px] bg-soft-oatmeal my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors group"
                    >
                      <FiLogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 lg:pb-8 custom-scrollbar bg-white">
          <Outlet />
        </main>
        
        {/* Mobile Bottom Navigation */}
        <SellerBottomNavbar />

        {/* Notification Detail Modal */}
        <AnimatePresence>
          {selectedNotification && (
            <div 
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedNotification(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-soft-oatmeal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand">System Notification</p>
                      <h2 className="text-2xl font-black text-deep-espresso italic tracking-tighter uppercase">{selectedNotification.title}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedNotification(null)}
                      className="p-2 hover:bg-soft-oatmeal rounded-xl transition-colors"
                    >
                      <FiX size={24} className="text-warm-sand" />
                    </button>
                  </div>

                  <div className="bg-soft-oatmeal/5 border border-soft-oatmeal/30 rounded-2xl p-6">
                    <p className="text-sm text-dusty-cocoa leading-relaxed font-medium italic">
                      "{selectedNotification.message}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-warm-sand">
                      <div className="w-8 h-8 rounded-lg bg-soft-oatmeal/20 flex items-center justify-center">
                        <FiBell size={14} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{selectedNotification.time}</span>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSelectedNotification(null)}
                        className="px-6 py-3 rounded-2xl bg-soft-oatmeal/30 text-deep-espresso text-[10px] font-black uppercase tracking-widest hover:bg-soft-oatmeal/50 transition-colors"
                      >
                        Dismiss
                      </button>
                      {selectedNotification.link && (
                        <button 
                          onClick={() => {
                            navigate(selectedNotification.link);
                            setSelectedNotification(null);
                          }}
                          className="px-6 py-3 rounded-2xl bg-deep-espresso text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SellerLayout;
