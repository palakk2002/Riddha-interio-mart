export function getAdminNotifications() {
  const saved = localStorage.getItem('admin_notifications');
  const defaults = [
    { id: 1, title: 'New Seller Request', message: 'Elite Interiors requested store approval.', time: '1h ago', status: 'unread', link: '/admin/sellers/requests' },
    { id: 2, title: 'Catalog Updated', message: 'Admin added 5 items to "Living Room".', time: '3h ago', status: 'read', link: '/admin/products' },
    { id: 3, title: 'Security Alert', message: 'Login attempt from unknown IP address.', time: '1d ago', status: 'read', link: '/admin/settings' },
  ];
  
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : defaults;
    } catch {
      return defaults;
    }
  }
  return defaults;
}

export function setAdminNotifications(notifications) {
  localStorage.setItem('admin_notifications', JSON.stringify(notifications));
  window.dispatchEvent(new Event('admin_notifications_updated'));
}

export function prependAdminNotification(notification) {
  const current = getAdminNotifications();
  const next = [{ ...notification, id: Date.now() + Math.random() }, ...current];
  setAdminNotifications(next);
  return next;
}
