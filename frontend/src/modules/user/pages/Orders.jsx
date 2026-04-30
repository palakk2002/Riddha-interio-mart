import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiChevronRight, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../shared/utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyOrders = async () => {
    try {
      const { data } = await api.get('/orders/my-orders');
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Shipped': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#FDFCFB] py-6 md:py-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12 space-y-2 md:space-y-4"
        >
          <div className="flex items-center gap-2 text-[#189D91] mb-1">
            <FiPackage className="h-4 w-4" />
            <span className="text-[9px] md:text-xs uppercase tracking-[0.2em] font-black">History & Tracking</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-display font-black tracking-tight text-gray-900 italic">
            YOUR <span className="text-[#189D91]">ORDERS</span>
          </h1>
          <p className="text-gray-500 text-[10px] md:text-lg font-medium max-w-2xl uppercase tracking-widest opacity-60">
            Monitor the journey of your interiors.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-gray-100 border-t-[#189D91] rounded-full animate-spin mb-4" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Retrieving Transactions...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 md:py-24 bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-gray-200/20"
          >
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#F0F9F8] flex items-center justify-center mb-6 md:mb-8">
              <FiShoppingBag className="h-8 w-8 md:h-10 md:w-10 text-[#189D91]" />
            </div>
            <h3 className="text-xl md:text-2xl font-display font-black text-gray-900 uppercase italic mb-2 md:mb-3">No orders found</h3>
            <p className="text-gray-400 text-[9px] md:text-xs font-black uppercase tracking-widest mb-8 md:mb-10 text-center max-w-xs px-6">
              Your premium collection is waiting. Start your journey today.
            </p>
            <Link
              to="/products"
              className="bg-black text-white rounded-xl px-10 py-3.5 md:px-12 md:py-4 font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-[#189D91] transition-all shadow-lg active:scale-95"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          /* Order List */
          <div className="space-y-3 md:space-y-6">
            <AnimatePresence>
              {orders.map((order, idx) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[1.2rem] md:rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-gray-200/30 transition-all group"
                >
                  <div className="p-3.5 md:p-8">
                    {/* Header: ID, Status & Price */}
                    <div className="flex items-start justify-between gap-2 mb-4 md:mb-8">
                      <div className="flex items-center gap-2.5">
                        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center text-gray-400">
                          <FiClock size={20} />
                        </div>
                        <div>
                          <p className="text-[7px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5 md:mb-1">Transaction ID</p>
                          <p className="text-[11px] md:text-sm font-black text-gray-900 uppercase">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 md:gap-2">
                        <span className={`inline-block px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest border md:border-2 ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-sm md:text-2xl font-black text-gray-900 tracking-tighter">₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="flex flex-wrap gap-2 mb-4 md:mb-8">
                       {order.orderItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 bg-gray-50/50 md:bg-gray-50 rounded-lg md:rounded-2xl p-1.5 md:p-3 md:pr-6 border border-gray-100">
                             <img 
                               src={item.image} 
                               alt={item.name} 
                               className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-md md:rounded-xl shadow-sm"
                             />
                             <div className="hidden sm:block">
                                <p className="text-[10px] md:text-[11px] font-black text-gray-900 uppercase tracking-tight truncate max-w-[120px]">{item.name}</p>
                                <p className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                             </div>
                             <div className="sm:hidden">
                                <p className="text-[9px] font-black text-gray-900 uppercase tracking-tight">x{item.quantity}</p>
                             </div>
                          </div>
                       ))}
                    </div>

                    {/* Footer: Date & Actions */}
                    <div className="flex items-center justify-between pt-3 md:pt-6 border-t border-gray-50">
                       <div className="flex flex-col gap-0.5">
                          <p className="text-[7px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          {order.businessDetails?.gstNumber && (
                             <button
                               onClick={() => navigate(`/order/invoice/${order._id}`)}
                               className="text-[8px] md:text-[10px] font-black text-warm-sand uppercase tracking-widest flex items-center gap-1 mt-1"
                             >
                               <div className="w-1 h-1 rounded-full bg-warm-sand"></div>
                               GST Invoice
                             </button>
                          )}
                       </div>
                       
                       <div className="flex items-center gap-3 md:gap-6">
                          {!order.businessDetails?.gstNumber && (
                             <button
                               onClick={() => navigate(`/order/invoice/${order._id}`)}
                               className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900"
                             >
                               Invoice
                             </button>
                          )}
                          <button
                           onClick={() => navigate(`/track-order/${order._id}`)}
                           className="flex items-center gap-1.5 bg-black text-white px-4 py-2 md:p-0 md:bg-transparent md:text-gray-900 rounded-full md:rounded-none group/btn transition-all active:scale-95 shadow-lg shadow-black/5 md:shadow-none"
                          >
                             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest md:group-hover/btn:text-[#189D91]">Track</span>
                             <FiChevronRight className="w-3 h-3 md:w-4 md:h-4 text-white/50 md:text-gray-400 md:group-hover/btn:translate-x-1 md:group-hover/btn:text-[#189D91]" />
                          </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Orders;
