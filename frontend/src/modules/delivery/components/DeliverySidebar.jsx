import React, { useState, useEffect } from 'react';
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
  LuShieldCheck
} from 'react-icons/lu';

import { useUser } from '../../user/data/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../../shared/utils/api';
import { getSocket } from '../../../shared/utils/socket';
import logoImage from '../../../assets/image copy 2.png';

const DeliverySidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/delivery/analytics');
      if (data.success && data.data?.stats) {
        setPendingCount(data.data.stats.pendingDeliveries || 0);
      }
    } catch (err) {
      console.error('Failed to fetch delivery analytics:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [location.pathname]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleDeliveryAssigned = (payload) => {
      toast.success(payload.message || 'New Delivery Assigned!', {
        position: 'top-right',
        duration: 4000,
        icon: '🛵'
      });
      fetchAnalytics();
    };

    socket.on('delivery:assigned', handleDeliveryAssigned);
    return () => {
      socket.off('delivery:assigned', handleDeliveryAssigned);
    };
  }, []);

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
        { name: 'Terms & Conditions', path: '/delivery/terms', icon: LuShieldCheck },
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
        fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200 
        transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-28 px-8 flex items-center justify-center lg:justify-start border-b border-slate-100 bg-white">
            <Link to="/delivery/dashboard" className="flex items-center gap-3">
              <img src={logoImage} alt="Riddha Delivery" className="h-16 lg:h-14 w-auto object-contain" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar">
            {menuGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                 <h3 className="px-6 text-xs font-semibold text-slate-400">{group.title}</h3>
                 <div className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
                          flex items-center gap-4 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                          ${isActive 
                            ? 'bg-[#2A458A]/10 text-[#2A458A] border-l-4 border-[#2A458A]' 
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        <item.icon size={18} className="shrink-0 transition-transform group-hover:scale-110" />
                        <span>{item.name}</span>
                        {item.name === 'Orders' && pendingCount > 0 && (
                          <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            location.pathname === item.path ? 'bg-white text-[#2A458A]' : 'bg-[#2A458A] text-white'
                          }`}>
                            {pendingCount}
                          </span>
                        )}
                      </NavLink>
                    ))}
                 </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-white">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 group"
            >
              <LuLogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DeliverySidebar;

