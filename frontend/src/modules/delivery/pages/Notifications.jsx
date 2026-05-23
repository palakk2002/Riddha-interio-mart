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
import api from '../../../shared/utils/api';

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0 || isNaN(diffMs)) return 'Just now';
  const secs = Math.floor(diffMs / 1000);
  if (secs < 60) return 'Just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notifications?limit=50');
      if (data.success && data.data) {
        const mapped = data.data.map(notif => ({
          id: notif._id,
          _id: notif._id,
          title: notif.title,
          message: notif.message,
          status: notif.read ? 'read' : 'unread',
          read: notif.read,
          time: formatTime(notif.createdAt),
          link: notif.metadata?.link || (notif.type === 'delivery_update' ? '/delivery/orders' : null),
          ...notif
        }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleUpdate = () => fetchNotifications();
    window.addEventListener('delivery_notifications_updated', handleUpdate);
    return () => window.removeEventListener('delivery_notifications_updated', handleUpdate);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      const { data } = await api.put(`/notifications/${id}/read`);
      if (data.success) {
        setNotifications(prev => prev.map(n => 
          n.id === id ? { ...n, status: 'read', read: true } : n
        ));
        window.dispatchEvent(new Event('delivery_notifications_updated'));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data } = await api.put('/notifications/read-all');
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, status: 'read', read: true })));
        window.dispatchEvent(new Event('delivery_notifications_updated'));
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const { data } = await api.delete(`/notifications/${id}`);
      if (data.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        window.dispatchEvent(new Event('delivery_notifications_updated'));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const clearAll = async () => {
    if (window.confirm('Clear all notifications?')) {
      try {
        const { data } = await api.delete('/notifications/clear-all');
        if (data.success) {
          setNotifications([]);
          window.dispatchEvent(new Event('delivery_notifications_updated'));
        }
      } catch (err) {
        console.error('Failed to clear all notifications:', err);
      }
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-4 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#189D91]">
              <LuBell size={20} className="animate-bounce" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Notifications
              </h1>
            </div>
            <p className="text-xs font-semibold text-slate-500">
              {unreadCount} Unread Alerts • {notifications.length} Total Records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 bg-teal-50 text-[#189D91] rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-teal-100 transition-all flex items-center gap-1.5"
            >
              <LuCheck size={14} /> Mark All Read
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1.5 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-rose-100 transition-all flex items-center gap-1.5"
            >
              <LuTrash2 size={14} /> Clear All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
          {['all', 'unread'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-[#189D91] text-white shadow-sm' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={`skeleton-${index}`}
                  className="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-4 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="h-4 bg-slate-100 rounded-md w-1/3" />
                      <div className="h-3 bg-slate-100 rounded-md w-16" />
                    </div>
                    <div className="h-3 bg-slate-100 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                  </div>
                </div>
              ))
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative bg-white rounded-xl border transition-all duration-300 ${
                    !n.read 
                      ? 'border-[#189D91]/30 shadow-sm ring-1 ring-[#189D91]/10' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="p-4 flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                      !n.read 
                        ? 'bg-[#189D91] text-white shadow-sm' 
                        : 'bg-slate-50 text-slate-400'
                    }`}>
                      <LuBell size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h3 className={`text-sm font-bold truncate ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>
                          {n.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                          <LuClock size={12} />
                          {n.time}
                        </div>
                      </div>
                      <p className={`text-xs leading-relaxed ${!n.read ? 'text-slate-700' : 'text-slate-500'}`}>
                        {n.message}
                      </p>

                      <div className="mt-2.5 flex items-center gap-4">
                        {n.link && (
                          <button
                            onClick={() => {
                              markAsRead(n._id);
                              navigate(n.link);
                            }}
                            className="text-[10px] font-bold uppercase tracking-wider text-[#189D91] hover:underline flex items-center gap-1"
                          >
                            View Details <LuChevronRight size={14} />
                          </button>
                        )}
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n._id)}
                            className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteNotification(n._id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                  <LuInbox size={32} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Inbox Clear</h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">No notifications to show</p>
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
