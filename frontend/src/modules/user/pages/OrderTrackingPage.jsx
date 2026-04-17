import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiInbox, FiClock } from 'react-icons/fi';
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
       description: 'Your order is in transit to your location.'
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
        <div className="w-10 h-10 border-4 border-gray-100 border-t-[#8B2323] rounded-full animate-spin mb-4" />
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

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32">
      {/* Header */}
      <div className="bg-white px-6 py-8 flex items-center justify-between border-b border-gray-50 sticky top-0 z-10 shadow-sm shadow-gray-100/10">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors">
            <FiArrowLeft className="h-6 w-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Live <span className="text-[#8B2323]">Tracking</span></h1>
        </div>
        <div className="bg-red-50 px-4 py-2 rounded-xl">
           <span className="text-[9px] font-black text-[#8B2323] uppercase tracking-widest">{order.status}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-12">
        {/* Order Header */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/20 mb-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Transaction Identity</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">#{order._id.slice(-8).toUpperCase()}</p>
             </div>
             <div className="text-left md:text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Estimated Arrival</p>
                <p className="text-xl font-black text-gray-900 tracking-tighter">{order.status === 'Delivered' ? 'Fully Received' : '48 Hours'}</p>
             </div>
           </div>

           <div className="space-y-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4">Consignment Manifest</p>
              <div className="space-y-4">
                 {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">{item.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Tracking Stepper */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/20 relative">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B2323] mb-12 flex items-center gap-3">
              <span className="w-6 h-1 bg-[#8B2323] rounded-full" /> 
              Journey Status
           </h3>

           <div className="space-y-12 relative">
              {/* Progress Line */}
              <div className="absolute left-[1.12rem] top-2 bottom-2 w-0.5 bg-gray-100" />
              
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex || order.status === 'Delivered';
                const isActive = idx === currentStepIndex && order.status !== 'Delivered';
                
                return (
                  <div key={step.id} className="relative flex gap-8 group">
                    <div className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition-all duration-500 ${
                      isCompleted ? 'bg-black text-white' : 
                      isActive ? 'bg-[#8B2323] text-white shadow-xl shadow-red-900/20 scale-110' : 'bg-gray-100 text-gray-400'
                    }`}>
                        {step.icon}
                    </div>

                    <div className="flex-1 pt-1">
                       <div className="flex items-center justify-between gap-4 mb-2">
                          <p className={`text-xs font-black uppercase tracking-widest transition-colors ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.title}
                          </p>
                          {(isCompleted || order.status === 'Delivered') && (
                             <FiCheckCircle className="text-green-500" />
                          )}
                       </div>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                         {isCompleted || isActive ? step.description : 'Awaiting completion of previous stage.'}
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
