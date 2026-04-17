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
      className="min-h-screen bg-[#FDFCFB] py-12 md:py-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-4"
        >
          <div className="flex items-center gap-3 text-[#8B2323] mb-2">
            <FiPackage className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.2em] font-black">History & Tracking</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-gray-900 italic">
            YOUR <span className="text-[#8B2323]">ORDERS</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-lg font-medium max-w-2xl uppercase tracking-widest opacity-60">
            Monitor the journey of your premium interiors.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-[#8B2323] rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Transactions...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/20"
          >
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-8">
              <FiShoppingBag className="h-10 w-10 text-[#8B2323]" />
            </div>
            <h3 className="text-2xl font-display font-black text-gray-900 uppercase italic mb-3">No orders found</h3>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-10 text-center max-w-sm px-6">
              Your premium collection is waiting. Start your first interior journey today.
            </p>
            <Link
              to="/products"
              className="bg-black text-white rounded-xl px-12 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-[#8B2323] transition-all shadow-lg active:scale-95"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          /* Order List */
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, idx) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-gray-200/30 transition-all group"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                          <FiClock size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Transaction ID</p>
                          <p className="text-sm font-black text-gray-900 uppercase">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                          <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-8">
                       {order.orderItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-3 pr-6 border border-gray-100 hover:border-gray-200 transition-colors">
                             <img 
                               src={item.image} 
                               alt={item.name} 
                               className="w-12 h-12 object-cover rounded-xl shadow-sm"
                             />
                             <div>
                                <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight truncate max-w-[120px]">{item.name}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                             </div>
                          </div>
                       ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                       <button 
                        onClick={() => navigate(`/track-order/${order._id}`)}
                        className="flex items-center gap-2 group/btn"
                       >
                          <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest group-hover/btn:text-[#8B2323] transition-colors">Track Shipment</span>
                          <FiChevronRight className="text-gray-400 group-hover/btn:translate-x-1 transition-transform group-hover/btn:text-[#8B2323]" />
                       </button>
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
