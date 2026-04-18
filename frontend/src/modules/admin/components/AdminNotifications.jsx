import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuPackage, LuX, LuArrowRight } from 'react-icons/lu';
import { connectSocket, disconnectSocket } from '../../../shared/utils/socket';
import { useNavigate } from 'react-router-dom';

const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

const AdminNotifications = ({ token }) => {
  const [activeNotification, setActiveNotification] = useState(null);
  const navigate = useNavigate();
  const audio = React.useMemo(() => new Audio(NOTIFICATION_SOUND), []);

  const playSound = useCallback(() => {
    audio.play().catch(e => console.warn('Audio play failed:', e));
  }, [audio]);

  useEffect(() => {
    if (!token) {
      console.log('No token for AdminNotifications socket.');
      return;
    }

    console.log('Connecting Admin socket for notifications...');
    const socket = connectSocket({ token });

    socket.on('connect', () => {
      console.log('Admin socket connected successfully. Socket ID:', socket.id);
    });

    socket.on('order:new', (payload) => {
      console.log('ORDER:NEW received in Admin panel:', payload);
      playSound();
      setActiveNotification(payload);
    });

    socket.on('connect_error', (err) => {
      console.error('Admin socket connection error:', err.message);
    });

    return () => {
      console.log('Cleaning up Admin socket listeners...');
      socket.off('order:new');
      socket.off('connect');
      socket.off('connect_error');
    };
  }, [token, playSound]);

  return (
    <AnimatePresence mode="wait">
      {activeNotification && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50, x: '-50%' }}
          animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, scale: 0.8, y: 20, x: '-50%' }}
          className="fixed bottom-10 left-1/2 z-[9999] w-[90%] max-w-md bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-soft-oatmeal p-6 flex items-start gap-4 overflow-hidden group"
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-800 to-deep-espresso" />

            {/* Icon Wrapper */}
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-800 flex-shrink-0">
               <LuPackage size={28} className="animate-bounce" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-deep-espresso">Incoming Order</h3>
                  <button 
                    onClick={() => setActiveNotification(null)}
                    className="p-1 hover:bg-soft-oatmeal rounded-full transition-colors text-warm-sand"
                  >
                    <LuX size={18} />
                  </button>
               </div>
               <p className="text-xl font-display font-bold text-deep-espresso leading-tight">
                  ₹{activeNotification.totalPrice?.toLocaleString()} Order Received
               </p>
               <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-warm-sand font-medium mt-2">
                  <span className="flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                     {activeNotification.customerName || 'Premium Client'}
                  </span>
                  <span className="opacity-30">•</span>
                  <span>{activeNotification.shippingCity || 'Global'}</span>
                  <span className="opacity-30">•</span>
                  <span>{activeNotification.itemsCount} Items</span>
               </div>

               <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => {
                        navigate(`/admin/orders/view/${activeNotification.orderId}`);
                        setActiveNotification(null);
                    }}
                    className="flex-1 bg-deep-espresso text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-red-900 transition-all flex items-center justify-center gap-2"
                  >
                    Process Now <LuArrowRight size={14} />
                  </button>
                  <button 
                    onClick={() => setActiveNotification(null)}
                    className="px-6 py-3 border border-soft-oatmeal rounded-xl text-[10px] font-black uppercase tracking-widest text-warm-sand hover:bg-soft-oatmeal transition-all"
                  >
                    Dismiss
                  </button>
               </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminNotifications;
