// IMPORTANT: This file should not be marked with 'use client'
// It's designed for server-side execution only.

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// This function should only be called from the server.
export function initializeFirebaseAdmin() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
    return getSdks(firebaseApp);
  }
  return getSdks(getApp());
}

function getSdks(firebaseApp: FirebaseApp) {
  return {
    firestore: getFirestore(firebaseApp),
  };
}

export function getFirestoreAdmin() {
    const { firestore } = initializeFirebaseAdmin();
    return { firestore };
}
