// IMPORTANT: Do not use this configuration for production.
// Instead, use environment variables as shown below.
// This file is for reference and local development fallback only.

const fallbackConfig = {
  projectId: 'studio-7968430515-d32d0',
  appId: '1:929552567620:web:17cfd2ef61f815554b9b11',
  apiKey: 'AIzaSyABIjdCXF3bunukhrcflhOl1rjMKMLK7Mc',
  authDomain: 'studio-7968430515-d32d0.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '929552567620',
};

// Use environment variables in production and for local development.
// Vercel and other modern hosts will automatically use variables from their UI.
// For local development, you can create a .env.local file.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || fallbackConfig.appId,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId,
};
