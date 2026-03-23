import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuLayoutDashboard, 
  LuSearch, 
  LuPlus, 
  LuPackage, 
  LuX, 
  LuChevronRight 
} from 'react-icons/lu';
import sidebarBg from '../../../assets/seller_sidebar_bg.png';

const menuItems = [
  { path: '/seller', icon: LuLayoutDashboard, label: 'Dashboard' },
  { path: '/seller/catalog', icon: LuSearch, label: 'Browse Catalog' },
  { path: '/seller/add-product', icon: LuPlus, label: 'Add Product' },
  { path: '/seller/my-products', icon: LuPackage, label: 'My Products' },
];

const SellerSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen w-72 bg-deep-espresso text-white z-50 flex flex-col shadow-2xl lg:shadow-none overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={sidebarBg} 
            alt="Interior Mockup" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-espresso/90 via-deep-espresso/40 to-deep-espresso/90"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warm-sand/90 backdrop-blur-md rounded-lg flex items-center justify-center text-deep-espresso font-bold text-xl drop-shadow-md">
              S
            </div>
            <span className="font-display font-bold text-xl tracking-wide uppercase drop-shadow-md">
              Riddha <span className="text-warm-sand">Seller</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <LuX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 p-4 mt-4 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/seller'}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) => `
                flex items-center justify-between p-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-dusty-cocoa/90 text-white shadow-lg shadow-dusty-cocoa/20 border border-white/10 backdrop-blur-md' 
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'}
              `}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className="transition-transform duration-300" />
                <span className="font-medium">{item.label}</span>
              </div>
              <LuChevronRight size={16} className="transition-transform duration-300 opacity-50 group-hover:translate-x-1" />
            </NavLink>
          ))}
        </nav>

        {/* Footer info */}
        <div className="relative z-10 p-6 border-t border-white/10 text-white/50 text-xs mt-auto">
          <p className="font-medium text-white/80">© 2026 Riddha Interio Mart</p>
          <p className="mt-1 text-[10px] tracking-wide uppercase">Seller Panel v1.0</p>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;
