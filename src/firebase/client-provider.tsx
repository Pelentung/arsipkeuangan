'use client';
import { initializeFirebase, FirebaseProvider } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { ReactNode, useMemo } from 'react';
import { UserProvider } from './auth/use-user';

// This provider is responsible for initializing Firebase on the client side.
// It should be used as a wrapper around the root of your application.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { firebaseApp } = useMemo(
    () => initializeFirebase(),
    []
  );
  
  const auth = useMemo(() => getAuth(firebaseApp), [firebaseApp]);
  const firestore = useMemo(() => getFirestore(firebaseApp), [firebaseApp]);

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      <UserProvider>
        {children}
      </UserProvider>
    </FirebaseProvider>
  );
}
