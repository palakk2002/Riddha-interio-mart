import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LuLayoutDashboard, 
  LuSearch, 
  LuPlus, 
  LuPackage, 
  LuUser 
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const SellerBottomNavbar = () => {
  const navItems = [
    { name: 'Home', path: '/seller', icon: LuLayoutDashboard },
    { name: 'Catalog', path: '/seller/catalog', icon: LuSearch },
    { name: 'Add', path: '/seller/add-product', icon: LuPlus },
    { name: 'My Prods', path: '/seller/my-products', icon: LuPackage },
    { name: 'Profile', path: '/seller/profile', icon: LuUser },
  ];

  return (
    <nav className="lg:hidden fixed bottom-5 left-4 right-4 z-50">
      <div className="bg-deep-espresso/90 backdrop-blur-2xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.3)] px-4 py-3 rounded-[28px] flex justify-between items-center transition-all duration-500">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/seller'}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 group transition-all duration-300 ${
                isActive ? 'text-warm-sand' : 'text-white/40 hover:text-white/60'
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
                  isActive ? 'text-warm-sand' : 'text-white/40'
                }`}>
                  {item.name}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="seller-nav-glow"
                    className="absolute -bottom-2 w-6 h-1 bg-warm-sand/30 blur-md rounded-full"
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

export default SellerBottomNavbar;
