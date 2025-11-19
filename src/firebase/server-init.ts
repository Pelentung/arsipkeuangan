// IMPORTANT: This file should not be marked with 'use client'
// It's designed for server-side execution only.
import admin from 'firebase-admin';
import { firebaseConfig } from '@/firebase/config';

// This function should only be called from the server.
export function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    // When running in a Google Cloud environment, the SDK will automatically
    // detect the project ID and credentials. For local development, you would
    // typically use a service account file.
    try {
        admin.initializeApp();
    } catch (e) {
        console.warn('Automatic admin initialization failed. Falling back to config. This is expected for local development.', e);
        // Fallback for local dev if GOOGLE_APPLICATION_CREDENTIALS is not set
        // Note: This relies on the client-side config and may not have admin privileges
        // without a proper service account. For full admin access locally, set up
        // a service account as per Firebase docs.
        admin.initializeApp({
            projectId: firebaseConfig.projectId,
        });
    }
  }
  return admin;
}

export function getFirestoreAdmin() {
    const adminApp = initializeFirebaseAdmin();
    return { firestore: adminApp.firestore() };
}
