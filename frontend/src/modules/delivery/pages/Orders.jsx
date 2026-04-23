import React from 'react';
import PageWrapper from '../components/PageWrapper';
import OrderCard from '../components/OrderCard';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPackage, LuRefreshCw } from 'react-icons/lu';
import { useUser } from '../../user/data/UserContext';
import api from '../../../shared/utils/api';

const Orders = () => {
  const [activeTab, setActiveTab] = React.useState('my'); // Default to my accepted orders
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { user } = useUser();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
    
    // Refresh on new assignment
    const handleNewAssignment = () => fetchOrders();
    window.addEventListener('delivery:assigned', handleNewAssignment);
    return () => window.removeEventListener('delivery:assigned', handleNewAssignment);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeliveryResponse = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/delivery-response`, { status });
      if (data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to respond to assignment:', err);
    }
  };

  // Filter orders for the delivery boy
  // 1. Pool: Orders with deliveryStatus 'None' or 'Rejected' (Available to anyone)
  const availableOrders = orders.filter(o => 
    (o.deliveryStatus === 'None' || o.deliveryStatus === 'Rejected') && 
    o.status === 'Processing'
  );

  // 2. Assigned: Orders where deliveryBoy is current user
  const myOrders = orders.filter(o => o.deliveryBoy?._id === user?._id || o.deliveryBoy === user?._id);

  const displayedOrders = activeTab === 'available' ? availableOrders : myOrders;

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-deep-espresso">My Shipments</h1>
            <p className="text-warm-sand mt-2">Track and manage your assigned deliveries.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchOrders}
              className="p-3 bg-white border border-soft-oatmeal rounded-xl text-warm-sand hover:text-deep-espresso transition-all"
            >
              <LuRefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="flex p-1 bg-soft-oatmeal/30 rounded-2xl border border-soft-oatmeal w-fit">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                  activeTab === 'available' 
                    ? 'bg-deep-espresso text-white shadow-lg shadow-deep-espresso/10' 
                    : 'text-dusty-cocoa hover:text-deep-espresso'
                }`}
              >
                Pool ({availableOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                  activeTab === 'my' 
                    ? 'bg-deep-espresso text-white shadow-lg shadow-deep-espresso/10' 
                    : 'text-dusty-cocoa hover:text-deep-espresso'
                }`}
              >
                Assigned ({myOrders.length})
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                <div className="w-10 h-10 border-4 border-soft-oatmeal border-t-deep-espresso rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs font-bold text-warm-sand uppercase tracking-widest">Synchronizing cargo data...</p>
              </div>
            ) : displayedOrders.length > 0 ? (
              displayedOrders.map(order => (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <OrderCard 
                    order={{
                      id: order._id,
                      customerName: order.shippingAddress.fullName,
                      status: order.deliveryStatus || 'None',
                      dateTime: new Date(order.createdAt).toLocaleString(),
                      address: `${order.shippingAddress.fullAddress}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode}${order.shippingAddress.landmark ? ` (Landmark: ${order.shippingAddress.landmark})` : ''}`,
                      phone: order.shippingAddress.mobileNumber,
                      sellerLocation: "Main Warehouse",
                      items: order.orderItems.map(item => ({
                         name: item.name,
                         quantity: item.quantity,
                         price: item.price
                      })),
                      totalBill: order.totalPrice,
                      paymentMode: order.paymentMethod
                    }} 
                    onAccept={(id) => handleDeliveryResponse(id, 'Accepted')}
                    onReject={(id) => handleDeliveryResponse(id, 'Rejected')}
                    onUpdateStatus={(id, status) => handleUpdateStatus(id, status)} 
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center bg-soft-oatmeal/10 rounded-[3rem] border border-dashed border-soft-oatmeal"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-soft-oatmeal">
                  <LuPackage size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-deep-espresso">No orders found</h3>
                  <p className="text-sm text-dusty-cocoa">Your shipment list is currently empty.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Orders;
