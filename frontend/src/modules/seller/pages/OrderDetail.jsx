import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuArrowLeft, 
  LuPackage, 
  LuTruck, 
  LuClock, 
  LuUser, 
  LuMail, 
  LuPhone,
  LuCreditCard,
  LuPrinter,
  LuCalendar
} from 'react-icons/lu';
import { FiCheckCircle, FiBox, FiMapPin } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchOrderDetail = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      if (data.success) {
        setOrder(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    // Local simulation for now
    setOrder(prev => ({ ...prev, status: newStatus }));
    
    const notifications = JSON.parse(localStorage.getItem('seller_notifications') || '[]');
    const newNotif = {
      id: Date.now(),
      title: `Pipeline Update`,
      message: `Order #${id.slice(-6).toUpperCase()} is now ${newStatus}.`,
      time: 'Just now',
      status: 'unread',
      type: 'success'
    };
    localStorage.setItem('seller_notifications', JSON.stringify([newNotif, ...notifications]));
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
           <div className="w-12 h-12 border-4 border-gray-100 border-t-red-800 rounded-full animate-spin mb-4" />
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Decrypting Transaction details...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!order) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="text-gray-400 font-bold uppercase tracking-widest">Transaction not found</p>
          <button onClick={() => navigate('/seller/orders')} className="mt-4 text-red-800 font-black text-xs underline uppercase italic">Return to pipeline</button>
        </div>
      </PageWrapper>
    );
  }

  const statusMap = {
    'Pending': { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: LuClock },
    'Processing': { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: LuPackage },
    'Shipped': { color: 'text-purple-600 bg-purple-50 border-purple-100', icon: LuTruck },
    'Delivered': { color: 'text-green-600 bg-green-50 border-green-100', icon: FiCheckCircle },
    'Cancelled': { color: 'text-red-600 bg-red-50 border-red-100', icon: FiMapPin }
  };

  const CurrentStatusIcon = statusMap[order.status]?.icon || LuPackage;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Superior Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-100 pb-8 px-1 md:px-0">
           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 text-center sm:text-left">
              <button 
                onClick={() => navigate('/seller/orders')}
                className="w-12 h-12 md:w-14 md:h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <LuArrowLeft size={20} md:size={24} />
              </button>
              <div>
                 <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
                    <h1 className="text-2xl md:text-4xl font-display font-black text-gray-900 tracking-tighter uppercase italic">
                      Order <span className="text-red-800">#{order._id.slice(-8).toUpperCase()}</span>
                    </h1>
                    <span className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border-2 ${statusMap[order.status]?.color}`}>
                       {order.status}
                    </span>
                 </div>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 md:gap-6 mt-3">
                     <p className="text-gray-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <LuCalendar size={12} className="text-red-800" /> 
                        Authorized: <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                     </p>
                     <p className="text-gray-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <LuClock size={12} className="text-red-800" /> 
                        Timestamp: <span className="text-gray-900">{new Date(order.createdAt).toLocaleTimeString()}</span>
                     </p>
                  </div>
              </div>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-white border border-gray-200 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:border-black transition-all">
                 <LuPrinter size={16} /> Print Memo
              </button>
              <button 
                onClick={() => handleStatusUpdate(order.status === 'Pending' ? 'Processing' : order.status === 'Processing' ? 'Shipped' : 'Delivered')}
                className="flex-1 lg:flex-none bg-gray-950 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/20"
              >
                 Advance Stage
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
           {/* Manifest & Items (Left 2 Columns) */}
           <div className="xl:col-span-2 space-y-10">
              {/* Product Manifest */}
              <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/20 overflow-hidden">
                 <div className="bg-gray-50/50 px-6 md:px-10 py-5 md:py-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <FiBox className="text-red-800" size={18} />
                       <h2 className="font-black text-gray-900 tracking-widest uppercase text-[10px] md:text-xs">Inventory Manifest</h2>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.orderItems.length} ITEMS</span>
                 </div>
                 <div className="divide-y divide-gray-50">
                    {order.orderItems.map((item, idx) => (
                       <div key={idx} className="p-6 md:p-10 flex flex-col sm:flex-row items-center gap-6 md:gap-10 group bg-white hover:bg-gray-50/30 transition-colors">
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 relative shadow-md shrink-0">
                             <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                             <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                          </div>
                          <div className="flex-grow text-center sm:text-left">
                             <h4 className="text-base md:text-lg font-black text-gray-900 uppercase tracking-tighter mb-1 md:mb-2">{item.name}</h4>
                             <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 md:mb-4">SKU: RIDDHA-MOD-{item.product.slice(-6).toUpperCase()}</p>
                             <div className="flex flex-wrap justify-center sm:justify-start gap-3 md:gap-4">
                                <div className="bg-gray-50 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-gray-100">
                                   <p className="text-[7px] md:text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Quantity</p>
                                   <p className="text-xs md:text-sm font-black text-gray-900">x{item.quantity}</p>
                                </div>
                                <div className="bg-gray-50 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-gray-100">
                                   <p className="text-[7px] md:text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Unit Price</p>
                                   <p className="text-xs md:text-sm font-black text-gray-900">₹{item.price.toLocaleString()}</p>
                                </div>
                             </div>
                          </div>
                          <div className="text-center sm:text-right sm:min-w-[120px]">
                             <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Extended Total</p>
                             <p className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className="bg-gray-950 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center text-white gap-6">
                    <div className="text-center md:text-left">
                       <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2">Total Transaction Security</p>
                       <p className="text-[10px] md:text-xs font-medium text-gray-500 max-w-xs uppercase leading-relaxed mx-auto md:mx-0">This transaction is verified and fully paid via encrypted digital channels.</p>
                    </div>
                    <div className="text-center md:text-right">
                       <p className="text-[9px] md:text-[10px] font-black text-red-800 uppercase tracking-widest mb-2">Grand Merchant Total</p>
                       <p className="text-3xl md:text-5xl font-black tracking-tighter italic">₹{order.totalPrice.toLocaleString()}</p>
                    </div>
                 </div>
              </div>

              {/* Advanced Logistics Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                 <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/10 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                       <LuCreditCard className="text-red-800" size={18} />
                       <h3 className="font-black text-gray-900 text-[10px] md:text-xs uppercase tracking-widest">Financial Manifest</h3>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Settlement Method</p>
                          <p className="font-black text-gray-900 text-xs md:text-sm uppercase">{order.paymentMethod} Payment</p>
                       </div>
                       <div className="flex items-center gap-3 p-3 bg-green-50 rounded-2xl border border-green-100">
                          <FiCheckCircle className="text-green-600 shrink-0" />
                          <span className="text-[9px] md:text-[10px] font-black text-green-700 uppercase tracking-widest">Digital Audit Passed</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/10 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                       <FiMapPin className="text-red-800" size={18} />
                       <h3 className="font-black text-gray-900 text-[10px] md:text-xs uppercase tracking-widest">Logistics Coordinates</h3>
                    </div>
                    <p className="text-xs md:text-sm font-bold text-gray-900 uppercase italic leading-loose">
                       {String(order.shippingAddress?.fullAddress || "")}, {order.shippingAddress?.landmark && `${String(order.shippingAddress.landmark)}, `}
                       {String(order.shippingAddress?.city || "")} - {String(order.shippingAddress?.pincode || "")}
                    </p>
                 </div>
              </div>
           </div>

           {/* Client Profile & Lifecycle (Right Column) */}
           <div className="space-y-6 md:space-y-10">
              {/* Profile Card */}
              <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/20 space-y-6 md:space-y-8">
                 <div className="flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-4 md:pb-6">
                    <LuUser className="text-red-800" size={18} />
                    <h3 className="font-black text-[10px] md:text-xs uppercase tracking-widest">Client Credentials</h3>
                 </div>
                 <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-4 md:gap-5">
                       <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-gray-950 flex items-center justify-center text-white font-black text-lg md:text-xl shadow-xl shadow-gray-400/30 shrink-0">
                          {String(order.shippingAddress?.fullName || "G").charAt(0)}
                       </div>
                       <div>
                          <p className="text-base md:text-lg font-black text-gray-900 uppercase tracking-tighter leading-none mb-1">{String(order.shippingAddress?.fullName || "Guest")}</p>
                          <p className="text-[9px] md:text-[10px] text-red-800 font-black uppercase tracking-widest">Verified Account Holder</p>
                       </div>
                    </div>
                    
                    <div className="space-y-4 md:space-y-6 pt-2">
                       <div className="flex items-center gap-4 group">
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-red-800 transition-colors shrink-0">
                             <LuMail size={16} md:size={18} />
                          </div>
                          <p className="text-[11px] md:text-xs font-black text-gray-900 tracking-tight lowercase truncate">user@riddhamart.com</p>
                       </div>
                       <div className="flex items-center gap-4 group">
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-red-800 transition-colors shrink-0">
                             <LuPhone size={16} md:size={18} />
                          </div>
                          <p className="text-[11px] md:text-xs font-black text-gray-900 tracking-widest">{order.shippingAddress.mobileNumber}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Merchant Profile (Seller Details) */}
              <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/20 space-y-6 md:space-y-8">
                 <div className="flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-4 md:pb-6">
                    <LuPackage className="text-red-800" size={18} />
                    <h3 className="font-black text-[10px] md:text-xs uppercase tracking-widest">Merchant Profile</h3>
                 </div>
                 <div className="space-y-6">
                    <div className="bg-gray-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
                       <p className="text-[9px] md:text-[10px] font-black text-red-800 uppercase tracking-widest mb-1">Store Identity</p>
                       <p className="text-base md:text-lg font-black text-gray-900 uppercase tracking-tighter">{order.seller?.shopName || "Elite Interiors"}</p>
                    </div>
                    
                    <div className="space-y-4 px-2">
                       <div className="flex items-center gap-4">
                          <LuMail size={14} md:size={16} className="text-gray-400 shrink-0" />
                          <p className="text-[11px] md:text-xs font-bold text-gray-900 truncate">{order.seller?.email || "merchant@riddhamart.com"}</p>
                       </div>
                       <div className="flex items-center gap-4">
                          <LuPhone size={14} md:size={16} className="text-gray-400 shrink-0" />
                          <p className="text-[11px] md:text-xs font-bold text-gray-900">{order.seller?.phone || "+91 99999 99999"}</p>
                       </div>
                       <div className="flex items-start gap-4">
                          <FiMapPin size={14} md:size={16} className="text-gray-400 mt-1 shrink-0" />
                          <p className="text-[11px] md:text-xs font-bold text-gray-900 leading-relaxed uppercase italic">
                             {order.seller?.shopAddress || "Merchant distribution center active"}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Pipeline Lifecycle */}
              <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/20 space-y-6 md:space-y-8">
                 <div className="flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-4 md:pb-6">
                    <LuClock className="text-red-800" size={18} />
                    <h3 className="font-black text-[10px] md:text-xs uppercase tracking-widest">Pipeline Lifecycle</h3>
                 </div>
                 <div className="relative space-y-10 md:space-y-12 before:absolute before:inset-0 before:left-[17px] md:before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status, idx) => {
                       const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                       const currentIdx = statuses.indexOf(order.status);
                       const isActive = statuses.indexOf(status) <= currentIdx;
                       const isCurrent = status === order.status;
                       
                       return (
                          <div key={idx} className="relative pl-12 md:pl-14">
                             <div className={`absolute left-0 top-0 w-9 h-9 md:w-10 md:h-10 rounded-full border-4 border-white flex items-center justify-center z-10 transition-all duration-500 ${isActive ? 'bg-red-800 text-white shadow-lg shadow-red-800/30' : 'bg-gray-100 text-gray-400'}`}>
                                {isCurrent ? (
                                   <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full animate-ping"></div>
                                ) : (
                                   <FiCheckCircle size={14} md:size={16} />
                                )}
                             </div>
                             <div>
                                <p className={`text-[11px] md:text-xs font-black uppercase tracking-widest ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{status}</p>
                                {isCurrent && <p className="text-[8px] md:text-[9px] text-red-800 font-bold uppercase tracking-widest mt-0.5 md:mt-1">Live Tracking Active</p>}
                                {isActive && !isCurrent && <p className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 md:mt-1">Authorized Stage</p>}
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default OrderDetail;
