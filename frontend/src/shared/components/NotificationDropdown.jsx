import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiTrash2, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../modules/user/data/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotification();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif) => {
    if (!notif.read) markAsRead(notif._id);
    
    // Optional routing based on type
    if (notif.type === 'order_update') navigate('/orders');
    else if (notif.type === 'delivery_update') navigate('/orders');
    
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-colors ${isMobile ? 'text-deep-espresso hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${isMobile ? 'right-0 w-80' : 'right-0 w-96'} mt-3 glass rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-deep-espresso">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-black uppercase tracking-wider text-[#189D91] hover:text-deep-espresso transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <FiBell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm font-medium">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notif) => (
                  <div 
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${!notif.read ? 'bg-[#189D91]' : 'bg-transparent'}`} />
                    <div className="flex-1">
                      <h4 className={`text-sm ${!notif.read ? 'font-bold text-deep-espresso' : 'font-medium text-gray-700'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      <span className="text-[10px] font-bold text-gray-400 mt-2 block uppercase tracking-wider">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
              <button 
                onClick={() => { setIsOpen(false); navigate('/notifications'); }}
                className="text-[10px] font-black uppercase tracking-widest text-deep-espresso hover:text-[#189D91] transition-colors"
              >
                View All Notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
