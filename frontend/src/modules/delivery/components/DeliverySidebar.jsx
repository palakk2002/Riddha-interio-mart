import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LuLayoutDashboard, 
  LuPackage, 
  LuMap, 
  LuZap, 
  LuArrowUpRight, 
  LuNavigation, 
  LuUsers, 
  LuTrendingUp, 
  LuWallet, 
  LuBell, 
  LuFileText, 
  LuSettings, 
  LuCircleHelp,
  LuLogOut,
  LuShieldCheck,
  LuClock
} from 'react-icons/lu';

import { useUser } from '../../user/data/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DeliverySidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/delivery/login');
  };

  const menuGroups = [
    {
      title: 'Operations',
      items: [
        { name: 'Dashboard', path: '/delivery/dashboard', icon: LuLayoutDashboard },
        { name: 'Orders', path: '/delivery/orders', icon: LuPackage },
        { name: 'Route Management', path: '/delivery/delivery-history', icon: LuMap },
        { name: 'Dispatch Center', path: '/delivery/orders', icon: LuZap },
        { name: 'Pickup Requests', path: '/delivery/orders', icon: LuArrowUpRight },
        { name: 'Delivery Tracking', path: '/delivery/delivery-history', icon: LuNavigation },
      ]
    },
    {
      title: 'Fleet & Analytics',
      items: [
        { name: 'Profile', path: '/delivery/profile', icon: LuUsers },
        { name: 'Analytics', path: '/delivery/dashboard', icon: LuTrendingUp },
        { name: 'Earnings', path: '/delivery/earnings', icon: LuWallet },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Notifications', path: '/delivery/notifications', icon: LuBell },
        { name: 'Reports', path: '/delivery/dashboard', icon: LuFileText },
        { name: 'Settings', path: '/delivery/settings', icon: LuSettings },
        { name: 'Help & Support', path: '/delivery/help', icon: LuCircleHelp },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-[#111827] border-r border-white/5 
        transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-24 px-8 flex items-center border-b border-white/5 bg-slate-900/50">
            <Link to="/delivery/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D63384] to-[#B6256B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                <LuZap size={22} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-white leading-none">RIDDHA <span className="text-[#D63384]">OPS</span></span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Logistics Center</span>
              </div>
            </Link>
          </div>

          {/* Partner Status Card */}
          <div className="px-6 pt-8 pb-4">
             <div className="bg-slate-800/40 border border-white/5 rounded-[2rem] p-4 flex items-center gap-4">
                <div className="relative">
                   <div className="w-12 h-12 rounded-2xl bg-slate-700 overflow-hidden border border-white/10">
                      <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName || 'Partner'}&background=D63384&color=fff`} className="w-full h-full object-cover" alt="avatar" />
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#111827] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-black text-white truncate">{user?.fullName || 'Partner'}</p>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-pink-500/10 text-[#D63384] rounded-md text-[8px] font-black uppercase tracking-widest">Shift Active</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
            {menuGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                 <h3 className="px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{group.title}</h3>
                 <div className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
                          flex items-center gap-4 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group
                          ${isActive 
                            ? 'bg-gradient-to-r from-[#D63384]/10 to-transparent text-[#D63384] border-l-4 border-[#D63384]' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'}
                        `}
                      >
                        <item.icon size={18} className="shrink-0 transition-transform group-hover:scale-110" />
                        <span>{item.name}</span>
                      </NavLink>
                    ))}
                 </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-slate-900/50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-rose-500/10 transition-all duration-300 group"
            >
              <LuLogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out System
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DeliverySidebar;
