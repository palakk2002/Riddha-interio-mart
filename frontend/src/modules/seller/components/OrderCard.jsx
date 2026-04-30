import React from 'react';
import { FiMapPin, FiClock, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const OrderCard = ({ order, onClick }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return "text-amber-600 bg-amber-50 border-amber-100";
      case "Processing": return "text-blue-600 bg-blue-50 border-blue-100";
      case "Shipped": return "text-purple-600 bg-purple-50 border-purple-100";
      case "Delivered": return "text-green-600 bg-green-50 border-green-100";
      default: return "text-red-600 bg-red-50 border-red-100";
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white p-5 rounded-[2rem] border border-soft-oatmeal shadow-sm flex flex-col gap-4 active:bg-soft-oatmeal/5 transition-all"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-soft-oatmeal/20 flex items-center justify-center text-deep-espresso/40">
            <FiClock size={18} />
          </div>
          <div>
            <p className="text-xs font-black text-deep-espresso uppercase tracking-tighter">#{order._id.slice(-8).toUpperCase()}</p>
            <p className="text-[9px] text-warm-sand font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${getStatusStyle(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#bd3b64]/10 text-[#bd3b64] flex items-center justify-center font-black text-[10px]">
            {String(order.shippingAddress?.fullName || "G").charAt(0)}
          </div>
          <div>
            <p className="text-[11px] font-bold text-deep-espresso truncate max-w-[120px]">{order.shippingAddress?.fullName}</p>
            <p className="text-[9px] text-dusty-cocoa flex items-center gap-1 uppercase tracking-tighter">
              <FiMapPin size={8} /> {order.shippingAddress?.city}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-deep-espresso">₹{Number(order.totalPrice).toLocaleString()}</p>
          <FiChevronRight size={16} className="text-warm-sand ml-auto mt-1" />
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
