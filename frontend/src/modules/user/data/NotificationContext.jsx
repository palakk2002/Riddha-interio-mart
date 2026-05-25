import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../../../shared/utils/api';
import { useUser } from './UserContext';
import { io } from 'socket.io-client';
import { playNotificationSound } from '../../../shared/utils/notificationSound';
import { toast } from 'react-hot-toast';
import { registerFCMToken, revokeFCMToken, onForegroundMessage } from '../../../shared/utils/fcmService';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  // Track FCM foreground unsubscribe function across renders
  const fcmUnsubscribeRef = useRef(null);

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

  /**
   * Handle an incoming push notification (FCM foreground or background click).
   * Converts the FCM payload to a minimal notification-shaped object and
   * surfaces it in the UI the same way Socket.IO notifications do.
   */
  const handleIncomingPush = (payload) => {
    const { notification: fcmNotif, data } = payload;
    const notifObj = {
      _id: `fcm_${Date.now()}`, // Ephemeral ID — not persisted
      title: fcmNotif?.title || data?.title || 'Notification',
      message: fcmNotif?.body || data?.body || '',
      read: false,
      createdAt: new Date().toISOString(),
      type: data?.type || 'general',
    };

    setNotifications((prev) => [notifObj, ...prev]);
    setUnreadCount((prev) => prev + 1);
    playNotificationSound();

    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-gray-900">{notifObj.title}</p>
              <p className="mt-1 text-sm text-gray-500">{notifObj.message}</p>
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
  };

  // Socket connection + FCM initialization
  useEffect(() => {
    if (user && user.token) {
      fetchNotifications();

      // --- Socket.IO connection (primary realtime channel) ---
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

      // --- FCM: Register device token (secondary offline push channel) ---
      // Run after Socket.IO is set up; failures are non-fatal
      registerFCMToken(api.post.bind(api)).catch(() => {});

      // --- FCM: Foreground message listener (app is open + focused) ---
      onForegroundMessage(handleIncomingPush).then((unsubscribe) => {
        fcmUnsubscribeRef.current = unsubscribe;
      });

      return () => {
        newSocket.disconnect();
        // Revoke FCM token on cleanup (effective on logout via UserContext)
        if (fcmUnsubscribeRef.current) {
          fcmUnsubscribeRef.current();
          fcmUnsubscribeRef.current = null;
        }
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      // Revoke FCM token when user logs out
      revokeFCMToken(api.delete.bind(api)).catch(() => {});
      if (fcmUnsubscribeRef.current) {
        fcmUnsubscribeRef.current();
        fcmUnsubscribeRef.current = null;
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

  const contextValue = React.useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  }), [notifications, unreadCount, loading]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
