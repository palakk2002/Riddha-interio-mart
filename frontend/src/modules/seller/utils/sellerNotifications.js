const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Product Approved',
    message: 'Your Classic Marble Tile has been approved and is now live in the catalog.',
    time: '2 hours ago',
    status: 'unread',
    type: 'success',
    link: '/seller/my-products'
  },
  {
    id: 2,
    title: 'New Catalog Item',
    message: 'Admin has added 5 new items to the Paints category. Check them out!',
    time: '5 hours ago',
    status: 'read',
    type: 'info',
    link: '/seller/catalog'
  },
  {
    id: 3,
    title: 'Welcome',
    message: 'Welcome to the Riddha Seller Panel! Start by adding your first product.',
    time: '1 day ago',
    status: 'read',
    type: 'info',
    link: '/seller/product/add'
  },
  {
    id: 4,
    title: 'Low Stock Alert',
    message: 'Your "Modern Fabric Sofa" is running low on stock (2 units left).',
    time: '2 days ago',
    status: 'unread',
    type: 'warning',
    link: '/seller/product/stock'
  }
];

export function getSellerNotifications() {
  const saved = localStorage.getItem('seller_notifications');
  let notifications = DEFAULT_NOTIFICATIONS;
  
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      notifications = Array.isArray(parsed) ? parsed : DEFAULT_NOTIFICATIONS;
    } catch {
      notifications = DEFAULT_NOTIFICATIONS;
    }
  }

  // Migration: Ensure all notifications have links based on their type/title
  return notifications.map(n => {
    if (n.link) return n;
    
    let link = '/seller/dashboard';
    const title = n.title?.toLowerCase() || '';
    const msg = n.message?.toLowerCase() || '';

    if (title.includes('order') || msg.includes('order')) {
      // Try to extract order ID if present in message (e.g., #12E676B5)
      const orderMatch = msg.match(/#([A-Z0-9]{8})/i);
      if (orderMatch) {
        // We can't know the MongoDB ID here easily, so we go to the orders list
        // Or if the message was generated recently, it might have it.
        // For now, go to orders list as a safe fallback
        link = '/seller/orders';
      } else {
        link = '/seller/orders';
      }
    } else if (title.includes('product') || title.includes('catalog') || msg.includes('product')) {
      link = '/seller/my-products';
    } else if (title.includes('stock')) {
      link = '/seller/product/stock';
    } else if (title.includes('welcome')) {
      link = '/seller/product/add';
    }
    
    return { ...n, link };
  });
}

export function setSellerNotifications(notifications) {
  localStorage.setItem('seller_notifications', JSON.stringify(notifications));
  window.dispatchEvent(new Event('seller_notifications_updated'));
}

export function prependSellerNotification(notification) {
  const current = getSellerNotifications();
  const next = [notification, ...current];
  setSellerNotifications(next);
  return next;
}

