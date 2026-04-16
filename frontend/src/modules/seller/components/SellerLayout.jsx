import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import SellerBottomNavbar from './SellerBottomNavbar';
import VerificationPending from './VerificationPending';
import { useUser } from '../../user/data/UserContext';
import { LuMenu, LuBell, LuUser, LuLogOut, LuChevronDown } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const initialNotifications = [
  { id: 1, title: 'Product Approved', message: 'Your Classic Marble Tile has been approved and is now live in the catalog.', time: '2 hours ago', status: 'unread', type: 'success' },
  { id: 2, title: 'New Catalog Item', message: 'Admin has added 5 new items to the Paints category. Check them out!', time: '5 hours ago', status: 'read', type: 'info' },
  { id: 3, title: 'Welcome', message: 'Welcome to the Riddha Seller Panel! Start by adding your first product.', time: '1 day ago', status: 'read', type: 'info' },
  { id: 4, title: 'Low Stock Alert', message: 'Your "Modern Fabric Sofa" is running low on stock (2 units left).', time: '2 days ago', status: 'unread', type: 'warning' },
];

const SellerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('seller_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });
  
  // Update notifications state from localStorage periodically or when dropdown opens
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('seller_notifications');
      if (saved) setNotifications(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, status: 'read' } : n);
    setNotifications(updated);
    localStorage.setItem('seller_notifications', JSON.stringify(updated));
  };
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout, user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/seller/login');
  };

  return (
    <div 
      className="flex h-screen w-full bg-white text-deep-espresso overflow-hidden" 
      onClick={() => {
        setShowNotifications(false);
        setShowUserMenu(false);
      }}
    >
      <SellerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
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
              Welcome back, <span className="font-bold text-deep-espresso">Seller!</span>
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
                          onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
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
                  <p className="text-sm font-bold leading-tight">{user?.name || 'Elite Interiors'}</p>
                  <p className="text-xs text-warm-sand font-medium uppercase tracking-tighter">Premium Seller</p>
                </div>
                <div className={`w-10 h-10 rounded-full bg-warm-sand/20 flex items-center justify-center text-warm-sand ring-2 shadow-sm transition-all ${showUserMenu ? 'ring-warm-sand' : 'ring-white group-hover:ring-soft-oatmeal'}`}>
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
                      to="/seller/profile"
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
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-32 lg:pb-8 custom-scrollbar bg-white">
          {user?.status === 'pending' ? (
            <VerificationPending />
          ) : (
            <Outlet />
          )}
        </main>
        
        {/* Mobile Bottom Navigation */}
        {!isSidebarOpen && user?.status !== 'pending' && <SellerBottomNavbar />}
      </div>
    </div>
  );
};

export default SellerLayout;
