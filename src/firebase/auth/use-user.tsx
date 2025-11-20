'use client';

import { useAuth } from '@/firebase/provider';
import { onIdTokenChanged, User } from 'firebase/auth';
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import type { UserClaims } from '@/lib/types';

interface UserContextType {
  user: User | null;
  claims: UserClaims | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<UserClaims | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (newUser) => {
      setLoading(true);
      setUser(newUser);
      if (newUser) {
        const tokenResult = await newUser.getIdTokenResult();
        setClaims(tokenResult.claims as UserClaims);
      } else {
        setClaims(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <UserContext.Provider value={{ user, claims, loading }}>
      {children}
    </UserContext.Provider>
  );
}
