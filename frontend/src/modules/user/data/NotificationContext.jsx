import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../../shared/utils/api';
import { useUser } from './UserContext';
import { io } from 'socket.io-client';
import { playNotificationSound } from '../../../shared/utils/notificationSound';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/notifications?limit=50');
      setNotifications(res.data.data);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Socket connection
  useEffect(() => {
    if (user && user.token) {
      fetchNotifications();

      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: { token: user.token },
        transports: ['polling', 'websocket']
      });

      newSocket.on('connect', () => console.log('Socket connected for notifications'));

      newSocket.on('notification:new', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        playNotificationSound();
        
        // Show a small toast
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-gray-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#189D91] hover:text-[#006B5C] focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        ), { duration: 4000 });
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => {
        const notif = prev.find(n => n._id === id);
        if (notif && !notif.read) {
          setUnreadCount(c => Math.max(0, c - 1));
        }
        return prev.filter(n => n._id !== id);
      });
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
