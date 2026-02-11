import admin from 'firebase-admin';

function initializeAdmin() {
    // If FIREBASE_SERVICE_ACCOUNT is not set, do nothing and return null.
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        // This warning is helpful for local development.
        console.warn(`
        ********************************************************************************
        ** WARNING: Firebase Admin SDK not configured. App will run in read-only mode.**
        ** To enable database operations for local development, create a .env.local   **
        ** file and set the FIREBASE_SERVICE_ACCOUNT environment variable.            **
        ********************************************************************************
        `);
        return null;
    }

    // If already initialized, return the existing firestore instance.
    if (admin.apps.length > 0) {
        return admin.firestore();
    }

    // Initialize the app
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        return admin.firestore();
    } catch (e) {
        console.error('Firebase Admin SDK Initialization Error. Please check the FIREBASE_SERVICE_ACCOUNT environment variable.', e);
        return null;
    }
}

export const db = initializeAdmin();
