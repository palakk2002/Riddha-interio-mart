import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../data/CartContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [desktopPoliciesOpen, setDesktopPoliciesOpen] = useState(false);
  const { cartCount } = useCart();
  const policiesTimeoutRef = useRef(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Shop by Category', path: '/shop' },
    { name: 'My Orders', path: '/orders' },
    { name: 'Stores', path: '/stores' },
    { name: 'About', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const policyLinks = [
    { name: 'Cancellation', path: '/policies/cancellation' },
    { name: 'Returns', path: '/policies/returns' },
    { name: 'Refund', path: '/policies/refund' },
  ];

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        setPoliciesOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const closeMobile = () => {
    setIsOpen(false);
    setPoliciesOpen(false);
  };

  const handlePoliciesEnter = () => {
    clearTimeout(policiesTimeoutRef.current);
    setDesktopPoliciesOpen(true);
  };

  const handlePoliciesLeave = () => {
    policiesTimeoutRef.current = setTimeout(() => {
      setDesktopPoliciesOpen(false);
    }, 150);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#FDFBF9] md:bg-white/70 backdrop-blur-2xl border-b-2 border-warm-sand/20 md:border-b md:border-soft-oatmeal/10 shadow-sm md:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center h-20 md:h-24 gap-12">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl font-display font-black text-deep-espresso tracking-tighter">
                RIDDHA <span className="text-warm-sand group-hover:text-deep-espresso transition-colors">INTERIO</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-xs uppercase tracking-[0.2em] font-bold transition-all hover:text-warm-sand whitespace-nowrap ${
                      isActive ? 'text-warm-sand' : 'text-deep-espresso/60'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Policies Dropdown */}
              <div
                className="relative"
                onMouseEnter={handlePoliciesEnter}
                onMouseLeave={handlePoliciesLeave}
              >
                <button
                  className={`flex items-center gap-1 text-xs uppercase tracking-[0.2em] font-bold transition-all hover:text-warm-sand whitespace-nowrap ${
                    desktopPoliciesOpen ? 'text-warm-sand' : 'text-deep-espresso/60'
                  }`}
                >
                  Policies
                  <FiChevronDown className={`h-3 w-3 transition-transform duration-200 ${desktopPoliciesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {desktopPoliciesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-xl shadow-xl border border-soft-oatmeal/20 py-2 min-w-[180px] z-50"
                    >
                      {policyLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setDesktopPoliciesOpen(false)}
                          className="block px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-bold text-deep-espresso/60 hover:text-warm-sand hover:bg-golden-glow/20 transition-all"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Terms */}
              <NavLink
                to="/terms"
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.2em] font-bold transition-all hover:text-warm-sand whitespace-nowrap ${
                    isActive ? 'text-warm-sand' : 'text-deep-espresso/60'
                  }`
                }
              >
                Terms
              </NavLink>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md">
              <SearchBar />
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-2 sm:space-x-5">
              <Link
                to="/profile"
                className="p-3 text-deep-espresso/70 hover:text-warm-sand transition-colors"
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FiUser className="h-6 w-6" />
                </motion.div>
              </Link>
              
              <Link 
                to="/cart" 
                className="p-3 text-deep-espresso/70 hover:text-warm-sand transition-colors relative"
              >
                <FiShoppingCart className="h-6 w-6" />
                <AnimatePresence mode="popLayout">
                  {cartCount > 0 && (
                    <motion.span 
                      key={cartCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2 right-2 bg-warm-sand text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full shadow-lg"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-3 text-white bg-warm-sand shadow-lg shadow-warm-sand/20 rounded-full"
              >
                {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>

          {/* Persistent Mobile Search Bar Row */}
          <div className="md:hidden pb-4">
            <SearchBar />
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu - Outside nav to avoid containing block issues with backdrop-filter */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMobile}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 450, damping: 45, mass: 1 }}
              className="md:hidden fixed top-0 left-0 bottom-0 h-screen w-[85%] max-w-[320px] bg-white z-[100] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-6 py-8 border-b border-soft-oatmeal/15 bg-white/50 backdrop-blur-md">
                <Link to="/" onClick={closeMobile} className="flex items-center group">
                  <span className="text-xl font-display font-black text-deep-espresso tracking-tighter">
                    RIDDHA <span className="text-warm-sand">INTERIO</span>
                  </span>
                </Link>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={closeMobile}
                  className="p-2.5 text-deep-espresso/40 hover:text-deep-espresso hover:bg-soft-oatmeal/10 rounded-full transition-all"
                >
                  <FiX className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Sidebar Links */}
              <div className="flex-1 overflow-y-auto pt-6 pb-12 px-6 space-y-1 no-scrollbar">
                {navLinks.filter(link => link.name !== 'Products').map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMobile}
                    className="block py-3.5 text-[15px] font-display font-bold text-deep-espresso/80 hover:text-warm-sand transition-colors border-b border-soft-oatmeal/5"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="h-px bg-soft-oatmeal/10 my-4" />

                {/* Policies Accordion */}
                <div className="border-b border-soft-oatmeal/5">
                  <button
                    onClick={() => setPoliciesOpen(!policiesOpen)}
                    className="w-full flex items-center justify-between py-3.5 text-[15px] font-display font-bold text-deep-espresso/80 hover:text-warm-sand transition-colors"
                  >
                    <span>Policies</span>
                    <motion.div
                      animate={{ rotate: policiesOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronRight className="h-4 w-4 text-warm-sand/50" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {policiesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden bg-golden-glow/10 rounded-xl mb-4"
                      >
                        <div className="pl-4 py-2 space-y-1">
                          {policyLinks.map((link) => (
                            <Link
                              key={link.name}
                              to={link.path}
                              onClick={closeMobile}
                              className="block py-2.5 text-[14px] font-medium text-deep-espresso/60 hover:text-warm-sand transition-colors"
                            >
                              {link.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/terms"
                  onClick={closeMobile}
                  className="block py-3.5 text-[15px] font-display font-bold text-deep-espresso/80 hover:text-warm-sand transition-colors border-b border-soft-oatmeal/5"
                >
                  Terms & Conditions
                </Link>

                <div className="h-px bg-soft-oatmeal/10 my-4" />

                <Link
                  to="/profile"
                  onClick={closeMobile}
                  className="flex items-center gap-3 py-3.5 text-[15px] font-display font-bold text-deep-espresso/80 hover:text-warm-sand transition-colors"
                >
                  <FiUser className="h-4 w-4" />
                  My Account
                </Link>
              </div>

              {/* Sidebar Footer */}
              <div className="px-8 py-6 border-t border-soft-oatmeal/15 bg-soft-oatmeal/5">
                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-deep-espresso/20 italic">
                  © {new Date().getFullYear()} Riddha Interio Mart. Crafted for Luxury.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
