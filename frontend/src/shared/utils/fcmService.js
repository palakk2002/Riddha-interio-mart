/**
 * fcmService.js
 * Client-side Firebase Cloud Messaging wrapper.
 *
 * Responsibilities:
 *  1. Initialize the Firebase app (using public VITE_ env variables)
 *  2. Register the firebase-messaging-sw.js service worker
 *  3. Request notification permission from the browser
 *  4. Retrieve the FCM registration token
 *  5. Register / revoke the token with the backend API
 *
 * Architecture note:
 *  - This module is lazy-initialized. Firebase SDK is NOT imported at the top
 *    level to avoid adding it to the main bundle. Call initFCM() only after the
 *    user is authenticated to keep Time-to-Interactive unaffected.
 */

let messagingInstance = null;
let currentToken = null;
let deniedPermissionLogged = false;

/**
 * Initialize Firebase messaging lazily and return the messaging instance.
 * Returns null if Firebase is not configured or the browser doesn't support it.
 */
async function getMessaging() {
  if (messagingInstance) return messagingInstance;

  // Check basic browser support
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    console.log('[FCM] Browser does not support notifications or service workers.');
    return null;
  }

  // Validate that all required config env variables are present
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (!apiKey || !projectId || !messagingSenderId || !appId) {
    console.log('[FCM] Firebase config not set. Push notifications disabled. Set VITE_FIREBASE_* env variables to enable.');
    return null;
  }

  try {
    // Dynamic import to keep Firebase out of the initial bundle
    const { initializeApp, getApps } = await import('firebase/app');
    const { getMessaging: getFBMessaging, isSupported } = await import('firebase/messaging');

    const supported = await isSupported();
    if (!supported) {
      console.log('[FCM] Firebase Messaging is not supported in this browser.');
      return null;
    }

    const firebaseConfig = {
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId,
      appId,
    };

    // Prevent duplicate app initialization (React StrictMode double-effect)
    const app =
      getApps().find((a) => a.name === '[DEFAULT]') ||
      initializeApp(firebaseConfig);

    messagingInstance = getFBMessaging(app);
    return messagingInstance;
  } catch (err) {
    console.error('[FCM] Failed to initialize Firebase Messaging:', err.message);
    return null;
  }
}

/**
 * Request browser notification permission and retrieve the FCM token.
 * @returns {string|null} FCM registration token or null if unavailable.
 */
async function requestPermissionAndGetToken() {
  const messaging = await getMessaging();
  if (!messaging) return null;

  try {
    if (Notification.permission === 'denied') {
      if (!deniedPermissionLogged) {
        console.log('[FCM] Notification permission is blocked in this browser. Push notifications disabled.');
        deniedPermissionLogged = true;
      }
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      if (!deniedPermissionLogged) {
        console.log('[FCM] Notification permission denied by user.');
        deniedPermissionLogged = true;
      }
      return null;
    }

    // Register the service worker
    const swRegistration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/' }
    );
    await navigator.serviceWorker.ready;

    const { getToken } = await import('firebase/messaging');
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      console.log('[FCM] Registration token obtained:', token.slice(0, 20) + '...');
      currentToken = token;
      return token;
    } else {
      console.log('[FCM] No registration token available.');
      return null;
    }
  } catch (err) {
    console.error('[FCM] Failed to get registration token:', err.message);
    return null;
  }
}

/**
 * Register the FCM token with the backend. Should be called after login.
 * @param {Function} apiPost - Axios-style post function, e.g. api.post
 */
async function registerFCMToken(apiPost) {
  try {
    const token = await requestPermissionAndGetToken();
    if (!token) return;

    await apiPost('/notifications/fcm-token', { token, platform: 'web' });
    console.log('[FCM] Token registered with backend successfully.');
  } catch (err) {
    // Non-fatal: FCM failure should never break the app
    console.warn('[FCM] Failed to register token with backend:', err.message);
  }
}

/**
 * Revoke the FCM token from the backend. Should be called on logout.
 * @param {Function} apiDelete - Axios-style delete function, e.g. api.delete
 */
async function revokeFCMToken(apiDelete) {
  if (!currentToken) return;
  try {
    await apiDelete('/notifications/fcm-token', { data: { token: currentToken } });
    console.log('[FCM] Token revoked from backend successfully.');
    currentToken = null;
  } catch (err) {
    console.warn('[FCM] Failed to revoke token from backend:', err.message);
  }
}

/**
 * Set up a foreground message listener (app is open and focused).
 * @param {Function} onMessage - Callback invoked with the FCM payload
 * @returns {Function} Unsubscribe function
 */
async function onForegroundMessage(onMessage) {
  const messaging = await getMessaging();
  if (!messaging) return () => {};

  try {
    const { onMessage: fbOnMessage } = await import('firebase/messaging');
    const unsubscribe = fbOnMessage(messaging, (payload) => {
      console.log('[FCM] Foreground message received:', payload);
      onMessage(payload);
    });
    return unsubscribe;
  } catch (err) {
    console.error('[FCM] Failed to set up foreground listener:', err.message);
    return () => {};
  }
}

export { registerFCMToken, revokeFCMToken, onForegroundMessage };
