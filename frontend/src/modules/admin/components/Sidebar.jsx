import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../user/data/UserContext';
import api from '../../../shared/utils/api';
import { 
  LuLayoutDashboard, 
  LuBox, 
  LuTags, 
  LuSettings, 
  LuX, 
  LuChevronRight,
  LuGrid2X2,
  LuStar,
  LuImage,
  LuBadgePercent,
  LuLayoutGrid,
  LuTrendingUp,
  LuPlus,
  LuLogOut,
  LuUsers,
  LuClipboardList,
  LuClock,
  LuPackage,
  LuTruck,
  LuMapPin
} from 'react-icons/lu';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import sidebarBg from '../../../assets/seller_sidebar_bg.png';

const menuItems = [
  { path: '/admin', icon: LuLayoutDashboard, label: 'Dashboard' },
  { path: '/admin/orders/tracking', icon: LuMapPin, label: 'Order Tracking' },
  { path: '/admin/delivery/assign', icon: LuTruck, label: 'Assign Delivery' },
  { 
    label: 'Create Listing', 
    icon: LuPlus, 
    path: '/admin/inventory/add-flow',
    children: [
      { path: '/admin/inventory/add', icon: LuPlus, label: 'Create Order' },
      { path: '/admin/catalog', icon: LuPackage, label: 'Select from Catalog' },
    ]
  },
  { 
    label: 'Product Management', 
    icon: LuPackage, 
    path: '/admin/inventory',
    children: [
      { path: '/admin/inventory', icon: LuLayoutGrid, label: 'All Inventory' },
      { path: '/admin/inventory/pending', icon: LuClock, label: 'Pending Approval', showBadge: true, badgeType: 'product' },
    ]
  },
  { 
    label: 'Order Management', 
    icon: LuClipboardList, 
    path: '/admin/orders/all',
    children: [
      { path: '/admin/orders/all', icon: LuLayoutGrid, label: 'All Orders' },
      { path: '/admin/orders/pending', icon: LuClock, label: 'Pending Orders' },
    ]
  },
  { 
    label: 'Product Catalog', 
    icon: LuBox, 
    path: '/admin/catalog',
    children: [
      { path: '/admin/catalog', icon: LuLayoutGrid, label: 'Master Catalog' },
      { path: '/admin/catalog/add', icon: LuPlus, label: 'New Master Item' },
    ]
  },
  { 
    label: 'Manage Categories', 
    icon: LuGrid2X2, 
    path: '/admin/manage-categories',
    children: [
      { path: '/admin/manage-categories', icon: LuLayoutGrid, label: 'All Categories' },
      { path: '/admin/manage-categories/add', icon: LuPlus, label: 'Add Category' },
    ]
  },
  { 
    label: 'Seller Management', 
    icon: LuUsers, 
    path: '/admin/sellers',
    children: [
      { path: '/admin/sellers/pending', icon: LuLayoutGrid, label: 'Pending Sellers', showBadge: true },
      { path: '/admin/sellers/active', icon: LuLayoutGrid, label: 'Active Sellers' },
    ]
  },
  { path: '/admin/manage-hero', icon: LuImage, label: 'Home Banner' },
  { path: '/admin/manage-promo', icon: LuBadgePercent, label: 'Promo Banner' },
  { 
    label: 'Section', 
    icon: LuLayoutGrid, 
    path: '/admin/manage-section',
    children: [
      { path: '/admin/manage-section', icon: LuLayoutGrid, label: 'All Section' },
      { path: '/admin/manage-section/create', icon: LuPlus, label: 'Create Section' },
    ]
  },
  {
    label: 'Favourite Section',
    icon: LuStar,
    path: '/admin/manage-favourites',
    children: [
      { path: '/admin/manage-favourites', icon: LuLayoutGrid, label: 'All Favourite Sections' },
      { path: '/admin/manage-favourites/create', icon: LuPlus, label: 'Create Favourite Section' },
    ]
  },
  { 
    label: 'Top Brands', 
    icon: LuTags, 
    path: '/admin/manage-brands',
    children: [
      { path: '/admin/manage-brands', icon: LuLayoutGrid, label: 'All Brands' },
      { path: '/admin/manage-brands/add', icon: LuPlus, label: 'Add Brand' },
    ]
  },
  { 
    label: 'Featured Highlights', 
    icon: LuStar, 
    path: '/admin/manage-featured',
    children: [
      { path: '/admin/manage-featured', icon: LuLayoutGrid, label: 'All Featured' },
      { path: '/admin/manage-featured/add', icon: LuPlus, label: 'Add Featured Product' },
    ]
  },
  { path: '/admin/settings', icon: LuSettings, label: 'Settings' },
];

const NavItem = ({ item, onClose, expanded, onToggle, sellersCount, deliveryCount, productCount }) => {
  const hasChildren = item.children && item.children.length > 0;
  const location = useLocation();
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
            ? 'bg-red-800 text-white shadow-xl shadow-red-900/20 border-white/10 scale-[1.02]' 
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
            <LuChevronRight size={16} className={`drop-shadow-md transition-colors ${isActive ? 'text-white' : 'text-white/60'}`} />
          </Motion.div>
        )}
        {!hasChildren && <LuChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-white/60" />}
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
                          <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/40">
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
          fixed lg:static top-0 left-0 h-screen w-72 lg:shrink-0 bg-deep-espresso text-white z-50 flex flex-col shadow-2xl lg:shadow-none overflow-hidden
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
          <div className="absolute inset-0 bg-gradient-to-b from-deep-espresso via-deep-espresso/95 to-deep-espresso"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warm-sand rounded-lg flex items-center justify-center text-deep-espresso font-bold text-xl">
              R
            </div>
            <span className="font-display font-bold text-xl tracking-wide uppercase text-white">
              Riddha <span className="text-warm-sand">Admin</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <LuX size={24} />
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
        <div className="relative z-10 p-6 border-t border-white/10 mt-auto backdrop-blur-sm bg-deep-espresso/20">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors group mb-4"
          >
            <LuLogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
          <p className="font-medium text-white/80 drop-shadow-md">© 2026 Riddha Interio Mart</p>
          <p className="mt-1 text-[10px] tracking-wide uppercase drop-shadow-md">Admin Workspace v1.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
