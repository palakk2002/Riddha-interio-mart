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
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order Management</h1>
            <p className="text-sm font-medium text-slate-500">Track and fulfill your merchant transactions</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Active Pipeline</p>
                   <p className="text-xl font-bold text-slate-900">{orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}</p>
                </div>
                <div className="w-10 h-10 bg-seller-primary/10 rounded-xl flex items-center justify-center text-seller-primary">
                   <Activity size={20} />
                </div>
             </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-seller-primary text-white shadow-md shadow-seller-primary/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Actions Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID or Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-5 py-3 focus:outline-none focus:ring-4 focus:ring-seller-primary/5 transition-all text-sm font-semibold"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto shrink-0">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Calendar size={14} />
              Date Range
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Orders Content */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-24 text-center space-y-4">
               <div className="w-12 h-12 border-4 border-seller-light border-t-seller-primary rounded-full animate-spin mx-auto"></div>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fetching Orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Package size={40} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No orders found</h3>
                <p className="text-sm text-slate-500 mt-1">Try switching tabs or searching for something else.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedOrderId === order._id;
                    const steps = [
                      { label: 'Order', status: 'Pending', icon: Package, date: new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) },
                      { label: 'Processing', status: 'Processing', icon: Clock, date: order.processingAt ? new Date(order.processingAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Pending' },
                      { label: 'Packed', status: 'Packed', icon: Package, date: order.packedAt ? new Date(order.packedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Pending' },
                      { label: 'Shipped', status: 'Shipped', icon: Truck, date: order.shippedAt ? new Date(order.shippedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Pending' },
                      { label: 'Delivered', status: 'Delivered', icon: CheckCircle2, date: order.deliveredAt ? `Updated ${new Date(order.deliveredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}` : 'Pending' },
                    ];
                    const currentStepIdx = steps.findIndex(s => s.status === order.status);

                    return (
                      <React.Fragment key={order._id}>
                        <tr className={`hover:bg-slate-50/50 transition-colors group ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isExpanded ? 'bg-seller-primary text-white shadow-lg shadow-seller-primary/20' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-seller-primary'}`}>
                                <Clock size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-seller-light flex items-center justify-center text-seller-primary font-bold text-xs border border-seller-primary/10">
                                {String(order.shippingAddress?.fullName || "G").charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{String(order.shippingAddress?.fullName || "Guest")}</p>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                  <MapPin size={10} /> {String(order.shippingAddress?.city || "Unknown")}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-sm font-bold text-slate-900">₹{Number(order.totalPrice || 0).toLocaleString()}</p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">{order.paymentMethod}</p>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold inline-flex items-center gap-2 ${getStatusStyles(order.status)}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Pending' ? 'animate-pulse' : ''} bg-current`} />
                              {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                                className={`p-2.5 rounded-xl transition-all border ${isExpanded ? 'bg-seller-primary border-seller-primary text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:text-seller-primary hover:border-seller-primary shadow-sm'}`}
                                title="View Details"
                              >
                                {isExpanded ? <X size={18} /> : <Eye size={18} />}
                              </button>
                              {order.status === 'Processing' && (
                                <button
                                  onClick={() => handleAssignInit(order)}
                                  className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all shadow-lg"
                                  title="Assign Delivery Partner"
                                >
                                  <Truck size={18} />
                                </button>
                              )}
                              <button className="p-2.5 text-slate-300 hover:text-slate-600 transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Detail View */}
                        <AnimatePresence>
                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className="px-8 py-0 border-none">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 my-4 p-8 md:p-10 space-y-10">
                                    <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-slate-200/60">
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-grow">
                                        <div>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Order Date</p>
                                          <p className="text-sm font-bold text-slate-800">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Customer</p>
                                          <p className="text-sm font-bold text-slate-800">{order.shippingAddress?.fullName}</p>
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Payment Method</p>
                                          <p className="text-sm font-bold text-slate-800 capitalize">{order.paymentMethod} Payment</p>
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Total Amount</p>
                                          <p className="text-lg font-black text-slate-900">₹{order.totalPrice.toLocaleString()}</p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <button className="h-11 px-6 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2">
                                          <Download size={14} /> Print Invoice
                                        </button>
                                        <button className="h-11 px-6 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2">
                                          <Activity size={14} /> Tracking Label
                                        </button>
                                      </div>
                                    </div>

                                    {/* Product List */}
                                    <div className="space-y-4">
                                      {order.orderItems.map((item, i) => (
                                        <div key={i} className="flex items-center gap-5 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-50 shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                          </div>
                                          <div className="flex-grow">
                                            <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Qty: {item.quantity} units</p>
                                          </div>
                                          <p className="text-base font-black text-slate-900">₹{item.price.toLocaleString()}</p>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Timeline Stepper */}
                                    <div className="relative py-4">
                                      <div className="absolute top-8 left-0 w-full h-1 bg-slate-200 rounded-full" />
                                      <div 
                                        className="absolute top-8 left-0 h-1 bg-seller-primary rounded-full transition-all duration-1000" 
                                        style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                                      />
                                      <div className="flex justify-between relative z-10">
                                        {steps.map((step, idx) => {
                                          const isActive = idx <= currentStepIdx;
                                          const StepIcon = step.icon;
                                          return (
                                            <div key={idx} className="flex flex-col items-center gap-4">
                                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-4 border-white shadow-md ${isActive ? 'bg-seller-primary text-white scale-110' : 'bg-slate-100 text-slate-300'}`}>
                                                <StepIcon size={14} />
                                              </div>
                                              <div className="text-center">
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                                                <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase">{step.date}</p>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white relative border-2 border-white shadow-sm">
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
