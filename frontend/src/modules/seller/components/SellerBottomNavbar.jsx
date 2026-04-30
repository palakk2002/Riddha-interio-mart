import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiLayout, 
  FiSearch, 
  FiPlus, 
  FiPackage, 
  FiUser 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SellerBottomNavbar = () => {
  const navItems = [
    { name: 'Home', path: '/seller', icon: FiLayout },
    { name: 'Catalog', path: '/seller/catalog', icon: FiSearch },
    { name: 'Add', path: '/seller/add-product', icon: FiPlus },
    { name: 'My Prods', path: '/seller/my-products', icon: FiPackage },
    { name: 'Profile', path: '/seller/profile', icon: FiUser },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-soft-oatmeal shadow-[0_-5px_20px_rgba(0,0,0,0.05)] px-4 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/seller'}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 group transition-all duration-300 w-full ${
                isActive ? 'text-[#bd3b64]' : 'text-dusty-cocoa hover:text-[#bd3b64]'
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
                    <item.icon className={`h-6 w-6 transition-all duration-300 ${isActive ? 'text-[#bd3b64]' : 'text-dusty-cocoa group-hover:text-[#bd3b64]'}`} />
                  </motion.div>
                </div>
                
                <span className={`text-[10px] font-bold uppercase tracking-tight transition-all duration-300 leading-none mt-1 ${
                  isActive ? 'text-[#bd3b64]' : 'text-dusty-cocoa group-hover:text-[#bd3b64]'
                }`}>
                  {item.name}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="seller-nav-indicator"
                    className="absolute -top-3 w-8 h-1 bg-[#bd3b64] rounded-full"
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
