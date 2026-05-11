import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LuLayoutDashboard, 
  LuPackage, 
  LuWallet, 
  LuUser 
} from 'react-icons/lu';
import { motion } from 'framer-motion';

const DeliveryBottomNavbar = () => {
  const navItems = [
    { name: 'Home', path: '/delivery/dashboard', icon: LuLayoutDashboard },
    { name: 'Orders', path: '/delivery/orders', icon: LuPackage },
    { name: 'Gains', path: '/delivery/earnings', icon: LuWallet },
    { name: 'Self', path: '/delivery/profile', icon: LuUser },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/95 backdrop-blur-2xl border-t border-soft-oatmeal/30 shadow-[0_-5px_20px_rgba(0,27,78,0.1)] px-6 py-3 pb-safe flex justify-between items-center transition-all duration-500">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 group transition-all duration-300 ${
                isActive ? 'text-deep-espresso' : 'text-deep-espresso/40 hover:text-deep-espresso/60'
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
                    <item.icon className="h-5 w-5 transition-all duration-300" />
                  </motion.div>
                </div>
                
                <span className={`text-[8px] font-black uppercase tracking-wider transition-all duration-300 leading-none mt-1 ${
                  isActive ? 'text-deep-espresso' : 'text-deep-espresso/40'
                }`}>
                  {item.name}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="delivery-nav-glow"
                    className="absolute -top-3 w-6 h-1 bg-deep-espresso rounded-full"
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
