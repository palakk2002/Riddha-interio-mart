export function getDeliveryNotifications() {
  const saved = localStorage.getItem('delivery_notifications');
  const defaults = [
    { id: 1, title: 'New Order Available', message: 'Pick up from Raja Park, Jaipur.', time: 'Just now', status: 'unread', link: '/delivery/orders' },
    { id: 2, title: 'Payment Received', message: 'Earnings for ORD-5541 credited.', time: '2h ago', status: 'read', link: '/delivery/earnings' },
    { id: 3, title: 'Profile Updated', message: 'Your vehicle details have been verified.', time: '1d ago', status: 'read', link: '/delivery/profile' },
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

export function setDeliveryNotifications(notifications) {
  localStorage.setItem('delivery_notifications', JSON.stringify(notifications));
  window.dispatchEvent(new Event('delivery_notifications_updated'));
}

export function prependDeliveryNotification(notification) {
  const current = getDeliveryNotifications();
  const next = [{ ...notification, id: Date.now() + Math.random() }, ...current];
  setDeliveryNotifications(next);
  return next;
}
