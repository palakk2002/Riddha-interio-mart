// firebase-messaging-sw.js
// Firebase Cloud Messaging Service Worker
// This file MUST be in the root of the public folder (served at /firebase-messaging-sw.js)

importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

// NOTE: These values are safe to expose in the service worker.
// They are non-secret Firebase configuration keys (your Firebase project's public config).
// Replace these with your actual Firebase project config values.
const firebaseConfig = {
  apiKey: 'AIzaSyD_IxUqAwe9E6pKIODO03WVvZBocAkE3ms',
  authDomain: 'riddha-interior-mart.firebaseapp.com',
  projectId: 'riddha-interior-mart',
  storageBucket: 'riddha-interior-mart.firebasestorage.app',
  messagingSenderId: '821741062067',
  appId: '1:821741062067:web:53b8d8b91214042fc26dc6',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages (app is closed or not in focus)
messaging.onBackgroundMessage((payload) => {
  console.log('[FCM Service Worker] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: payload.data || {},
    tag: payload.data?.type || 'general', // Prevents duplicate notifications of the same type
    renotify: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click - open or focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = new URL('/', self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // If app is already open, focus it
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
