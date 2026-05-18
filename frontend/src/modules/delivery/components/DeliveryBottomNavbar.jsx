import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LuLayoutDashboard, 
  LuPackage, 
  LuWallet, 
  LuUser 
} from 'react-icons/lu';
import { motion } from 'framer-motion';

const DeliveryBottomNavbar = ({ isHidden }) => {
  const navItems = [
    { name: 'Home', path: '/delivery/dashboard', icon: LuLayoutDashboard },
    { name: 'Orders', path: '/delivery/orders', icon: LuPackage },
    { name: 'Gains', path: '/delivery/earnings', icon: LuWallet },
    { name: 'Self', path: '/delivery/profile', icon: LuUser },
  ];

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${isHidden ? 'translate-y-full' : 'translate-y-0'}`}>
      <div className="bg-white/95 backdrop-blur-2xl border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] px-6 py-4 pb-6 flex justify-between items-center transition-all duration-500">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1.5 group transition-all duration-300 ${
                isActive ? 'text-[#189D91]' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <motion.div
                    animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <item.icon className="h-6 w-6 transition-all duration-300" />
                  </motion.div>
                </div>
                
                <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 leading-none mt-1 ${
                  isActive ? 'text-[#189D91]' : 'text-slate-400'
                }`}>
                  {item.name}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="delivery-nav-glow"
                    className="absolute -top-4 w-8 h-1 bg-[#189D91] rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default DeliveryBottomNavbar;
