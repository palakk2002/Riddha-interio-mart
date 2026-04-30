import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiX, FiArrowRight } from 'react-icons/fi';
import { connectSocket } from '../../../shared/utils/socket';
import { useNavigate } from 'react-router-dom';

import { playNotificationSound } from '../../../shared/utils/notificationSound';

const UserNotifications = ({ token }) => {
  const [activeNotification, setActiveNotification] = useState(null);
  const navigate = useNavigate();

  const playSound = useCallback(() => {
    playNotificationSound();
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket({ token });

    socket.on('order:status_update', (payload) => {
      playSound();
      setActiveNotification(payload);
    });

    return () => {
      socket.off('order:status_update');
    };
  }, [token, playSound]);

  useEffect(() => {
    if (activeNotification) {
      const timer = setTimeout(() => setActiveNotification(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [activeNotification]);

  return (
    <AnimatePresence>
      {activeNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
          className="fixed bottom-24 left-1/2 z-[9999] w-[90%] max-w-md bg-white rounded-3xl shadow-2xl border border-soft-oatmeal p-6 flex items-start gap-4 overflow-hidden"
        >
          {/* Status Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#189D91]" />

          <div className="w-12 h-12 rounded-2xl bg-[#189D91]/10 text-[#189D91] flex items-center justify-center shrink-0">
             <FiShoppingBag size={24} className="animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
             <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#189D91]">Order Update</p>
                <button onClick={() => setActiveNotification(null)} className="text-gray-400 hover:text-gray-600">
                   <FiX size={18} />
                </button>
             </div>
             <h4 className="text-lg font-black text-gray-900 truncate tracking-tight">{activeNotification.message}</h4>
             <p className="text-xs text-gray-500 mt-1 font-medium">Track your order details for live updates.</p>
             
             <div className="mt-4 flex gap-3">
                <button 
                  onClick={() => {
                    navigate(`/track-order/${activeNotification.orderId}`);
                    setActiveNotification(null);
                  }}
                  className="flex-1 bg-[#189D91] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                   Track Now <FiArrowRight size={14} />
                </button>
                <button 
                  onClick={() => setActiveNotification(null)}
                  className="px-6 py-3 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400"
                >
                   Later
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserNotifications;
