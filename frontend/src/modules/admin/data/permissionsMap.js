/**
 * Maps sidebar items and routes to permission keys.
 */
export const permissionsMap = {
  // Permission Keys
  DASHBOARD: 'dashboard',
  ANALYTICS: 'analytics',
  PROFIT: 'profit',
  ORDERS: 'orders',
  PRODUCTS: 'products',
  CATALOG: 'catalog',
  CATEGORIES: 'categories',
  SELLERS: 'sellers',
  DELIVERY: 'delivery',
  CONTENT: 'content',
  SETTINGS: 'settings',
  REFERRALS: 'referrals',
  TEAM: 'team',

  // Label to Permission Key mapping (for Sidebar)
  menuMapping: {
    'Dashboard': 'dashboard',
    'Analytics': 'analytics',
    'Order Tracking': 'orders',
    'Assign Delivery': 'delivery',
    'Create Listing': 'products',
    'Product Management': 'products',
    'Stock Management': 'products',
    'Order Management': 'orders',
    'Product Catalog': 'catalog',
    'Manage Categories': 'categories',
    'Seller Management': 'sellers',
    'Home Banner': 'content',
    'Promo Banner': 'content',
    'Section': 'content',
    'Favourite Section': 'content',
    'Top Brands': 'content',
    'Featured Highlights': 'content',
    'Bulk Orders': 'orders',
    'Settings': 'settings',
    'Referral System': 'referrals',
    'Team Management': 'team'
  }
};

export const DEFAULT_ASSISTANT_PERMISSIONS = {
  dashboard: true,
  analytics: false,
  profit: false,
  orders: true,
  products: true,
  catalog: true,
  categories: true,
  sellers: false,
  delivery: false,
  content: false,
  settings: false,
  referrals: false,
  team: false,
};
