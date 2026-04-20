import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import { LuSearch, LuFilter, LuEye, LuClock, LuPackage } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiTruck, FiBox, FiMapPin, FiMoreHorizontal } from "react-icons/fi";
import api from "../../../shared/utils/api";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.14, audioCtx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.18);
      oscillator.onended = () => audioCtx.close();
    } catch (err) {
      console.warn('Audio notifications are unavailable:', err);
    }
  };

  const addSellerNotification = (notification) => {
    const existing = JSON.parse(localStorage.getItem('seller_notifications') || '[]');
    localStorage.setItem('seller_notifications', JSON.stringify([notification, ...existing]));
    window.dispatchEvent(new Event('seller_notifications_updated'));
  };

  const showNewOrderPopup = (order) => {
    const message = `New order ${order._id.slice(-8).toUpperCase()} for ₹${Number(order.totalPrice || 0).toLocaleString()} from ${order.shippingAddress?.fullName || 'a customer'}.`;
    playNotificationSound();

    addSellerNotification({
      id: Date.now() + Math.random(),
      title: 'New Order Received',
      message,
      time: 'Just now',
      status: 'unread',
      type: 'warning'
    });

  };

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      if (data.success) {
        const fetched = data.data || [];
        setOrders(fetched);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const onNewOrder = () => fetchOrders();
    window.addEventListener('seller:new-order', onNewOrder);
    return () => window.removeEventListener('seller:new-order', onNewOrder);
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // In a real app, we'd have a PUT /api/orders/:id/status
      // For now, let's just update local state and simulate backend
      setOrders(prev => prev.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));

      // Create a notification for the seller
      const notifications = JSON.parse(localStorage.getItem('seller_notifications') || '[]');
      const targetOrder = orders.find(o => o._id === orderId);
      const newNotif = {
        id: Date.now(),
        title: `Order Updated`,
        message: `Order #${orderId.slice(-6)} state changed to ${newStatus}.`,
        time: 'Just now',
        status: 'unread',
        type: 'info'
      };
      localStorage.setItem('seller_notifications', JSON.stringify([newNotif, ...notifications]));
      window.dispatchEvent(new Event('seller_notifications_updated'));
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <h1 className="text-4xl font-display font-black text-gray-900 tracking-tight uppercase italic">
              Order <span className="text-red-800">Pipeline</span>
            </h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">
              Real-time merchant transaction tracking system
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Active</p>
              <p className="text-xl font-black text-gray-900">{orders.filter(o => o.status !== 'Delivered').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-800 rounded-2xl shadow-lg shadow-red-900/20 flex items-center justify-center text-white">
              <LuPackage size={24} />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <LuSearch
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ID, Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-13 pr-6 py-4 focus:outline-none focus:ring-4 focus:ring-red-800/5 transition-all text-sm font-bold"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-gray-900 transition-all">
              <LuFilter size={16} />
              Filter
            </button>
            <button className="flex-1 md:flex-none bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
              Export
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction ID</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer / Location</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Revenue</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stage</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                        <div className="w-10 h-10 border-4 border-gray-100 border-t-red-800 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronizing Encrypted Data...</p>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                        <LuPackage size={48} className="text-gray-100 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching transactions found</p>
                      </td>
                    </tr>
                  ) : filteredOrders.map((order) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={order._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white transition-colors">
                            <LuClock size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 tracking-tighter uppercase">#{order._id.slice(-8).toUpperCase()}</p>
                            <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-800 font-black text-[10px]">
                            {String(order.shippingAddress?.fullName || "G").charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">{String(order.shippingAddress?.fullName || "Guest")}</p>
                            <p className="text-[9px] text-gray-400 font-bold flex items-center gap-1 uppercase tracking-widest">
                              <FiMapPin size={8} /> {String(order.shippingAddress?.city || "Unknown")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-gray-900 tracking-tighter">₹{Number(order.totalPrice || 0).toLocaleString()}</p>
                        <p className="text-[9px] text-green-600 font-black uppercase tracking-widest mt-1">Paid via {order.paymentMethod}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`text-[9px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-xl border-2 inline-flex items-center gap-2 ${order.status === "Pending"
                              ? "text-amber-600 bg-amber-50 border-amber-100"
                              : order.status === "Processing"
                                ? "text-blue-600 bg-blue-50 border-blue-100"
                                : order.status === "Shipped"
                                  ? "text-purple-600 bg-purple-50 border-purple-100"
                                  : order.status === "Delivered"
                                    ? "text-green-600 bg-green-50 border-green-100"
                                    : "text-red-600 bg-red-50 border-red-100"
                            }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${order.status === "Pending" ? "bg-amber-600" :
                              order.status === "Processing" ? "bg-blue-600" :
                                order.status === "Shipped" ? "bg-purple-600" : "bg-green-600"
                            }`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/seller/order/${order._id}`)}
                            className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all shadow-sm"
                          >
                            <LuEye size={18} />
                          </button>

                          {order.status === 'Processing' && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                              className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all shadow-lg shadow-black/10"
                            >
                              <FiTruck size={18} />
                            </button>
                          )}
                          <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
                            <FiMoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Orders;
