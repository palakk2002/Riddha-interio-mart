import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { LuBell, LuCheckCheck, LuTrash2, LuClock, LuCircleAlert, LuInfo, LuCircleCheck } from 'react-icons/lu';

const initialNotifications = [
  { id: 1, title: 'Product Approved', message: 'Your Classic Marble Tile has been approved and is now live in the catalog.', time: '2 hours ago', status: 'unread', type: 'success' },
  { id: 2, title: 'New Catalog Item', message: 'Admin has added 5 new items to the Paints category. Check them out!', time: '5 hours ago', status: 'read', type: 'info' },
  { id: 3, title: 'Welcome', message: 'Welcome to the Riddha Seller Panel! Start by adding your first product.', time: '1 day ago', status: 'read', type: 'info' },
  { id: 4, title: 'Low Stock Alert', message: 'Your "Modern Fabric Sofa" is running low on stock (2 units left).', time: '2 days ago', status: 'unread', type: 'warning' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('seller_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('seller_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handle new order notifications for the frontend simulation
  useEffect(() => {
    const checkNewOrders = () => {
      const orders = JSON.parse(localStorage.getItem('riddha_full_orders') || '[]');
      const pendingOrders = orders.filter(o => o.status === 'Pending Seller');
      
      const newNotifs = [];
      pendingOrders.forEach(order => {
        // Check if we already notified about this order ID
        const alreadyNotified = notifications.some(n => n.message.includes(order.orderId));
        if (!alreadyNotified) {
          newNotifs.push({
            id: Date.now() + Math.random(),
            title: 'New Order Received',
            message: `You have received a new order ${order.orderId} for ₹${order.total.toLocaleString()}.`,
            time: 'Just now',
            status: 'unread',
            type: 'warning'
          });
        }
      });

      if (newNotifs.length > 0) {
        setNotifications(prev => [...newNotifs, ...prev]);
      }
    };

    const interval = setInterval(checkNewOrders, 5000); // Poll every 5 seconds
    checkNewOrders(); // Initial check
    return () => clearInterval(interval);
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, status: 'read' } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return n.status === 'unread';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <LuCircleCheck className="text-green-500" size={20} />;
      case 'warning': return <LuCircleAlert className="text-amber-500" size={20} />;
      default: return <LuInfo className="text-blue-500" size={20} />;
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-deep-espresso">Notifications</h1>
            <p className="text-warm-sand text-sm">Stay updated with your shop's latest activity.</p>
          </div>
          <button 
            onClick={markAllAsRead}
            className="flex items-center justify-center gap-2 bg-white border border-soft-oatmeal text-deep-espresso px-6 py-3 rounded-2xl font-bold hover:bg-soft-oatmeal/20 transition-all text-sm shadow-sm"
          >
            <LuCheckCheck size={18} />
            Mark all as read
          </button>
        </div>

        <div className="flex gap-2 p-1 bg-soft-oatmeal/20 rounded-xl w-fit">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-white text-deep-espresso shadow-sm' : 'text-warm-sand hover:text-deep-espresso'}`}
          >
            All Notifications
          </button>
          <button 
            onClick={() => setActiveFilter('unread')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === 'unread' ? 'bg-white text-deep-espresso shadow-sm' : 'text-warm-sand hover:text-deep-espresso'}`}
          >
            Unread
          </button>
        </div>

        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`group bg-white p-6 rounded-3xl border transition-all cursor-pointer ${notification.status === 'unread' ? 'border-warm-sand/30 shadow-md ring-1 ring-warm-sand/5' : 'border-soft-oatmeal hover:border-warm-sand/20 shadow-sm'}`}
              >
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold transition-colors ${notification.status === 'unread' ? 'text-deep-espresso' : 'text-dusty-cocoa'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-warm-sand uppercase tracking-wider flex items-center gap-1">
                          <LuClock size={12} />
                          {notification.time}
                        </span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                          className="opacity-0 group-hover:opacity-100 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <LuTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm leading-relaxed ${notification.status === 'unread' ? 'text-deep-espresso/80' : 'text-warm-sand'}`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[40px] border border-soft-oatmeal border-dashed">
              <div className="w-16 h-16 bg-soft-oatmeal/20 rounded-full flex items-center justify-center mx-auto mb-4 text-warm-sand">
                <LuBell size={32} />
              </div>
              <h3 className="text-lg font-bold text-deep-espresso">Clear Skies!</h3>
              <p className="text-warm-sand text-sm mt-1">No new notifications at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Notifications;
