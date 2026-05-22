import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiInbox, FiClock, FiPhone, FiUser } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetail = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      if (data.success) {
        setOrder(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tracking details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
      // Poll for updates every 30 seconds
      const interval = setInterval(fetchOrderDetail, 30000);
      return () => clearInterval(interval);
    }
  }, [id]);

  const steps = [
    { 
       id: 1, 
       title: 'Order Placed', 
       status: 'Pending', 
       icon: <FiInbox />,
       description: 'We have received your premium interior request.'
    },
    { 
       id: 2, 
       title: 'Processing', 
       status: 'Processing', 
       icon: <FiPackage />,
       description: 'Our merchant is preparing your order for fulfillment.'
    },
    { 
       id: 3, 
       title: 'Shipped', 
       status: 'Shipped', 
       icon: <FiTruck />,
       description: order?.deliveryStatus === 'Out for Delivery' 
         ? 'Your parcel is in the final stretch, out for delivery!'
         : order?.deliveryStatus === 'Picked'
         ? 'Our partner has picked up your order and is en route.'
         : 'Your order is in transit to your location.'
    },
    { 
       id: 4, 
       title: 'Delivered', 
       status: 'Delivered', 
       icon: <FiCheckCircle />,
       description: 'Items have been successfully delivered to your space.'
    }
  ];

  const getCurrentStep = () => {
    if (!order) return 0;
    const statusIndex = steps.findIndex(s => s.status === order.status);
    return statusIndex === -1 ? 0 : statusIndex;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-[#189D91] rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synchronizing Logistics...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6 text-center">
        <FiPackage className="text-gray-100 w-20 h-20 mb-6" />
        <h2 className="text-2xl font-display font-black text-gray-900 uppercase italic mb-2">Tracking Data Offline</h2>
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-10">We couldn't retrieve the logs for this transaction.</p>
        <button onClick={() => navigate('/orders')} className="bg-black text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Back to History</button>
      </div>
    );
  }

  const currentStepIndex = getCurrentStep();
  const isOutForDelivery = order.deliveryStatus === 'Out for Delivery';
  const showDeliveryPartner = (order.deliveryStatus === 'Picked' || order.deliveryStatus === 'Out for Delivery' || order.deliveryStatus === 'Delivered') && order.deliveryBoy;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header */}
      <div className="bg-white px-4 py-6 md:px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <FiArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Live Tracking</h1>
        </div>
        <div className={`px-4 py-1.5 rounded-full border ${isOutForDelivery ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-teal-50 border-teal-100 text-teal-700'}`}>
           <span className="text-[10px] font-bold uppercase tracking-wider">
             {isOutForDelivery ? 'Out for Delivery' : order.status}
           </span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-8 md:pt-12 space-y-6">
        {/* Delivery Partner Card */}
        <AnimatePresence>
          {showDeliveryPartner && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-teal-600">Delivery Partner</h3>
                  {isOutForDelivery && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 rounded-full">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse" />
                      <span className="text-[8px] font-bold text-amber-700 uppercase">Live Now</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                    {order.deliveryBoy.avatar ? (
                      <img src={order.deliveryBoy.avatar} alt={order.deliveryBoy.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <FiUser size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900">{order.deliveryBoy.fullName}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <FiTruck size={14} className="text-teal-600" />
                       <span className="text-xs font-medium text-gray-500">
                         {order.deliveryBoy.vehicleType || 'Bike'} • {order.deliveryBoy.vehicleNumber || 'Tracking Active'}
                       </span>
                    </div>
                  </div>
                  <a 
                    href={`tel:${order.deliveryBoy.phone}`}
                    className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-md hover:bg-teal-600 transition-all active:scale-95"
                  >
                    <FiPhone size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OTP Notification / Display */}
        <AnimatePresence>
          {isOutForDelivery && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 rounded-full blur-2xl opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <FiCheckCircle size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-amber-900">Secure Delivery PIN</h3>
                </div>
                <p className="text-xs text-amber-700 font-medium leading-relaxed mb-4">
                  Please provide the 4-digit PIN to the delivery partner to receive your order. The PIN has been sent to your registered email address.
                </p>
                {order.deliveryOtp && (
                   <div className="bg-white px-4 py-3 rounded-xl border border-amber-100 inline-block">
                     <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Your PIN</p>
                     <p className="text-2xl font-black text-amber-900 tracking-[0.2em]">{order.deliveryOtp}</p>
                   </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Details Header */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
           <div className="flex items-start justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
             <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                <p className="text-xl font-bold text-gray-900 tracking-tight">#{order._id.slice(-8).toUpperCase()}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-bold text-gray-900">
                  {order.status === 'Delivered' ? 'Delivered' : isOutForDelivery ? 'Arriving Now' : 'Processing'}
                </p>
             </div>
           </div>

           <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Summary</p>
              <div className="space-y-4">
                 {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 p-1">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Tracking Journey */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm relative">
           <h3 className="text-xs font-bold text-gray-900 mb-10 flex items-center gap-2">
              <div className="w-1 h-4 bg-teal-600 rounded-full" />
              Delivery Progress
           </h3>

           <div className="space-y-10 relative">
              {/* Stepper Line */}
              <div className="absolute left-[1.12rem] top-2 bottom-2 w-0.5 bg-gray-100" />
              
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex || order.status === 'Delivered';
                const isActive = idx === currentStepIndex && order.status !== 'Delivered';
                
                return (
                  <div key={step.id} className="relative flex gap-6">
                    <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-300 ${
                      isCompleted ? 'bg-gray-900 text-white' : 
                      isActive ? 'bg-teal-600 text-white shadow-lg shadow-teal-100 scale-105' : 'bg-gray-100 text-gray-400'
                    }`}>
                        {React.cloneElement(step.icon, { size: 16 })}
                    </div>

                    <div className="flex-1 pt-1">
                       <div className="flex items-center justify-between mb-1">
                          <p className={`text-xs font-bold transition-colors ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.title}
                          </p>
                          {(isCompleted || order.status === 'Delivered') && (
                             <FiCheckCircle className="text-teal-600" size={14} />
                          )}
                       </div>
                       <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                         {isCompleted || isActive ? step.description : 'Awaiting this step...'}
                       </p>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
