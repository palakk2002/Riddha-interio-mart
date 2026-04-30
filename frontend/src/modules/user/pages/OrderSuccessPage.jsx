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
        className="w-24 h-24 bg-[#189D91] rounded-full flex items-center justify-center shadow-2xl shadow-[#189D91]/20 mb-10"
      >
        <FiCheck className="text-white text-5xl stroke-[3]" />
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 max-w-sm"
      >
        <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight uppercase">Order Placed!</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.1em] leading-relaxed px-4">
          Your payment was successful and your order <span className="text-[#189D91] font-black">#{orderId}</span> has been confirmed.
        </p>
      </motion.div>

      {/* Order Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 w-full max-w-md bg-gray-50 border border-gray-100 rounded-3xl p-8 space-y-8"
      >
        <div className="flex items-center gap-5 text-left">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#189D91]">
              <FiShoppingBag size={20} />
           </div>
           <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">ORDER STATUS</p>
              <p className="text-xs font-black text-gray-900 uppercase">Confirmed & Processing</p>
           </div>
        </div>

        <div className="flex items-center gap-5 text-left">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#189D91]">
              <FiMapPin size={20} />
           </div>
           <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">ESTIMATED DELIVERY</p>
              <p className="text-xs font-black text-gray-900 uppercase">Within 4 Hours</p>
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
          onClick={() => navigate('/')}
          className="w-full h-16 rounded-2xl bg-[#189D91] text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#189D91]/20 flex items-center justify-center gap-3"
        >
          CONTINUE SHOPPING <FiArrowRight className="text-lg" />
        </Button>
        <button 
          onClick={() => navigate('/orders')}
          className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-[#189D91] transition-colors"
        >
          View My Orders
        </button>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
