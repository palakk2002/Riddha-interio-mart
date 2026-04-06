import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import OrderCard from '../components/OrderCard';
import { initialAvailableOrders, initialMyOrders } from '../data/deliveryData';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [availableOrders, setAvailableOrders] = useState(initialAvailableOrders);
  const [myOrders, setMyOrders] = useState(initialMyOrders);

  const handleAcceptOrder = (orderId) => {
    const orderToAccept = availableOrders.find(o => o.id === orderId);
    if (orderToAccept) {
      setAvailableOrders(availableOrders.filter(o => o.id !== orderId));
      setMyOrders([...myOrders, { ...orderToAccept, status: 'Accepted' }]);
    }
  };

  const handleRejectOrder = (orderId) => {
    setAvailableOrders(availableOrders.filter(o => o.id !== orderId));
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setMyOrders(myOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">Orders</h1>
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

export default Orders;
