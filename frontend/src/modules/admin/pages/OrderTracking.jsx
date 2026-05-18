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
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <LuNavigation className="text-[var(--color-primary)]" size={20} /> Live Order Tracking
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active shipment telemetry ledger</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input 
              type="text" 
              placeholder="Search Order ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 focus:bg-white focus:outline-none focus:border-[var(--color-primary)] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-slate-100 border-t-[var(--color-primary)] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 animate-pulse">Syncing logistics coordinates...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/60 p-12 text-center shadow-sm">
             <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-slate-400">
                <LuNavigation size={22} />
             </div>
             <h3 className="text-sm font-bold text-slate-800 mb-1">No active shipments in transit</h3>
             <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">All active order cycles are currently settled.</p>
          </div>
        ) : (
          /* Sleek Compact Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-teal-50 text-[var(--color-primary)] rounded-lg flex items-center justify-center">
                        <LuTruck size={16} />
                      </div>
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400 leading-none">Order ID</p>
                        <h3 className="text-xs font-bold text-slate-800 mt-1">#{order.orderId || order._id.slice(-8).toUpperCase()}</h3>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      order.status === 'Shipped' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-amber-50 text-amber-600 border-amber-100/50'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Compact Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-[11px] leading-tight">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Receiver</p>
                      <p className="font-semibold text-slate-700 truncate">{order.user?.fullName || 'Guest User'}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Dispatcher Partner</p>
                      <p className="font-semibold text-slate-700 truncate">{order.deliveryBoy?.fullName || 'Awaiting Partner'}</p>
                    </div>
                  </div>

                  {/* Destination Details */}
                  <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 mb-4 flex items-start gap-2">
                    <LuMapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Delivery Address</p>
                      <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                        {order.shippingAddress?.fullAddress}, {order.shippingAddress?.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compact Action Trigger */}
                <button 
                  onClick={() => handleOpenMap(order)}
                  className="w-full py-2 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
                >
                  <LuMapPin size={13} />
                  GPS Live Location
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Map Modal */}
      <AnimatePresence>
        {showMap && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMap(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[75vh] border border-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[var(--color-primary)] text-white rounded-lg flex items-center justify-center shadow-sm shadow-[var(--color-primary)]/10">
                    <LuNavigation size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-none">
                      Tracking Shipment <span className="text-[var(--color-primary)]">#{selectedOrder.orderId || selectedOrder._id.slice(-8).toUpperCase()}</span>
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMap(false)}
                  className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <LuX size={18} />
                </button>
              </div>

              {/* Map View Frame */}
              <div className="flex-1 bg-slate-50 relative">
                <iframe
                  title="Live Tracking Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={getMapUrl(selectedOrder)}
                  className="filter grayscale-[0.05]"
                />
                
                {/* Floating Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row gap-3">
                  <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-200/60 flex-1 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-teal-50 text-[var(--color-primary)] rounded-lg flex items-center justify-center shrink-0">
                      <LuMapPin size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Destination Address</p>
                      <p className="text-[11px] font-bold text-slate-700 truncate">{selectedOrder.shippingAddress?.fullAddress}, {selectedOrder.shippingAddress?.city}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 p-3 rounded-lg shadow-lg flex items-center gap-3 text-white sm:min-w-[240px] shrink-0">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                      <LuTruck size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-300">Carrier Partner</p>
                      <p className="text-[11px] font-bold truncate">{selectedOrder.deliveryBoy?.fullName || 'Express Dispatch'}</p>
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
