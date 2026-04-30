import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../user/data/UserContext';
import api from '../../../shared/utils/api';
import { useRBAC } from '../data/RBACContext';
import { permissionsMap } from '../data/permissionsMap';
import { 
  FiLayout, 
  FiBox, 
  FiTag, 
  FiSettings, 
  FiX, 
  FiChevronRight,
  FiGrid,
  FiStar,
  FiImage,
  FiPercent,
  FiTrendingUp,
  FiPlus,
  FiLogOut,
  FiUsers,
  FiClipboard,
  FiClock,
  FiPackage,
  FiTruck,
  FiMapPin,
  FiGift,
  FiShield,
  FiDollarSign
} from 'react-icons/fi';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import sidebarBg from '../../../assets/seller_sidebar_bg.png';

const menuItems = [
  { path: '/admin', icon: FiLayout, label: 'Dashboard' },
  { path: '/admin/analytics', icon: FiTrendingUp, label: 'Analytics' },
  { 
    label: 'Inventory', 
    icon: FiBox, 
    path: '/admin/inventory',
    children: [
      { path: '/admin/inventory', icon: FiGrid, label: 'All Products' },
      { path: '/admin/inventory/pending', icon: FiClock, label: 'Pending Approval', showBadge: true, badgeType: 'product' },
    ]
  },
  { path: '/admin/orders/tracking', icon: FiMapPin, label: 'Order Tracking' },
  { path: '/admin/delivery/assign', icon: FiTruck, label: 'Assign Delivery' },
  { 
    label: 'Create Listing', 
    icon: FiPlus, 
    path: '/admin/inventory/add-flow',
    children: [
      { path: '/admin/inventory/add', icon: FiPlus, label: 'Create Order' },
      { path: '/admin/catalog', icon: FiPackage, label: 'Select from Catalog' },
    ]
  },
  { path: '/admin/stock-management', icon: FiTrendingUp, label: 'Stock Management' },
  { 
    label: 'Order Management', 
    icon: FiClipboard, 
    path: '/admin/orders/all',
    children: [
      { path: '/admin/orders/all', icon: FiGrid, label: 'All Orders' },
      { path: '/admin/orders/pending', icon: FiClock, label: 'Pending Orders' },
    ]
  },
  { 
    label: 'Product Catalog', 
    icon: FiBox, 
    path: '/admin/catalog',
    children: [
      { path: '/admin/catalog', icon: FiGrid, label: 'Master Catalog' },
      { path: '/admin/catalog/add', icon: FiPlus, label: 'New Master Item' },
      { path: '/admin/bulk-upload', icon: FiPlus, label: 'Bulk Upload' },
    ]
  },
  { 
    label: 'Manage Categories', 
    icon: FiGrid, 
    path: '/admin/manage-categories',
    children: [
      { path: '/admin/manage-categories', icon: FiGrid, label: 'All Categories' },
      { path: '/admin/manage-categories/add', icon: FiPlus, label: 'Add Category' },
    ]
  },
  { 
    label: 'Seller Management', 
    icon: FiUsers, 
    path: '/admin/sellers',
    children: [
      { path: '/admin/sellers/pending', icon: FiGrid, label: 'Pending Sellers', showBadge: true },
      { path: '/admin/sellers/active', icon: FiGrid, label: 'Active Sellers' },
    ]
  },
  { path: '/admin/manage-hero', icon: FiImage, label: 'Home Banner' },
  { path: '/admin/manage-promo', icon: FiPercent, label: 'Promo Banner' },
  { 
    label: 'Section', 
    icon: FiGrid, 
    path: '/admin/manage-section',
    children: [
      { path: '/admin/manage-section', icon: FiGrid, label: 'All Section' },
      { path: '/admin/manage-section/create', icon: FiPlus, label: 'Create Section' },
    ]
  },
  {
    label: 'Favourite Section',
    icon: FiStar,
    path: '/admin/manage-favourites',
    children: [
      { path: '/admin/manage-favourites', icon: FiGrid, label: 'All Favourite Sections' },
      { path: '/admin/manage-favourites/create', icon: FiPlus, label: 'Create Favourite Section' },
    ]
  },
  { 
    label: 'Top Brands', 
    icon: FiTag, 
    path: '/admin/manage-brands',
    children: [
      { path: '/admin/manage-brands', icon: FiGrid, label: 'All Brands' },
      { path: '/admin/manage-brands/add', icon: FiPlus, label: 'Add Brand' },
    ]
  },
  { 
    label: 'Featured Highlights', 
    icon: FiStar, 
    path: '/admin/manage-featured',
    children: [
      { path: '/admin/manage-featured', icon: FiGrid, label: 'All Featured' },
      { path: '/admin/manage-featured/add', icon: FiPlus, label: 'Add Featured Product' },
    ]
  },
  { path: '/admin/bulk-orders', icon: FiPackage, label: 'Bulk Orders' },
  { 
    label: 'Customer Management', 
    icon: FiUsers, 
    path: '/admin/customers',
    children: [
      { path: '/admin/customers/individual', icon: FiGrid, label: 'Individual Customers' },
      { path: '/admin/customers/enterpriser', icon: FiGrid, label: 'Enterprisers' },
    ]
  },
  { 
    label: 'Payments', 
    icon: FiDollarSign, 
    path: '/admin/payments',
    children: [
      { path: '/admin/payments/users', icon: FiGrid, label: 'User Payments' },
      { path: '/admin/payments/delivery', icon: FiGrid, label: 'Delivery Payments' },
      { path: '/admin/payments/sellers', icon: FiGrid, label: 'Seller Payments' },
    ]
  },
  { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  { path: '/admin/referrals', icon: FiGift, label: 'Referral System' },
  { path: '/admin/team', icon: FiShield, label: 'Team Management' },
];

const NavItem = ({ item, onClose, expanded, onToggle, sellersCount, deliveryCount, productCount }) => {
  const { hasPermission, role } = useRBAC();
  const location = useLocation();
  const permissionKey = permissionsMap.menuMapping[item.label];
  
  if (permissionKey && !hasPermission(permissionKey)) {
    return null;
  }

  const hasChildren = item.children && item.children.length > 0;
  const isSelfActive = location.pathname === item.path;
  const isChildActive = hasChildren && item.children.some(child => location.pathname === child.path);
  const isActive = isSelfActive || isChildActive;


  const headerContent = (
    <div className="flex items-center gap-4 w-full text-left">
      <item.icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110 text-white' : 'text-white/70 group-hover:scale-110 group-hover:text-white'}`} />
      <span className="font-medium text-white">{item.label}</span>
    </div>
  );

  return (
    <div className="mb-2">
      <div 
        className={`
          flex items-center justify-between p-3 rounded-xl transition-all duration-300 group border border-white/5
          ${isActive 
            ? `bg-gradient-to-r ${role === 'admin' ? 'from-purple-600/20' : 'from-[#189D91]/20'} to-transparent border-l-4 ${role === 'admin' ? 'border-purple-500' : 'border-[#189D91]'} text-white shadow-lg ${role === 'admin' ? 'shadow-purple-900/10' : 'shadow-teal-900/10'} scale-[1.02]` 
            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/10'}
        `}
      >
        <div className="flex-1" onClick={() => { if (window.innerWidth < 1024 && !hasChildren) onClose(); }}>
          {item.path ? (
            <NavLink to={item.path} end={item.path === '/admin'} className="w-full">
              {headerContent}
            </NavLink>
          ) : (
            headerContent
          )}
        </div>
        
        {hasChildren && (
          <Motion.div
            className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(item.label);
            }}
          >
            <FiChevronRight size={16} className={`drop-shadow-md transition-colors ${isActive ? 'text-white' : 'text-white/60'}`} />
          </Motion.div>
        )}
        {!hasChildren && <FiChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-white/60" />}
      </div>

      <AnimatePresence>
        {hasChildren && expanded && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-6 mt-1 space-y-1 py-1 text-left">
              {item.children.map((child) => {
                let count = 0;
                if (child.badgeType === 'delivery') count = deliveryCount;
                else if (child.badgeType === 'product') count = productCount;
                else count = sellersCount;
                
                return (
                  <NavLink
                    key={child.path + child.label}
                    to={child.path}
                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                    className={({ isActive: childActive }) => `
                      flex items-center gap-4 p-2.5 rounded-xl transition-all duration-300 group border border-transparent
                      ${childActive 
                        ? 'text-white font-bold bg-white/10 border-white/5 shadow-sm' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    {({ isActive: isCurrentChildActive }) => (
                      <>
                        <child.icon size={16} className={`transition-transform duration-300 group-hover:scale-110 ${isCurrentChildActive ? 'text-white' : 'text-white/50'}`} />
                        <span className="text-sm tracking-wide text-white">{child.label}</span>
                        {child.showBadge && count > 0 && (
                          <span className={`ml-auto w-5 h-5 ${role === 'admin' ? 'bg-[#a855f7]' : 'bg-[#189D91]'} text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-lg ${role === 'admin' ? 'shadow-purple-500/40' : 'shadow-teal-500/40'}`}>
                            {count}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUser();
  const { role } = useRBAC();
  const [expandedItems, setExpandedItems] = useState(() => {
    const initial = {};
    menuItems.forEach(item => {
      if (item.children?.some(child => location.pathname === child.path)) {
        initial[item.label] = true;
      }
    });
    return initial;
  });

  const [sellersCount, setSellersCount] = useState(0);
  const [deliveryCount, setDeliveryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchPendingCounts = async () => {
      try {
        const [sellersRes, deliveryRes, productRes] = await Promise.all([
          api.get('/auth/admin/sellers/pending'),
          api.get('/delivery'),
          api.get('/products', { params: { isApproved: 'pending', isActive: 'all' } })
        ]);
        setSellersCount(sellersRes.data.data.length);
        const pendingPartners = deliveryRes.data.data.filter(p => p.approvalStatus === 'Pending');
        setDeliveryCount(pendingPartners.length);
        setProductCount(productRes.data.data.length);
      } catch (err) {
        console.error('Failed to fetch counts for sidebar:', err);
      }
    };
    fetchPendingCounts();
    const interval = setInterval(fetchPendingCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <Motion.div
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
          fixed lg:static top-0 left-0 h-screen w-72 lg:shrink-0 ${role === 'admin' ? 'bg-[#240046]' : 'bg-[#112d2a]'} text-white z-50 flex flex-col shadow-2xl lg:shadow-none overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Full Sidebar Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={sidebarBg} 
            alt="Interior Decorative Lighting" 
            className="w-full h-full object-cover opacity-10 grayscale"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${role === 'admin' ? 'from-[#240046] via-[#240046]/95 to-[#240046]' : 'from-[#112d2a] via-[#112d2a]/95 to-[#112d2a]'}`}></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${role === 'admin' ? 'bg-warm-sand' : 'bg-[#189D91]'} rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
              {role === 'admin' ? 'R' : 'A'}
            </div>
            <span className="font-display font-bold text-xl tracking-wide uppercase text-white">
              Riddha <span className={role === 'admin' ? 'text-warm-sand' : 'text-[#189D91]'}>{role === 'admin' ? 'Admin' : 'Assistant'}</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 p-4 mt-4 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavItem 
              key={item.label} 
              item={item} 
              onClose={onClose} 
              expanded={expandedItems[item.label]}
              onToggle={toggleExpand}
              sellersCount={sellersCount}
              deliveryCount={deliveryCount}
              productCount={productCount}
            />
          ))}
        </nav>

        {/* Footer info and logout */}
        <div className="relative z-10 p-6 border-t border-white/10 mt-auto backdrop-blur-sm bg-black/20">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold ${role === 'admin' ? 'text-purple-300' : 'text-teal-300'} hover:bg-white/5 transition-colors group mb-4`}
          >
            <FiLogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
          <p className="font-medium text-white/80 drop-shadow-md">© 2026 Riddha Interio Mart</p>
          <p className="mt-1 text-[10px] tracking-wide uppercase drop-shadow-md">{role === 'admin' ? 'Master Control' : 'Operation Unit'} v1.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
