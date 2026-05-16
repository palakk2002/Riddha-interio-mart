import React from 'react';
import { 
  LuMapPin, 
  LuPhone, 
  LuPackage, 
  LuClock, 
  LuCheck, 
  LuX, 
  LuNavigation, 
  LuZap,
  LuExternalLink,
  LuChevronRight,
  LuActivity
} from 'react-icons/lu';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';

const OrderCard = ({ order, onAccept, onReject, onUpdateStatus }) => {
  const isAvailable = ['None', 'Pending', 'Rejected'].includes(order.status);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group"
    >
      {/* Dynamic Header */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-[#D63384] group-hover:scale-110 transition-transform">
             <LuPackage size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Mission ID</p>
            <p className="text-sm font-black text-slate-900 tracking-tighter uppercase italic">#{order.id.slice(-8)}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Operations Content */}
      <div className="p-6 space-y-6">
        {/* Logistics Path */}
        <div className="space-y-4 relative">
          <div className="absolute left-[13px] top-[28px] bottom-[28px] w-[2px] bg-gradient-to-b from-[#D63384] to-slate-200"></div>
          
          <div className="flex gap-4 items-start relative z-10">
            <div className="w-7 h-7 rounded-full bg-pink-50 border-4 border-white flex items-center justify-center shrink-0 shadow-sm">
               <div className="w-1.5 h-1.5 rounded-full bg-[#D63384]"></div>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Origin Point</p>
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{order.sellerLocation}</p>
            </div>
          </div>

          <div className="flex gap-4 items-start relative z-10">
            <div className="w-7 h-7 rounded-full bg-slate-900 border-4 border-white flex items-center justify-center shrink-0 shadow-md">
               <LuMapPin size={10} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                 <p className="text-[9px] font-black text-[#D63384] uppercase tracking-widest leading-none mb-1.5">Terminal Destination</p>
                 <span className="text-[10px] font-black text-slate-400">4.2 KM</span>
              </div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{order.customerName}</p>
              <p className="text-[11px] text-slate-500 font-bold mt-1 line-clamp-2 leading-relaxed italic">
                 {order.address}
              </p>
            </div>
          </div>
        </div>

        {/* Cargo Manifest */}
        <div className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Cargo Manifest</p>
             <span className="text-[9px] font-black text-[#D63384] uppercase tracking-widest">{order.items.length} Units</span>
          </div>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{item.quantity}x {item.name}</span>
                <span className="text-[11px] font-black text-slate-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Value</span>
            <span className="text-sm font-black text-slate-900 tracking-tighter">₹{order.totalBill}</span>
          </div>
        </div>

        {/* Intelligence Overlays */}
        <div className="flex items-center justify-between gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-slate-600">
              <LuClock size={12} className="text-[#D63384]" />
              <span className="text-[9px] font-black uppercase tracking-widest">{order.dateTime}</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 rounded-xl text-[#D63384]">
              <LuZap size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">{order.paymentMode}</span>
           </div>
        </div>
      </div>

      {/* Directives Area */}
      <div className="p-6 bg-slate-50/50 border-t border-slate-100">
        {isAvailable ? (
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onReject(order.id)}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-slate-200 bg-white text-[10px] font-black text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all uppercase tracking-widest"
            >
              <LuX size={16} /> Decline
            </button>
            <button 
              onClick={() => onAccept(order.id)}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#D63384] text-white text-[10px] font-black hover:bg-[#B6256B] transition-all shadow-xl shadow-pink-500/20 uppercase tracking-widest"
            >
              <LuCheck size={16} /> Accept Mission
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <a 
                 href={`tel:${order.phone}`} 
                 className="flex items-center gap-2 text-[10px] font-black text-slate-600 hover:text-[#D63384] transition-all uppercase tracking-widest group"
               >
                 <div className="p-2 bg-white rounded-lg border border-slate-100 group-hover:bg-pink-50">
                    <LuPhone size={14} />
                 </div>
                 Establish Contact
               </a>
               <button className="p-2 text-slate-400 hover:text-[#D63384] transition-all">
                  <LuExternalLink size={18} />
               </button>
            </div>
            
            {order.status === 'Accepted' && (
              <button 
                onClick={() => onUpdateStatus(order.id, 'Picked')}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#D63384] text-white text-[11px] font-black hover:bg-[#B6256B] transition-all shadow-xl shadow-pink-500/20 uppercase tracking-widest"
              >
                <LuPackage size={16} /> Confirm Cargo Pickup
              </button>
            )}
            
            {order.status === 'Picked' && (
              <button 
                onClick={() => onUpdateStatus(order.id, 'Out for Delivery')}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#D63384] text-white text-[11px] font-black hover:bg-[#B6256B] transition-all shadow-xl shadow-pink-500/20 uppercase tracking-widest"
              >
                <LuNavigation size={16} className="animate-pulse" /> Initialize Deployment
              </button>
            )}

            {order.status === 'Out for Delivery' && (
              <button 
                onClick={() => onUpdateStatus(order.id, 'Delivered')}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-600 text-white text-[11px] font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest"
              >
                <LuCheck size={16} /> Validate Delivery
              </button>
            )}

            {order.status === 'Delivered' && (
              <div className="bg-emerald-50 text-emerald-600 rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-emerald-100">
                <LuActivity size={16} /> Mission Success
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderCard;
