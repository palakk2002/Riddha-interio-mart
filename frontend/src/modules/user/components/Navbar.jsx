import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../data/CartContext";
import { useUser } from "../data/UserContext";
import SearchBar from "./SearchBar";
import api from '../../../shared/utils/api';
import { getDeliveryEstimate } from '../../../shared/utils/delivery';
import Logo from "../../../assets/WhatsApp Image 2026-04-23 at 1.37.51 PM.jpeg";

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const Navbar = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const dropdownTimeoutRef = useRef(null);
  const { cartCount } = useCart();
  const location = useLocation();
  const isCartPage = location.pathname === "/cart";
  const [pincode, setPincode] = useState('452018');
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  useEffect(() => {
    const savedPincode = localStorage.getItem('userPincode');
    if (savedPincode && savedPincode !== 'default') {
      setPincode(savedPincode);
    }

    // Fetch categories for mega menu
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data);
      } catch (err) {
        console.error('Failed to fetch navbar categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const closeMobile = () => {
    setIsOpen(false);
    setPoliciesOpen(false);
  };

  const handleCategoryEnter = (catId) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveCategory(catId);
  };

  const handleCategoryLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 200);
  };

  return (
    <>
      <nav className="bg-[#189D91] relative z-50">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          {/* Main Desktop Header Row */}
          <div className="hidden md:flex items-center justify-between py-3 gap-8">
            <div className="flex items-center gap-10 shrink-0">
              <Link to="/" className="flex items-center">
                <div className="bg-white p-1 md:p-1.5 rounded-xl flex items-center justify-center shadow-sm">
                  <img src={Logo} alt="Riddha Interio" className="h-12 md:h-16 w-auto object-contain" />
                </div>
              </Link>
              <div className="flex flex-col text-white">
                <span className="text-[11px] font-bold leading-tight">Delivery in <span className="text-[#D4A017]">{getDeliveryEstimate(pincode).time}</span></span>
                <button className="flex items-center gap-1 text-[13px] font-bold mt-0.5 group">
                  to <span className="text-[#D4A017] group-hover:underline">{pincode}</span> <FiChevronDown size={14} />
                </button>
              </div>
            </div>

            {!isCartPage && (
              <div className="flex-1 max-w-2xl px-4">
                <SearchBar variant="desktop" />
              </div>
            )}

            <div className="flex items-center gap-6 shrink-0">
              <Link to="/stores" className="flex flex-col items-center text-white/90 hover:text-white transition-colors group">
                <div className="h-6 w-6 mb-1 border-2 border-white/40 rounded flex items-center justify-center p-0.5 group-hover:border-white transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Store</span>
              </Link>
              <Link to="/contact" className="flex flex-col items-center text-white/90 hover:text-white transition-colors group">
                <div className="h-6 w-6 mb-1 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full transition-colors"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-center">Contact us</span>
              </Link>
              <Link to="/profile" className="flex flex-col items-center text-white/90 hover:text-white transition-colors group px-2 border-l border-white/20">
                <div className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform flex items-center justify-center overflow-hidden rounded-full font-bold text-[8px]">
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="h-full w-full" />
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[60px]">
                  {user ? (user.fullName?.split(' ')[0] || 'Profile') : 'Login'}
                </span>
              </Link>
              <Link to="/cart" className="flex flex-col items-center text-white/90 hover:text-white transition-colors group relative px-2 border-l border-white/20">
                <div className="relative">
                  <FiShoppingCart className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-[#189D91] text-[8px] font-black h-3.5 w-3.5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile Header Row */}
          <div className="flex md:hidden justify-between items-center h-16">
            <Link to="/" className="flex-shrink-0">
              <div className="bg-white p-1 rounded-lg flex items-center justify-center shadow-sm">
                <img src={Logo} alt="Riddha Interio" className="h-10 md:h-12 w-auto object-contain" />
              </div>
            </Link>
            <div className="flex items-center space-x-2">
              <Link to="/profile" className="p-2 text-white/80"><FiUser className="h-5 w-5" /></Link>
              <Link to="/cart" className="p-2 text-white/80 relative">
                <FiShoppingCart className="h-5 w-5" />
                {cartCount > 0 && <span className="absolute top-1 right-1 bg-white text-[#189D91] text-[8px] font-bold h-4 w-4 flex items-center justify-center rounded-full">{cartCount}</span>}
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white/80">
                {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {!isCartPage && (
            <div className="md:hidden pb-2 font-IBO">
              <SearchBar className="scale-95 origin-left" />
            </div>
          )}
        </div>
      </nav>

      {/* Desktop Secondary Categories Nav with Mega Menu */}
      <div
        className="hidden md:block bg-white border-b border-gray-200 relative z-40"
        onMouseLeave={handleCategoryLeave}
      >
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex items-center justify-start h-10 gap-8">
            {categories.map((cat, i) => (
              <div
                key={cat._id}
                className="relative h-full flex items-center group/cat"
                onMouseEnter={() => handleCategoryEnter(cat._id)}
              >
                <Link
                  to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`text-[13px] font-medium transition-colors h-full flex items-center border-b-2 ${activeCategory === cat._id
                    ? "text-[#189D91] border-[#189D91]"
                    : "text-gray-800 border-transparent hover:text-[#189D91]"
                    }`}
                >
                  {toTitleCase(cat.name)}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeCategory && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl overflow-hidden"
              onMouseEnter={() => {
                if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
              }}
            >
              <div className="max-w-[1440px] mx-auto px-12 py-10">
                {categories.find(c => c._id === activeCategory) && (
                  <div className="grid grid-cols-4 lg:grid-cols-5 gap-12">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-[#189D91] font-bold text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
                        {toTitleCase(categories.find(c => c._id === activeCategory).name)} Types
                      </h3>
                      <div className="flex flex-col gap-3">
                        {categories.find(c => c._id === activeCategory).subcategories?.map((sub, idx) => (
                          <Link
                            key={idx}
                            to={`/category/${categories.find(c => c._id === activeCategory).name.toLowerCase().replace(/\s+/g, '-')}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-gray-600 hover:text-[#189D91] text-sm font-medium transition-colors"
                          >
                            {toTitleCase(sub.name)}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-6 opacity-40">
                      <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Popular Brands</h3>
                      <div className="flex flex-col gap-3">
                        <span className="text-gray-400 text-sm">Premium Series</span>
                        <span className="text-gray-400 text-sm">Designer Collection</span>
                        <span className="text-gray-400 text-sm">Eco Friendly</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMobile} className="md:hidden fixed inset-0 bg-warm-sand/20 backdrop-blur-sm z-[90]" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="md:hidden fixed top-0 left-0 bottom-0 h-screen w-[85%] max-w-[320px] bg-white z-[100] shadow-2xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-6 py-8 border-b border-soft-oatmeal/15 bg-white/50 backdrop-blur-md">
                <Link to="/" onClick={closeMobile} className="flex items-center group">
                  <div className="bg-white p-1 rounded-lg flex items-center justify-center shadow-sm">
                    <img src={Logo} alt="Riddha Interio" className="h-10 md:h-12 w-auto object-contain" />
                  </div>
                </Link>
                <button onClick={closeMobile} className="p-2.5 text-deep-espresso/40 hover:text-deep-espresso rounded-full"><FiX className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand">Shop Categories</p>
                    {categories.length > 6 && (
                      <button
                        onClick={() => setShowMoreCategories(!showMoreCategories)}
                        className="text-[9px] font-black uppercase tracking-widest text-[#189D91]"
                      >
                        {showMoreCategories ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {categories.slice(0, showMoreCategories ? categories.length : 6).map((cat) => (
                      <div key={cat._id}>
                        <Link
                          to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={closeMobile}
                          className="block py-2 text-deep-espresso font-bold border-b border-soft-oatmeal/5"
                        >
                          {toTitleCase(cat.name)}
                        </Link>
                      </div>
                    ))}
                  </div>

                  {!showMoreCategories && categories.length > 6 && (
                    <button
                      onClick={() => setShowMoreCategories(true)}
                      className="w-full py-4 text-center border-t border-soft-oatmeal/10"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-warm-sand flex items-center justify-center gap-2">
                        +{categories.length - 6} More Collections <FiChevronRight />
                      </span>
                    </button>
                  )}
                </div>
              </div>
              <div className="px-8 py-6 border-t border-soft-oatmeal/15">
                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-deep-espresso/20 italic">© {new Date().getFullYear()} Riddha Interio Mart.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
