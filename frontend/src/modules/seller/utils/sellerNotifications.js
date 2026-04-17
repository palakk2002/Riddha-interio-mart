const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Product Approved',
    message: 'Your Classic Marble Tile has been approved and is now live in the catalog.',
    time: '2 hours ago',
    status: 'unread',
    type: 'success'
  },
  {
    id: 2,
    title: 'New Catalog Item',
    message: 'Admin has added 5 new items to the Paints category. Check them out!',
    time: '5 hours ago',
    status: 'read',
    type: 'info'
  },
  {
    id: 3,
    title: 'Welcome',
    message: 'Welcome to the Riddha Seller Panel! Start by adding your first product.',
    time: '1 day ago',
    status: 'read',
    type: 'info'
  },
  {
    id: 4,
    title: 'Low Stock Alert',
    message: 'Your "Modern Fabric Sofa" is running low on stock (2 units left).',
    time: '2 days ago',
    status: 'unread',
    type: 'warning'
  }
];

export function getSellerNotifications() {
  const saved = localStorage.getItem('seller_notifications');
  if (!saved) return DEFAULT_NOTIFICATIONS;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
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

