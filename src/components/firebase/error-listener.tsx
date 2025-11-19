'use client';
// NOTE: This is a dev-only component. It is not intended for production use.

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';

export default function FirebaseErrorListener() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const handlePermissionError = (error: FirestorePermissionError) => {
      // Throwing an error in a useEffect hook will be caught by Next.js's
      // error boundary and displayed in the development overlay.
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}
