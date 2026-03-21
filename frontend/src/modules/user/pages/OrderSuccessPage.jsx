import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiArrowRight, FiShoppingBag, FiMapPin } from 'react-icons/fi';
import Button from '../../../shared/components/Button';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const savedId = localStorage.getItem('last_order_id');
    setOrderId(savedId || 'RD-PAYMENT-SUCCESS');
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {/* Success Animation */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-24 h-24 bg-warm-sand rounded-full flex items-center justify-center shadow-2xl shadow-warm-sand/20 mb-8"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FiCheck className="text-white text-5xl stroke-[3]" />
        </motion.div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 max-w-sm"
      >
        <h1 className="text-3xl font-black text-deep-espresso uppercase tracking-tight">Order Placed!</h1>
        <p className="text-sm text-gray-400 font-medium leading-relaxed px-4">
          Your payment was successful and your order <span className="text-deep-espresso font-bold">#{orderId}</span> has been confirmed.
        </p>
      </motion.div>

      {/* Order Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 w-full max-w-md bg-soft-oatmeal/5 border border-soft-oatmeal/20 rounded-[2.5rem] p-8 space-y-6"
      >
        <div className="flex items-center gap-4 text-left">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-warm-sand">
              <FiShoppingBag className="text-xl" />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
              <p className="text-sm font-bold text-deep-espresso">Processing your order</p>
           </div>
        </div>

        <div className="flex items-center gap-4 text-left">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-warm-sand">
              <FiMapPin className="text-xl" />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Estimated Delivery</p>
              <p className="text-sm font-bold text-deep-espresso">By Wednesday, 25th March</p>
           </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 w-full max-w-md space-y-4"
      >
        <Button 
          onClick={() => navigate('/order-tracking')}
          size="lg" 
          className="w-full h-16 rounded-2xl bg-warm-sand text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-warm-sand/30 flex items-center justify-center gap-3"
        >
          TRACK ORDER <FiArrowRight className="text-lg" />
        </Button>
        <button 
          onClick={() => navigate('/')}
          className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-deep-espresso transition-colors"
        >
          Continue Shopping
        </button>
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-warm-sand/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-soft-oatmeal/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default OrderSuccessPage;
