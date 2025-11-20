'use server';
// IMPORTANT: This file should not be marked with 'use client'
// It's designed for server-side execution only.

import { firebaseConfig } from '@/firebase/config';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { headers } from 'next/headers';
import { getTokens } from 'next-firebase-auth-edge/lib/next/tokens';
import { authConfig } from '@/config/auth-config';

// This function initializes a Firebase app instance (if not already done)
// and returns the initialized app. It's safe to call multiple times.
function initializeServerApp() {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig, 'server-app');
  }
  return getApp('server-app');
}

/**
 * Returns an authenticated Firebase SDK instance for use in Server Components,
 * Server Actions, and Route Handlers.
 *
 * This function authenticates the Firebase client SDK using the user's session token,
 * allowing it to perform operations on behalf of the logged-in user, respecting
 * all Firestore Security Rules.
 */
export async function getAuthedFirebase() {
  const app = initializeServerApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const tokens = await getTokens(headers(), authConfig);

  if (tokens) {
    // We sign in with the custom token but don't need the result
    // because the 'auth' instance is now authenticated.
    await auth.signInWithCustomToken(tokens.token);
  } else {
    // If there are no tokens, it means the user is not logged in.
    // The SDK will act as an unauthenticated user, which is fine
    // for public data access but will fail on protected routes.
  }

  return { auth, firestore, app };
}

// These are additional configs required for next-firebase-auth-edge
export const authConfigServer = {
  apiKey: firebaseConfig.apiKey,
  cookieName: 'AuthToken',
  cookieSignatureKeys: ['secret1', 'secret2'], // Replace with your own secrets
  cookieSerializeOptions: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 12 * 60 * 60 * 24, // 12 days
  },
  serviceAccount: {}, // Leave empty for App Hosting
};
