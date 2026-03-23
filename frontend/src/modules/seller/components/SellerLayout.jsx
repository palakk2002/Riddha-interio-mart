import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import { LuMenu, LuBell, LuUser } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const notifications = [
  { id: 1, title: 'Product Approved', message: 'Your Classic Marble Tile has been approved.', time: '2h ago', status: 'unread' },
  { id: 2, title: 'New Catalog Item', message: 'New products added to the admin catalog.', time: '5h ago', status: 'read' },
  { id: 3, title: 'Welcome', message: 'Welcome to the Riddha Seller Panel!', time: '1d ago', status: 'read' },
];

const SellerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#FDFBF9] text-deep-espresso overflow-hidden" onClick={() => setShowNotifications(false)}>
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
                    <div className="p-3 text-center bg-soft-oatmeal/5">
                      <button className="text-[10px] font-bold text-warm-sand uppercase tracking-widest hover:text-deep-espresso transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-8 w-[1px] bg-soft-oatmeal mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-tight">Elite Interiors</p>
                <p className="text-xs text-warm-sand font-medium uppercase tracking-tighter">Premium Seller</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-warm-sand/20 flex items-center justify-center text-warm-sand ring-2 ring-white shadow-sm group-hover:ring-warm-sand transition-all">
                <LuUser size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[#FDFBF9]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
