import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import OrderCard from '../components/OrderCard';
import { initialAvailableOrders, initialMyOrders } from '../data/deliveryData';
import { motion, AnimatePresence } from 'framer-motion';

const DeliveryHistory = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('available');

  const [allOrders, setAllOrders] = useState(() => {
    const saved = localStorage.getItem('riddha_full_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const availableOrders = allOrders.filter(o => o.status === 'Ready for Pickup');
  const myOrders = allOrders.filter(o => o.status === 'Out For Delivery' || o.status === 'Delivered');

  useEffect(() => {
    if (location.pathname.includes('/catalog')) setActiveTab('available');
    else if (location.pathname.includes('/orders')) setActiveTab('my');
  }, [location.pathname]);

  const handleAcceptOrder = (orderId) => {
    const updated = allOrders.map(order => {
      if (order.id === orderId) {
        const updatedTimeline = order.timeline.map(t => {
          if (t.status === "Out for Delivery") return { ...t, date: new Date().toLocaleString(), active: true };
          if (t.status === "Ready for Pickup") return { ...t, active: false };
          return t;
        });
        return { ...order, status: 'Out For Delivery', timeline: updatedTimeline };
      }
      return order;
    });
    setAllOrders(updated);
    localStorage.setItem('riddha_full_orders', JSON.stringify(updated));
    alert('Order accepted! You can now view it in My Orders.');
  };

  const handleRejectOrder = (orderId) => {
    // For now, just a placeholder as requested
    console.log('Order rejected:', orderId);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = allOrders.map(order => {
      if (order.id === orderId) {
        const updatedTimeline = order.timeline.map(t => {
          if (t.status === newStatus) return { ...t, date: new Date().toLocaleString(), active: true };
          return t;
        });
        return { ...order, status: newStatus, timeline: updatedTimeline };
      }
      return order;
    });
    setAllOrders(updated);
    localStorage.setItem('riddha_full_orders', JSON.stringify(updated));
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">Delivery History</h1>
            <p className="text-warm-sand mt-2">Manage your current and available deliveries.</p>
          </div>
          
          <div className="flex p-1 bg-soft-oatmeal/30 rounded-2xl border border-soft-oatmeal w-fit">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                activeTab === 'available' 
                  ? 'bg-deep-espresso text-white shadow-lg shadow-deep-espresso/10' 
                  : 'text-dusty-cocoa hover:text-deep-espresso'
              }`}
            >
              Available ({availableOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                activeTab === 'my' 
                  ? 'bg-deep-espresso text-white shadow-lg shadow-deep-espresso/10' 
                  : 'text-dusty-cocoa hover:text-deep-espresso'
              }`}
            >
              My Orders ({myOrders.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {activeTab === 'available' ? (
              availableOrders.length > 0 ? (
                availableOrders.map(order => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <OrderCard 
                      order={order} 
                      onAccept={handleAcceptOrder} 
                      onReject={handleRejectOrder} 
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-soft-oatmeal/30 rounded-full flex items-center justify-center mx-auto text-warm-sand">
                    <LuPackage size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-deep-espresso">No available orders</h3>
                    <p className="text-sm text-dusty-cocoa">Keep checking back for new delivery requests!</p>
                  </div>
                </motion.div>
              )
            ) : (
              myOrders.length > 0 ? (
                myOrders.map(order => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <OrderCard 
                      order={order} 
                      onUpdateStatus={handleUpdateStatus} 
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-soft-oatmeal/30 rounded-full flex items-center justify-center mx-auto text-warm-sand">
                    <LuPackage size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-deep-espresso">No active orders</h3>
                    <p className="text-sm text-dusty-cocoa">Accept an order from the "Available" tab to get started.</p>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

// Import LuPackage for the empty state
import { LuPackage as LuPackageIcon } from 'react-icons/lu';
const LuPackage = LuPackageIcon;

export default DeliveryHistory;
