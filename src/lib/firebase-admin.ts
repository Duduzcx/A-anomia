import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // The SDK will automatically detect the project credentials in most
    // cloud environments that are part of the Google ecosystem. For other
    // environments, you would typically use a service account file.
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const db = admin.firestore();
