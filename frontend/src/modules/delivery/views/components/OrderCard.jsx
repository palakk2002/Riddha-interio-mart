import React from 'react';
import { LuMapPin, LuPhone, LuPackage, LuClock, LuCheck, LuX } from 'react-icons/lu';
import StatusBadge from './StatusBadge';

const OrderCard = ({ order, onAccept, onReject, onUpdateStatus }) => {
  const isAvailable = order.status === 'Pending';
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-soft-oatmeal overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-soft-oatmeal flex justify-between items-center bg-soft-oatmeal/5">
        <div>
          <span className="text-[10px] font-bold text-warm-sand uppercase tracking-tighter">Order ID</span>
          <p className="text-sm font-bold text-deep-espresso">{order.id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Locations */}
        <div className="space-y-3 relative">
          <div className="absolute left-[11px] top-[24px] bottom-[24px] w-[1px] border-l border-dashed border-warm-sand/30"></div>
          
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-soft-oatmeal flex items-center justify-center shrink-0 z-10">
              <LuPackage size={12} className="text-warm-sand" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-warm-sand uppercase tracking-tighter">Pickup From</p>
              <p className="text-xs font-bold text-deep-espresso">{order.sellerLocation}</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-warm-sand/20 flex items-center justify-center shrink-0 z-10 text-warm-sand">
              <LuMapPin size={12} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-warm-sand uppercase tracking-tighter">Deliver To</p>
              <p className="text-xs font-bold text-deep-espresso">{order.customerName}</p>
              <p className="text-xs text-dusty-cocoa mt-0.5 line-clamp-1">{order.address}</p>
            </div>
          </div>
        </div>

        {/* Details List */}
        <div className="bg-soft-oatmeal/10 rounded-xl p-3 space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-dusty-cocoa">{item.quantity}x {item.name}</span>
              <span className="font-bold text-deep-espresso">₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-soft-oatmeal flex justify-between items-center">
            <span className="text-[10px] font-bold text-warm-sand uppercase">Total Bill</span>
            <span className="text-sm font-bold text-deep-espresso">₹{order.totalBill}</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex justify-between items-center text-[10px] font-medium text-warm-sand">
          <div className="flex items-center gap-1">
            <LuClock size={12} />
            {order.dateTime}
          </div>
          <div className="px-2 py-0.5 bg-deep-espresso/5 rounded text-deep-espresso">
            {order.paymentMode}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-soft-oatmeal/5 border-t border-soft-oatmeal">
        {isAvailable ? (
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onReject(order.id)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-soft-oatmeal text-xs font-bold text-dusty-cocoa hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all uppercase tracking-wider"
            >
              <LuX size={14} /> Reject
            </button>
            <button 
              onClick={() => onAccept(order.id)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-deep-espresso text-white text-xs font-bold hover:bg-warm-sand transition-all shadow-lg shadow-deep-espresso/10 uppercase tracking-wider"
            >
              <LuCheck size={14} /> Accept
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <a href={`tel:${order.phone}`} className="flex items-center gap-2 text-xs font-bold text-warm-sand hover:text-deep-espresso transition-colors">
                <LuPhone size={14} /> Contact Customer
              </a>
            </div>
            
            {order.status === 'Accepted' && (
              <button 
                onClick={() => onUpdateStatus(order.id, 'Picked')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-deep-espresso text-white text-sm font-bold hover:bg-warm-sand transition-all shadow-lg shadow-deep-espresso/10"
              >
                Mark as Picked
              </button>
            )}
            
            {order.status === 'Picked' && (
              <button 
                onClick={() => onUpdateStatus(order.id, 'Out for Delivery')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-deep-espresso text-white text-sm font-bold hover:bg-warm-sand transition-all shadow-lg shadow-deep-espresso/10"
              >
                Mark as Out for Delivery
              </button>
            )}

            {order.status === 'Out for Delivery' && (
              <button 
                onClick={() => onUpdateStatus(order.id, 'Delivered')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/10"
              >
                Mark as Delivered
              </button>
            )}

            {order.status === 'Delivered' && (
              <div className="text-center py-2 text-xs font-bold text-green-600 flex items-center justify-center gap-2">
                <LuCheck size={16} /> Delivery Completed Successfully
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
