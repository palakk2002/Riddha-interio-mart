import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  LuPlus
} from 'react-icons/lu';
import sidebarBg from '../../../assets/seller_sidebar_bg.png';

const menuItems = [
  { path: '/admin', icon: LuLayoutDashboard, label: 'Dashboard' },
  { path: '/admin/analytics', icon: LuTrendingUp, label: 'Analytics' },
  { 
    label: 'Catalog', 
    icon: LuBox, 
    path: '/admin/catalog',
    children: [
      { path: '/admin/catalog', icon: LuLayoutGrid, label: 'All Products' },
      { path: '/admin/catalog/add', icon: LuPlus, label: 'Add New Product' },
    ]
  },
  { 
    label: 'Categories', 
    icon: LuTags, 
    path: '/admin/categories',
    children: [
      { path: '/admin/categories', icon: LuLayoutGrid, label: 'All Categories' },
      { path: '/admin/manage-categories/add', icon: LuPlus, label: 'Add Category' },
    ]
  },
  { path: '/admin/settings', icon: LuSettings, label: 'Settings' },
];

const homepageItems = [
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
    label: 'Featured Products', 
    icon: LuStar, 
    path: '/admin/manage-featured',
    children: [
      { path: '/admin/manage-featured', icon: LuLayoutGrid, label: 'All Featured' },
      { path: '/admin/manage-featured/add', icon: LuPlus, label: 'Add Featured Product' },
    ]
  },
  { 
    label: 'Favourite Categories', 
    icon: LuLayoutGrid, 
    path: '/admin/manage-favourites',
    children: [
      { path: '/admin/manage-favourites', icon: LuLayoutGrid, label: 'All Favourites' },
      { path: '/admin/manage-favourites/add', icon: LuPlus, label: 'Add Category Item' },
    ]
  },
  { path: '/admin/manage-hero', icon: LuImage, label: 'Hero Banner' },
  { path: '/admin/manage-promo', icon: LuBadgePercent, label: 'Promo Banner' },
  { 
    label: 'Category Grid', 
    icon: LuLayoutGrid, 
    path: '/admin/manage-grid',
    children: [
      { path: '/admin/manage-grid', icon: LuLayoutGrid, label: 'All Items' },
      { path: '/admin/manage-grid/add', icon: LuPlus, label: 'Add Grid Item' },
    ]
  },
];

const NavItem = ({ item, isOpen, onClose, expanded, onToggle }) => {
  const hasChildren = item.children && item.children.length > 0;
  const location = useLocation();
  const isSelfActive = location.pathname === item.path;
  const isChildActive = hasChildren && item.children.some(child => location.pathname === child.path);
  const isActive = isSelfActive || isChildActive;

  const headerContent = (
    <div className="flex items-center gap-4 w-full">
      <item.icon size={20} className={`transition-transform duration-300 drop-shadow-md ${isActive ? 'scale-110 text-white' : 'text-white/90 group-hover:scale-110 group-hover:text-white'}`} />
      <span className={`font-medium drop-shadow-md ${isActive ? 'text-white' : 'text-white/95'}`}>{item.label}</span>
    </div>
  );

  return (
    <div className="mb-2">
      <div 
        className={`
          flex items-center justify-between p-3 rounded-xl transition-all duration-300 group cursor-pointer border border-white/5
          ${isActive 
            ? 'bg-dusty-cocoa text-white shadow-xl shadow-dusty-cocoa/20 border-white/20 backdrop-blur-lg scale-[1.02]' 
            : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/10'}
        `}
        onClick={() => {
          if (hasChildren) {
            onToggle(item.label);
          } else {
            if (window.innerWidth < 1024) onClose();
          }
        }}
      >
        {item.path && !hasChildren ? (
          <NavLink to={item.path} end={item.path === '/admin'} className="w-full">
            {headerContent}
          </NavLink>
        ) : (
          headerContent
        )}
        
        {hasChildren && (
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              // Prevent navigation if only clicking the chevron
              if (item.path) {
                e.stopPropagation();
                onToggle(item.label);
              }
            }}
          >
            <LuChevronRight size={16} className={`drop-shadow-md transition-colors ${isActive ? 'text-white' : 'text-white/60'}`} />
          </motion.div>
        )}
        {!hasChildren && <LuChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-white/60" />}
      </div>

      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-6 mt-1 space-y-1 py-1">
              {item.children.map((child) => (
                <NavLink
                  key={child.path + child.label}
                  to={child.path}
                  onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                  className={({ isActive: childActive }) => `
                    flex items-center gap-4 p-2.5 rounded-xl transition-all duration-300 group border border-transparent
                    ${childActive 
                      ? 'text-white font-bold bg-white/20 border-white/10 shadow-sm' 
                      : 'text-white/90 bg-white/5 hover:text-white hover:bg-white/15 hover:border-white/5'}
                  `}
                >
                  {({ isActive: isCurrentChildActive }) => (
                    <>
                      <child.icon size={16} className={`transition-transform duration-300 group-hover:scale-110 ${isCurrentChildActive ? 'text-white' : 'text-white/70'}`} />
                      <span className="text-sm tracking-wide drop-shadow-sm">{child.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(() => {
    // Initial state: expand sections if a child is active
    const initial = {};
    [...menuItems, ...homepageItems].forEach(item => {
      if (item.children?.some(child => location.pathname === child.path)) {
        initial[item.label] = true;
      }
    });
    return initial;
  });

  const toggleExpand = (label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
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
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-espresso/90 via-deep-espresso/60 to-deep-espresso/95"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warm-sand/90 backdrop-blur-md rounded-lg flex items-center justify-center text-deep-espresso font-bold text-xl drop-shadow-md">
              R
            </div>
            <span className="font-display font-bold text-xl tracking-wide uppercase drop-shadow-md">
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
              isOpen={isOpen} 
              onClose={onClose} 
              expanded={expandedItems[item.label]}
              onToggle={toggleExpand}
            />
          ))}

          {/* Homepage Section */}
          <div className="pt-4 mt-6 border-t border-white/10">
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 drop-shadow-md">Homepage</p>
            {homepageItems.map((item) => (
              <NavItem 
                key={item.label} 
                item={item} 
                isOpen={isOpen} 
                onClose={onClose} 
                expanded={expandedItems[item.label]}
                onToggle={toggleExpand}
              />
            ))}
          </div>
        </nav>

        {/* Footer info */}
        <div className="relative z-10 p-6 border-t border-white/10 text-white/50 text-xs mt-auto backdrop-blur-sm bg-deep-espresso/20">
          <p className="font-medium text-white/80 drop-shadow-md">© 2026 Riddha Interio Mart</p>
          <p className="mt-1 text-[10px] tracking-wide uppercase drop-shadow-md">Admin Workspace v1.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
