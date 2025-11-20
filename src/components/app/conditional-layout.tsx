'use client';

import { usePathname, useRouter } from 'next/navigation';
import { AppLayout } from './app-layout';
import { useUser } from '@/firebase';
import { useEffect } from 'react';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const isAuthPage = pathname === '/';

  useEffect(() => {
    if (isUserLoading) return; // Wait for user status to be determined

    if (!user && !isAuthPage) {
      // If not logged in and not on the auth page, redirect to login
      router.push('/');
    } else if (user && isAuthPage) {
      // If logged in and on the auth page, redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, isUserLoading, isAuthPage, router]);

  if (isUserLoading) {
    return <p>Mengalihkan...</p>;
  }

  // If user is not logged in, only render children on the auth page
  if (!user && !isAuthPage) {
    return <p>Mengalihkan...</p>;
  }
  
  // If user is logged in, but tries to access auth page, show loading
  if (user && isAuthPage) {
     return <p>Mengalihkan...</p>;
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}
