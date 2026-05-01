import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuMapPin, LuSearch, LuTruck, LuPackage, LuCircleCheck, LuNavigation, LuX, LuExternalLink 
} from 'react-icons/lu';
import api from '../../../shared/utils/api';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        // Filter active orders or orders with an assigned delivery boy
        setOrders(res.data.data.filter(o => 
          ['Shipped', 'Out for Delivery', 'Processing'].includes(o.status) || 
          (o.deliveryBoy && o.deliveryStatus !== 'None' && o.status !== 'Delivered')
        ));
      } catch (err) {
        console.error('Failed to fetch orders for tracking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenMap = (order) => {
    setSelectedOrder(order);
    setShowMap(true);
  };

  const getMapUrl = (order) => {
    if (!order) return '';
    const address = `${order.shippingAddress?.fullAddress || ''} ${order.shippingAddress?.city || ''} ${order.shippingAddress?.pincode || ''}`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-deep-espresso">Order <span className="text-warm-sand">Tracking</span></h1>
            <p className="text-warm-sand/60 text-sm font-medium uppercase tracking-[0.2em]">Live network monitor for active shipments</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <LuSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-warm-sand" size={20} />
            <input 
              type="text" 
              placeholder="Search Order ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-soft-oatmeal rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-4 focus:ring-warm-sand/10 transition-all font-medium text-deep-espresso shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-40 text-center">
            <div className="w-16 h-16 border-4 border-soft-oatmeal border-t-red-800 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-warm-sand animate-pulse">Establishing Satellite Link...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-dashed border-soft-oatmeal p-20 text-center shadow-sm">
             <div className="w-20 h-20 bg-soft-oatmeal/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-warm-sand opacity-30">
                <LuNavigation size={40} />
             </div>
             <h3 className="text-2xl font-bold text-deep-espresso mb-3">No active shipments</h3>
             <p className="text-warm-sand font-medium max-w-sm mx-auto">Either all orders are delivered or no orders match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2.5rem] p-8 border border-soft-oatmeal shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden relative">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-red-800/10 rounded-2xl flex items-center justify-center text-red-800 group-hover:scale-110 transition-transform duration-500">
                      <LuTruck size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand mb-1">Order Identifier</p>
                      <h3 className="text-xl font-black text-deep-espresso">#{order.orderId || order._id.slice(-8).toUpperCase()}</h3>
                    </div>
                  </div>
                  <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    order.status === 'Shipped' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8 border-y border-soft-oatmeal/10 py-8 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand/60">Receiver</p>
                    <p className="font-bold text-deep-espresso">{order.user?.fullName || 'Guest User'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand/60">Dispatcher</p>
                    <p className="font-bold text-deep-espresso">{order.deliveryBoy?.fullName || 'Awaiting Assignment'}</p>
                  </div>
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-5 relative">
                    <div className="w-1 h-16 bg-red-800/10 absolute left-[11px] top-6 rounded-full" />
                    <div className="w-6 h-6 rounded-full bg-red-800 flex items-center justify-center z-10 shadow-lg shadow-red-800/20">
                      <LuNavigation size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand/80 mb-1">Delivery Destination</p>
                      <p className="text-sm font-medium text-deep-espresso/70 leading-relaxed line-clamp-2">
                        {order.shippingAddress?.fullAddress}, {order.shippingAddress?.city}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenMap(order)}
                    className="w-full py-5 bg-deep-espresso text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-deep-espresso/20 group/btn active:scale-95"
                  >
                    <LuMapPin size={18} className="group-hover/btn:animate-bounce" />
                    View Live GPS Location
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Map Modal */}
      <AnimatePresence>
        {showMap && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMap(false)}
              className="absolute inset-0 bg-deep-espresso/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[85vh] border border-white/20"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-soft-oatmeal shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-800 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-800/20">
                    <LuNavigation size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-deep-espresso leading-none">Tracking Shipment <span className="text-red-800">#{selectedOrder.orderId || selectedOrder._id.slice(-8).toUpperCase()}</span></h3>
                    <p className="text-[10px] font-bold text-warm-sand uppercase tracking-widest mt-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Positioning Active
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMap(false)}
                  className="w-12 h-12 rounded-full bg-soft-oatmeal/30 flex items-center justify-center text-deep-espresso hover:bg-red-800 hover:text-white transition-all duration-500 active:scale-90"
                >
                  <LuX size={24} />
                </button>
              </div>

              {/* Map View */}
              <div className="flex-1 bg-soft-oatmeal/20 relative">
                <iframe
                  title="Live Tracking Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={getMapUrl(selectedOrder)}
                  className="filter grayscale-[0.2] contrast-[1.1]"
                />
                
                {/* Floating Info Overlay */}
                <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row gap-6">
                  <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-soft-oatmeal flex-1 flex items-center gap-6">
                    <div className="w-14 h-14 bg-red-800/10 rounded-2xl flex items-center justify-center text-red-800">
                      <LuMapPin size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand mb-1">Destination Address</p>
                      <p className="text-sm font-bold text-deep-espresso">{selectedOrder.shippingAddress?.fullAddress}, {selectedOrder.shippingAddress?.city}</p>
                    </div>
                  </div>
                  
                  <div className="bg-deep-espresso p-6 rounded-[2rem] shadow-2xl flex items-center gap-6 text-white min-w-[300px]">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                      <LuTruck size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-warm-sand mb-1">Assigned Partner</p>
                      <p className="text-sm font-bold">{selectedOrder.deliveryBoy?.fullName || 'Express Courier'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default OrderTracking;
