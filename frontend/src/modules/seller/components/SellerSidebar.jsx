import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../user/data/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuSearch,
  LuPlus,
  LuPackage,
  LuX,
  LuChevronRight,
  LuLogOut
} from 'react-icons/lu';
import sidebarBg from '../../../assets/seller_sidebar_bg.png';

const menuItems = [
  { path: '/seller', icon: LuLayoutDashboard, label: 'Dashboard' },
  { path: '/seller/orders', icon: LuPackage, label: 'Manage Orders' },
  { path: '/seller/catalog', icon: LuSearch, label: 'Browse Catalog' },
  { path: '/seller/add-product', icon: LuPlus, label: 'Add Product' },
  { path: '/seller/my-products', icon: LuPackage, label: 'My Products' },
];

const SellerSidebar = ({ isOpen, onClose }) => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/seller/login');
  };

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
          fixed lg:static top-0 left-0 h-screen w-72 lg:shrink-0 bg-deep-espresso text-white z-50 flex flex-col shadow-2xl lg:shadow-none overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={sidebarBg}
            alt="Interior Mockup"
            className="w-full h-full object-cover opacity-10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-espresso via-deep-espresso/95 to-deep-espresso"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warm-sand rounded-lg flex items-center justify-center text-deep-espresso font-bold text-xl">
              S
            </div>
            <span className="font-display font-bold text-xl tracking-wide uppercase text-white">
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
                flex items-center justify-between p-3 rounded-xl transition-all duration-300 group border border-white/5 mb-2
                ${isActive
                  ? 'bg-red-800 text-white shadow-xl shadow-red-900/20 border-white/10 scale-[1.02]'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/10'}
              `}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className="transition-transform duration-300" />
                <span className="font-medium text-white">{item.label}</span>
              </div>
              <LuChevronRight size={16} className="transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-white/60" />
            </NavLink>
          ))}
        </nav>

        {/* Footer info and logout */}
        <div className="relative z-10 p-6 border-t border-white/10 mt-auto backdrop-blur-sm bg-deep-espresso/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors group mb-4"
          >
            <LuLogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
          <p className="font-medium text-white/80">© 2026 Riddha Interio Mart</p>
          <p className="mt-1 text-[10px] tracking-wide uppercase">Seller Panel v1.0</p>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;
