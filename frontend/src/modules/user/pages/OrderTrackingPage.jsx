import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiInbox } from 'react-icons/fi';

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const orderId = localStorage.getItem('last_order_id') || 'RD-77291AB';

  const steps = [
    { id: 1, title: 'Order Placed', time: 'Today, 2:30 PM', completed: true, active: false, icon: <FiInbox /> },
    { id: 2, title: 'Processing', time: 'In Progress', completed: false, active: true, icon: <FiPackage /> },
    { id: 3, title: 'Shipped', time: 'Expected by tomorrow', completed: false, active: false, icon: <FiTruck /> },
    { id: 4, title: 'Delivered', time: 'Expected by 25th March', completed: false, active: false, icon: <FiCheckCircle /> }
  ];

  return (
    <div className="min-h-screen bg-soft-oatmeal/10">
      {/* Header */}
      <div className="bg-white px-6 py-6 flex items-center gap-6 border-b border-soft-oatmeal/10 sticky top-0 z-10">
        <button onClick={() => navigate(-1)}>
          <FiArrowLeft className="h-6 w-6 text-deep-espresso" />
        </button>
        <h1 className="text-xl font-bold text-deep-espresso">Track Order</h1>
      </div>

      <div className="max-w-2xl mx-auto p-0 space-y-0">
        {/* Order ID Section */}
        <div className="bg-white px-6 py-8 border-b border-soft-oatmeal/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] font-black text-warm-sand uppercase tracking-[0.2em] leading-none mb-1">Order Details</p>
              <p className="text-xl font-black text-deep-espresso font-montserrat tracking-tight">#{orderId}</p>
            </div>
            <div className="px-4 py-1.5 bg-warm-sand rounded-lg shadow-lg shadow-warm-sand/10">
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Confirmed</span>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
             <div className="w-16 h-16 bg-soft-oatmeal/10 rounded-2xl overflow-hidden border border-soft-oatmeal/20">
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60" alt="Product" className="w-full h-full object-cover grayscale" />
             </div>
             <div>
                <p className="text-sm font-black text-deep-espresso uppercase tracking-tight">Premium Leather Sofa</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Brown / Italian Leather</p>
             </div>
          </div>
        </div>

        {/* Tracking Stepper Section */}
        <div className="bg-white px-6 py-10 relative overflow-hidden">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-warm-sand mb-10 flex items-center gap-2">
            <span className="w-6 h-px bg-warm-sand/30" /> Real-time Tracking
          </h3>

          <div className="space-y-12 relative">
             {/* Progress Line */}
             <div className="absolute left-[1.15rem] top-2 bottom-2 w-0.5 bg-soft-oatmeal/20" />
             
             {steps.map((step) => (
               <div key={step.id} className="relative flex gap-6">
                  <div className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white transition-all duration-500 ${
                    step.completed ? 'bg-deep-espresso shadow-xl shadow-deep-espresso/10' : 
                    step.active ? 'bg-warm-sand shadow-xl shadow-warm-sand/20' : 'bg-soft-oatmeal/20'
                  }`}>
                    <span className={`text-lg transition-colors ${step.completed || step.active ? 'text-white' : 'text-gray-400'}`}>
                      {step.icon}
                    </span>
                  </div>

                  <div className="flex-1">
                     <p className={`text-sm font-black uppercase tracking-tight transition-colors ${step.active ? 'text-deep-espresso' : 'text-gray-400'}`}>
                       {step.title}
                     </p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                       {step.time}
                     </p>
                  </div>

                  {step.completed && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <FiCheckCircle className="text-warm-sand text-lg" />
                    </motion.div>
                  )}
               </div>
             ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="p-6 pb-28">
          <div className="bg-deep-espresso rounded-[2rem] p-8 text-white flex items-center justify-between shadow-2xl shadow-deep-espresso/20 overflow-hidden relative group">
             <div className="relative z-10">
               <p className="text-xs font-bold opacity-60 mb-1">Need help with your order?</p>
               <p className="text-sm font-black tracking-widest underline decoration-warm-sand decoration-2 underline-offset-8">SUPPORT CENTER</p>
             </div>
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md relative z-10 group-hover:bg-warm-sand transition-all duration-300">
               <FiArrowLeft className="rotate-180 text-xl" />
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-warm-sand/10 rounded-full blur-3xl -mr-16 -mt-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
