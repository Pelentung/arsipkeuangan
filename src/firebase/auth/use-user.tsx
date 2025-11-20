'use client';

import { useAuth } from '@/firebase/provider';
import { onIdTokenChanged, User } from 'firebase/auth';
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';

interface UserContextType {
  user: User | null;
  isUserLoading: boolean;
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
  const [isUserLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (newUser) => {
      setUser(newUser);
      setUserLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <UserContext.Provider value={{ user, isUserLoading }}>
      {children}
    </UserContext.Provider>
  );
}
