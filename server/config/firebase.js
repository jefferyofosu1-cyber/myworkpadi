import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

let firebaseApp;

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (serviceAccountPath) {
    try {
        const serviceAccount = JSON.parse(readFileSync(join(process.cwd(), serviceAccountPath), 'utf8'));
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('[Firebase] Initialized successfully');
    } catch (err) {
        console.error('[Firebase] Initialization error:', err.message);
    }
} else {
    console.warn('[Firebase] Missing FIREBASE_SERVICE_ACCOUNT_PATH. Push notifications will be mocked.');
}

/**
 * Robust Mock for Firebase Messaging in development
 */
const mockMessaging = {
    send: async (payload) => {
        console.log('[PUSH MOCK] Sending notification:', payload);
        return 'mock-message-id-' + Date.now();
    },
    sendEachForMulticast: async (payload) => {
        console.log('[PUSH MOCK] Multicast notification:', payload);
        return { successCount: payload.tokens.length, failureCount: 0 };
    }
};

export const messaging = firebaseApp ? admin.messaging() : mockMessaging;
export default firebaseApp;
