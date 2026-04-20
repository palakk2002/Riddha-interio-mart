import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import DeliverySidebar from './DeliverySidebar';
import DeliveryBottomNavbar from './DeliveryBottomNavbar';
import { LuMenu, LuBell, LuUser, LuChevronDown } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const notifications = [
  { id: 1, title: 'New Order Available', message: 'Pick up from Raja Park, Jaipur.', time: 'Just now', status: 'unread' },
  { id: 2, title: 'Payment Received', message: 'Earnings for ORD-5541 credited.', time: '2h ago', status: 'read' },
  { id: 3, title: 'Profile Updated', message: 'Your vehicle details have been verified.', time: '1d ago', status: 'read' },
];

const DeliveryLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div 
      className="flex h-screen w-full bg-white text-deep-espresso overflow-hidden" 
      onClick={() => {
        setShowNotifications(false);
        setShowUserMenu(false);
      }}
    >
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
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                className={`p-2 rounded-full transition-all relative ${showNotifications ? 'bg-soft-oatmeal text-deep-espresso' : 'text-dusty-cocoa hover:bg-soft-oatmeal'}`}
              >
                <LuBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-warm-sand rounded-full border-2 border-white"></span>
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
                      <span className="text-[10px] font-bold text-warm-sand uppercase tracking-wider">3 New</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-4 border-b border-soft-oatmeal/50 hover:bg-soft-oatmeal/20 transition-colors cursor-pointer group ${n.status === 'unread' ? 'bg-warm-sand/5' : ''}`}>
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
                  <p className="text-sm font-bold leading-tight">Vikram Singh</p>
                  <p className="text-xs text-warm-sand font-medium uppercase tracking-tighter">Gold Partner</p>
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
