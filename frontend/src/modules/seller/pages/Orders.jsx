import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  Package, 
  Truck, 
  User, 
  X, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  Calendar,
  Download,
  MoreVertical,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../shared/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import OrderCard from "../components/OrderCard";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
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

  const fetchAvailableDeliveryBoys = async () => {
    try {
      const { data } = await api.get('/delivery/available');
      if (data.success) {
        setDeliveryBoys(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAvailableDeliveryBoys();
    
    const onNewOrder = () => fetchOrders();
    window.addEventListener('seller:new-order', onNewOrder);
    return () => window.removeEventListener('seller:new-order', onNewOrder);
  }, []);

  const handleAssignInit = (order) => {
    setSelectedOrderForAssign(order);
    setShowAssignModal(true);
  };

  const handleAssignProcess = async (dbId) => {
    setAssigning(true);
    try {
      const { data } = await api.put(`/orders/${selectedOrderForAssign._id}/assign-delivery`, {
        deliveryBoyId: dbId
      });
      if (data.success) {
        setShowAssignModal(false);
        fetchOrders();
      }
    } catch (err) {
      console.error('Assignment failed:', err);
    } finally {
      setAssigning(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section - Compact */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orders</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage partner transactions</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="text-right">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active</p>
                   <p className="text-lg font-black text-slate-900 leading-none">{orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}</p>
                </div>
                <div className="w-8 h-8 bg-seller-primary/10 rounded-lg flex items-center justify-center text-seller-primary">
                   <Activity size={16} />
                </div>
             </div>
          </div>
        </div>

        {/* Status Tabs - Compact */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab ? 'bg-seller-primary text-white shadow-md shadow-seller-primary/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Actions Toolbar - Ultra Compact */}
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <div className="relative flex-grow w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-seller-primary transition-colors" size={14} />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-seller-primary/30 focus:ring-4 focus:ring-seller-primary/5 transition-all text-[11px] font-bold"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto shrink-0">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Calendar size={12} />
              Range
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-seller-primary text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-seller-dark transition-all shadow-lg shadow-seller-primary/20">
              <Download size={12} />
              Export
            </button>
          </div>
        </div>

        {/* Orders Content */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center space-y-3">
               <div className="w-8 h-8 border-4 border-slate-100 border-t-seller-primary rounded-full animate-spin mx-auto"></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Package size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">No orders found</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Try another filter</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden p-3 space-y-3">
                {filteredOrders.map((order) => (
                  <OrderCard 
                    key={order._id} 
                    order={order} 
                    onClick={() => navigate(`/seller/orders/${order._id}`)}
                  />
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-seller-primary/10 group-hover:text-seller-primary transition-all">
                              <Clock size={14} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900 leading-none">#{order._id.slice(-8).toUpperCase()}</p>
                              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-seller-light flex items-center justify-center text-seller-primary font-black text-[10px] border border-seller-primary/10">
                              {String(order.shippingAddress?.fullName || "G").charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-900 truncate">{order.shippingAddress?.fullName}</p>
                              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{order.shippingAddress?.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <p className="text-xs font-black text-slate-900">₹{order.totalPrice.toLocaleString()}</p>
                          <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-0.5">{order.paymentMethod}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${getStatusStyles(order.status)}`}>
                            <div className="w-1 h-1 rounded-full bg-current" />
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/seller/orders/${order._id}`)}
                              className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-seller-primary hover:border-seller-primary rounded-lg transition-all shadow-sm"
                            >
                              <Eye size={14} />
                            </button>
                            {order.status === 'Processing' && (
                              <button
                                onClick={() => handleAssignInit(order)}
                                className="p-2 bg-seller-primary text-white rounded-lg hover:bg-seller-dark transition-all shadow-lg shadow-seller-primary/20"
                              >
                                <Truck size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Assignment Modal Overlay */}
        <AnimatePresence>
          {showAssignModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAssignModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-slate-100"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Assign Partner</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">Order #{selectedOrderForAssign?._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>

                <div className="p-8 max-h-[50vh] overflow-y-auto custom-scrollbar space-y-4">
                  {deliveryBoys.length === 0 ? (
                    <div className="text-center py-10 space-y-4">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                          <User size={32} />
                       </div>
                       <p className="text-sm font-bold text-slate-400">No active delivery partners online.</p>
                    </div>
                  ) : deliveryBoys.map((boy) => (
                    <div 
                      key={boy._id}
                      className="p-5 rounded-3xl border border-slate-100 hover:border-seller-primary/30 hover:bg-seller-light/10 transition-all flex items-center justify-between group cursor-pointer"
                      onClick={() => handleAssignProcess(boy._id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-seller-primary flex items-center justify-center text-white relative border-2 border-white shadow-sm">
                          <User size={20} />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{boy.fullName}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{boy.vehicleType}</span>
                             <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{boy.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-seller-primary group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-slate-100 text-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Partner selection is prioritized by real-time distance and capacity.</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default Orders;
