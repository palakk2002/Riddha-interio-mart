const admin = require('firebase-admin');
const FCMToken = require('../models/FCMToken');

let firebaseApp;

function initFirebase() {
  if (firebaseApp) return firebaseApp;

  try {
    let credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      credential = admin.credential.cert(serviceAccount);
      console.log('[FCM Admin] Initialized successfully using JSON string from environment.');
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const path = require('path');
      const fs = require('fs');
      const fullPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      if (fs.existsSync(fullPath)) {
        const serviceAccount = require(fullPath);
        credential = admin.credential.cert(serviceAccount);
        console.log(`[FCM Admin] Initialized successfully from file: ${fullPath}`);
      } else {
        console.warn(`[FCM Admin WARNING] Service account file not found at: ${fullPath}`);
      }
    }

    if (!credential) {
      console.warn('[FCM Admin WARNING] No Firebase service account configured. FCM will run in sandbox/mock mode.');
      return null;
    }

    firebaseApp = admin.initializeApp({
      credential
    });

    return firebaseApp;
  } catch (error) {
    console.error('[FCM Admin ERROR] Failed to initialize Firebase Admin SDK:', error.message);
    return null;
  }
}

/**
 * Multicast push notifications to a user's registered FCM tokens.
 * Trims invalid or expired tokens automatically on failure.
 */
async function sendPushNotificationForUser(recipientId, recipientModel, { title, body, data }) {
  // Ensure Firebase Admin is initialized
  initFirebase();
  if (!admin.apps.length) {
    console.log('[FCM Mock] Push skipped (Firebase Admin not initialized):', { recipientId, recipientModel, title });
    return null;
  }

  try {
    // 1. Fetch active tokens
    const tokenDocs = await FCMToken.find({ user: recipientId, userModel: recipientModel }).lean();
    if (!tokenDocs || tokenDocs.length === 0) {
      console.log(`[FCM Log] No tokens registered for ${recipientModel}:${recipientId}`);
      return null;
    }

    const tokens = tokenDocs.map(doc => doc.token);

    // 2. Format custom key/value payloads strictly to string values (FCM specification)
    const fcmData = {};
    if (data) {
      for (const [key, val] of Object.entries(data)) {
        fcmData[key] = typeof val === 'object' ? JSON.stringify(val) : String(val);
      }
    }

    const message = {
      notification: { title, body },
      data: fcmData,
      tokens
    };

    // 3. Dispatch multicast
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`[FCM Log] Sent multicast to ${tokens.length} devices. Success: ${response.successCount}, Failure: ${response.failureCount}`);

    // 4. Trace failures and remove expired or uninstalled tokens automatically
    const tokensToRemove = [];
    response.responses.forEach((res, index) => {
      if (!res.success) {
        const error = res.error;
        if (
          error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered'
        ) {
          tokensToRemove.push(tokens[index]);
        } else {
          console.warn(`[FCM WARNING] Delivery failed for token: ${tokens[index].slice(0, 10)}... | Error: ${error.message}`);
        }
      }
    });

    if (tokensToRemove.length > 0) {
      await FCMToken.deleteMany({ token: { $in: tokensToRemove } });
      console.log(`[FCM Database Cleanup] Revoked ${tokensToRemove.length} stale/invalid tokens.`);
    }

    return response;
  } catch (err) {
    console.error(`[FCM ERROR] Failed to send push notification to ${recipientModel}:${recipientId}:`, err.message);
    return null;
  }
}

module.exports = {
  initFirebase,
  sendPushNotificationForUser
};
