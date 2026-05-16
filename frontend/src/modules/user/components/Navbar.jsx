import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiChevronDown,
  FiChevronRight,
  FiHome,
  FiGrid,
  FiShoppingBag,
  FiMapPin,
  FiInfo,
  FiPhone,
  FiRefreshCw,
  FiShield,
  FiLogOut,
  FiXCircle,
  FiTruck,
  FiFileText
} from "react-icons/fi";
import { AiOutlineShop } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { LuWallet } from "react-icons/lu";
import { useCart } from "../data/CartContext";
import { useUser } from "../data/UserContext";
import SearchBar from "./SearchBar";
import api from '../../../shared/utils/api';
import { getDeliveryEstimate } from '../../../shared/utils/delivery';
import BulkOrderModal from "./BulkOrderModal";
import NotificationDropdown from "../../../shared/components/NotificationDropdown";
import Logo from "../../../assets/WhatsApp Image 2026-05-06 at 3.50.08 PM.jpeg";
import TransparentLogo from "../../../assets/transparent logo.png";

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const NAV_CATEGORIES = [
  { name: 'Furniture', slug: 'furniture' },
  { name: 'Lighting', slug: 'lighting' },
  { name: 'Wall Solutions', slug: 'wall-solutions' },
  { name: 'Decor', slug: 'decor' },
  { name: 'Hardware', slug: 'hardware' },
  { name: 'Flooring', slug: 'flooring' },
  { name: 'Modular Kitchen', slug: 'modular-kitchen' },
  { name: 'Bathroom', slug: 'bathroom' },
  { name: 'Office Furniture', slug: 'office-furniture' },
  { name: 'Outdoor', slug: 'outdoor' }
];

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-[#189D91]/5 hover:text-[#189D91] transition-all group"
  >
    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#189D91]/10 transition-colors">
      <Icon size={18} />
    </div>
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </Link>
);

const Navbar = () => {
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const dropdownTimeoutRef = useRef(null);
  const { cartCount } = useCart();
  const location = useLocation();
  const isCartPage = location.pathname === "/cart";
  const [pincode, setPincode] = useState('700016');
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
      <nav className="bg-[#189D91] md:bg-[#006B5C] border-b-0 md:border-b border-white/10 relative z-50">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          {/* Main Desktop Header Row */}
          <div className="hidden md:flex items-center justify-between py-1 md:py-0.5 gap-4 lg:gap-6">
            <div className="flex items-center gap-6 lg:gap-8 shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src={TransparentLogo}
                  alt="Riddha Interio"
                  className="h-14 lg:h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Delivery Location */}
              <div className="flex items-center gap-2 text-white">
                <div className="p-1.5 rounded-full bg-white/10">
                  <FiMapPin className="text-white w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] lg:text-[10.5px] font-medium text-white/60 leading-none">Delivering to</span>
                  <button className="flex items-center gap-1 text-[11px] lg:text-[12px] font-bold text-white mt-0.5 group">
                    Kolkata - <span className="">{pincode}</span> <FiChevronDown className="text-white/40 group-hover:text-white transition-colors" size={12} />
                  </button>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="flex items-center gap-2 text-white border-l border-white/10 pl-4">
                <div className="p-1.5 rounded-full bg-white/10">
                  <FiTruck className="text-white w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] lg:text-[10.5px] font-medium text-white/60 leading-none">Delivery in</span>
                  <span className="text-[11px] lg:text-[12px] font-bold text-teal-200 mt-0.5">
                    {getDeliveryEstimate(pincode).time}
                  </span>
                </div>
              </div>
            </div>

            {!isCartPage && (
              <div className="flex-1 max-w-xl xl:max-w-2xl px-2">
                <SearchBar variant="premium" />
              </div>
            )}

            <div className="flex items-center gap-4 lg:gap-6 shrink-0">
              {/* Become a Seller */}
              <Link to="/seller/join" className="flex items-center gap-2.5 group">
                <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                  <AiOutlineShop className="text-white w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] lg:text-[12px] font-bold text-white leading-tight">Become a Seller</span>
                  <span className="text-[10px] lg:text-[11px] font-bold text-teal-200">Join Now</span>
                </div>
              </Link>

              {/* Bulk Order */}
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="flex items-center gap-2.5 group border-l border-white/10 pl-4 lg:pl-6"
              >
                <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors text-left">
                  <FiFileText className="text-white w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] lg:text-[12px] font-bold text-white leading-tight">Bulk Order</span>
                  <span className="text-[10px] lg:text-[11px] font-bold text-teal-200">Get Best Price</span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Header Row */}
          <div className="flex md:hidden justify-between items-center h-12 px-1">
            <Link to="/" className="flex-shrink-0">
              <img src={Logo} alt="Riddha Interio" className="h-8 w-auto object-contain" />
            </Link>
            <div className="flex items-center gap-1">
              <Link to="/profile" className="p-2 text-white">
                <FiUser className="h-6 w-6" />
              </Link>
              {user && <NotificationDropdown isMobile={true} />}
              <Link to="/cart" className="p-2 text-white relative">
                <FiShoppingCart className="h-6 w-6" />
                {cartCount > 0 && <span className="absolute top-1 right-1 bg-[#FF6B35] text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-[#189D91]">{cartCount}</span>}
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
                {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {!isCartPage && (
            <div className="md:hidden pb-3">
              <SearchBar variant="premium" />
            </div>
          )}
        </div>

      </nav>


      {/* Desktop Secondary Categories Nav with Mega Menu */}
      <div className="hidden md:block bg-white border-b border-gray-200 relative z-40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-6 overflow-hidden">
            {/* All Categories Button */}
            <div className="relative group/cat shrink-0">
              <Link 
                to="/categories"
                className="flex items-center gap-2 bg-[#004D40] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#003d33] transition-colors"
              >
                <FiMenu className="w-5 h-5" />
                <span>All Categories</span>
              </Link>

              {/* Categories Dropdown */}
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 z-50">
                <div className="bg-white shadow-2xl border border-gray-100 rounded-xl py-3 w-64">
                  {NAV_CATEGORIES.map((cat, i) => (
                    <Link
                      key={i}
                      to={`/category/${cat.slug}`}
                      className="flex items-center gap-3 px-6 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-[#189D91] transition-colors"
                    >
                      <span className="text-sm font-bold tracking-tight">{cat.name}</span>
                    </Link>
                  ))}
                  <div className="mt-2 pt-2 border-t border-gray-50 px-6">
                    <Link to="/categories" className="text-xs font-bold text-[#189D91] hover:underline">View All Categories</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Categories */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
              {NAV_CATEGORIES.map((cat, i) => (
                <div
                  key={i}
                  className="relative h-full flex items-center shrink-0"
                >
                  <Link
                    to={`/category/${cat.slug}`}
                    className={`text-[13px] font-bold tracking-tight transition-all h-full flex items-center whitespace-nowrap px-3 py-4 ${activeCategory === cat.slug
                      ? "text-[#189D91]"
                      : "text-gray-700 hover:text-[#189D91]"
                      }`}
                  >
                    {cat.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* User Actions on the Right */}
          <div className="flex items-center gap-6 shrink-0 border-l border-gray-100 pl-6">
            <Link to="/profile" className="flex items-center gap-2 group">
              <FiUser className="w-5 h-5 text-gray-700 group-hover:text-[#189D91] transition-colors" />
              <span className="text-[13px] font-bold text-gray-700 group-hover:text-[#189D91] transition-colors">
                {user ? (user.fullName?.split(' ')[0] || 'Profile') : 'Login / Sign Up'}
              </span>
            </Link>


            <Link to="/cart" className="flex items-center gap-2 group relative">
              <FiShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-[#189D91] transition-colors" />
              <span className="text-[13px] font-bold text-gray-700 group-hover:text-[#189D91] transition-colors">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B35] text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user && (
              <div className="flex items-center border-l border-gray-100 pl-4">
                <NotificationDropdown />
              </div>
            )}
          </div>
        </div>


        {/* Mega Menu Dropdown - DISABLED AS REQUESTED */}
        {/* <AnimatePresence>
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
        </AnimatePresence> */}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobile}
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[90]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed top-0 left-0 bottom-0 h-screen w-[80%] max-w-[300px] bg-white z-[100] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 bg-white">
                <Link to="/" onClick={closeMobile} className="flex items-center group">
                  <img
                    src={Logo}
                    alt="Riddha Interio"
                    className="h-10 w-auto object-contain bg-white rounded-md px-1 shadow-sm"
                  />
                </Link>
                <button onClick={closeMobile} className="p-2.5 text-deep-espresso/40 hover:text-deep-espresso rounded-full"><FiX className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {/* User Profile Header (Mobile Sidebar) */}
                <div className="px-6 py-6 bg-gray-50/50 border-b border-gray-100 mb-2">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-[#189D91]/10 flex items-center justify-center text-[#189D91] border-2 border-white shadow-sm overflow-hidden font-bold">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#189D91]">Welcome back</p>
                        <h4 className="text-base font-black text-gray-900 leading-tight">{user.fullName || 'User'}</h4>
                      </div>
                    </div>
                  ) : (
                    <Link to="/login" onClick={closeMobile} className="flex items-center gap-4 group">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-white shadow-sm">
                        <FiUser size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Join the family</p>
                        <h4 className="text-base font-black text-[#189D91] group-hover:underline">Login / Signup</h4>
                      </div>
                    </Link>
                  )}
                </div>

                <div className="px-4 py-2 space-y-1">
                  {/* Primary Nav */}
                  <div className="pb-4 mb-4 border-b border-gray-50">
                    <SidebarLink to="/" icon={FiHome} label="Home" onClick={closeMobile} />
                    <SidebarLink to="/categories" icon={FiGrid} label="Shop by Category" onClick={closeMobile} />

                    {/* Dynamic Categories in Mobile Sidebar */}
                    <div className="px-4 py-2 grid grid-cols-2 gap-2">
                      {NAV_CATEGORIES.map((cat, i) => (
                        <Link
                          key={i}
                          to={`/category/${cat.slug}`}
                          onClick={closeMobile}
                          className="px-3 py-2.5 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-600 hover:text-[#189D91] hover:bg-[#189D91]/5 transition-all text-center flex items-center justify-center"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>

                    <SidebarLink to="/referral-rewards" icon={LuWallet} label="Riddha Wallet" onClick={closeMobile} />
                    <SidebarLink to="/orders" icon={FiShoppingBag} label="My Orders" onClick={closeMobile} />
                    <SidebarLink to="/profile" icon={FiUser} label="My Account" onClick={closeMobile} />
                  </div>

                  {/* Information & Support */}
                  <div className="pb-4 mb-4 border-b border-gray-50">
                    <p className="px-4 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400/60">Support & Info</p>
                    <SidebarLink to="/stores" icon={FiMapPin} label="Our Stores" onClick={closeMobile} />
                    <SidebarLink to="/about" icon={FiInfo} label="About Us" onClick={closeMobile} />
                    <SidebarLink to="/contact" icon={FiPhone} label="Contact Us" onClick={closeMobile} />
                  </div>

                  {/* Legal */}
                  <div className="pb-4">
                    <p className="px-4 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400/60">Policies</p>
                    <SidebarLink to="/policies/returns" icon={FiRefreshCw} label="Returns & Refunds" onClick={closeMobile} />
                    <SidebarLink to="/policies/cancellation" icon={FiXCircle} label="Cancellation" onClick={closeMobile} />
                    <SidebarLink to="/terms" icon={FiShield} label="Terms & Conditions" onClick={closeMobile} />
                  </div>
                </div>
              </div>

              {/* Logout Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                {user ? (
                  <button
                    onClick={() => { logout(); navigate('/'); closeMobile(); }}
                    className="w-full py-3 px-4 rounded-xl border-2 border-red-50 text-red-600 font-black text-sm flex items-center justify-center gap-3 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut size={18} /> Logout Account
                  </button>
                ) : (
                  <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-300 text-center italic">© {new Date().getFullYear()} Riddha Interio Mart.</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BulkOrderModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />
    </>
  );
};


export default Navbar;


