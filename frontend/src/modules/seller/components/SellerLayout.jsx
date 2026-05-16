import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import SellerBottomNavbar from './SellerBottomNavbar';
import { useUser } from '../../user/data/UserContext';
import { FiMenu, FiUser, FiLogOut, FiChevronDown, FiCheck, FiX } from 'react-icons/fi';
import NotificationDropdown from '../../../shared/components/NotificationDropdown';
import { motion, AnimatePresence } from 'framer-motion';

const SellerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [toast, setToast] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout, user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/seller/login');
  };

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 6500);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div 
      className="seller-theme flex h-screen w-full bg-white text-deep-espresso overflow-hidden" 
      onClick={() => {
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
        <header className="h-16 md:h-20 bg-[#bd3b64] lg:bg-white shadow-sm border-b border-[#bd3b64]/10 lg:border-soft-oatmeal px-4 md:px-8 flex items-center justify-between z-30 pt-safe sticky top-0 transition-colors">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
            >
              <FiMenu size={22} />
            </button>
            <h2 className="text-sm font-bold text-deep-espresso hidden lg:block">
              Welcome back, <span className="text-warm-sand">Seller!</span>
            </h2>
          </div>

          <div className="lg:hidden flex-1 flex justify-center">
            <span className="font-display font-black text-xl tracking-tighter text-white uppercase italic">
              Riddha<span className="text-white/70">Seller</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown isMobile={false} />
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
                    <FiUser size={18} className="text-white lg:text-warm-sand" />
                  )}
                </div>
                <FiChevronDown size={12} className={`text-white/60 lg:text-dusty-cocoa transition-transform duration-300 hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`} />
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
