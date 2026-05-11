import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuBell, 
  LuCheck, 
  LuTrash2, 
  LuChevronRight, 
  LuInbox,
  LuClock
} from 'react-icons/lu';
import { 
  getDeliveryNotifications, 
  setDeliveryNotifications 
} from '../utils/deliveryNotifications';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => {
    setNotifications(getDeliveryNotifications());
  }, []);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, status: 'read' } : n
    );
    setNotifications(updated);
    setDeliveryNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, status: 'read' }));
    setNotifications(updated);
    setDeliveryNotifications(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    setDeliveryNotifications(updated);
  };

  const clearAll = () => {
    if (window.confirm('Clear all notifications?')) {
      setNotifications([]);
      setDeliveryNotifications([]);
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => n.status === 'unread')
    : notifications;

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-8 pb-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[#001B4E]">
              <LuBell size={24} className="animate-bounce" />
              <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight italic">
                Notification <span className="text-[#001B4E]/40">Center</span>
              </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#001B4E]/60">
              {unreadCount} Unread Alerts • {notifications.length} Total Records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-[#001B4E]/5 text-[#001B4E] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#001B4E]/10 transition-all flex items-center gap-2"
            >
              <LuCheck size={14} /> Mark All Read
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2"
            >
              <LuTrash2 size={14} /> Clear All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 border-b border-soft-oatmeal pb-4 overflow-x-auto no-scrollbar">
          {['all', 'unread'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-[#001B4E] text-white shadow-lg' 
                  : 'bg-white text-[#001B4E]/40 hover:bg-soft-oatmeal/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative bg-white rounded-3xl border transition-all duration-300 ${
                    n.status === 'unread' 
                      ? 'border-[#001B4E]/20 shadow-md ring-1 ring-[#001B4E]/5' 
                      : 'border-soft-oatmeal hover:border-[#001B4E]/10'
                  }`}
                >
                  <div className="p-6 flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                      n.status === 'unread' 
                        ? 'bg-[#001B4E] text-white shadow-lg rotate-3' 
                        : 'bg-soft-oatmeal/20 text-[#001B4E]/40'
                    }`}>
                      <LuBell size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className={`text-lg font-bold truncate ${n.status === 'unread' ? 'text-black' : 'text-[#001B4E]/60'}`}>
                          {n.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#001B4E]/40 uppercase tracking-wider">
                          <LuClock size={12} />
                          {n.time}
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed ${n.status === 'unread' ? 'text-[#001B4E]/80' : 'text-[#001B4E]/40'}`}>
                        {n.message}
                      </p>

                      <div className="mt-4 flex items-center gap-4">
                        {n.link && (
                          <button
                            onClick={() => {
                              markAsRead(n.id);
                              navigate(n.link);
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-[#001B4E] hover:underline flex items-center gap-1"
                          >
                            View Details <LuChevronRight size={14} />
                          </button>
                        )}
                        {n.status === 'unread' && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="text-[10px] font-black uppercase tracking-widest text-[#001B4E]/40 hover:text-[#001B4E] transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="p-2 text-[#001B4E]/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <LuTrash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-24 h-24 bg-soft-oatmeal/20 rounded-[40px] flex items-center justify-center text-[#001B4E]/10">
                  <LuInbox size={48} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black">Inbox Clear</h3>
                  <p className="text-sm text-[#001B4E]/40 mt-1 uppercase font-black tracking-widest text-[10px]">No notifications to show</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Notifications;
