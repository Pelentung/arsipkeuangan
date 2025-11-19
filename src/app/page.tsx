'use client';

import { AppSidebar } from '@/components/app/app-sidebar';
import { getContracts } from '@/lib/contracts';
import { ContractView, ContractViewSkeleton } from '@/components/app/contract-view';
import { Suspense, useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import type { Contract } from '@/lib/types';

function ContractLoader({ userId }: { userId: string }) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContracts() {
      if (userId) {
        const fetchedContracts = await getContracts(userId);
        setContracts(fetchedContracts);
        setLoading(false);
      }
    }
    loadContracts();
  }, [userId]);

  if (loading) {
    return <ContractViewSkeleton />;
  }

  return <ContractView initialContracts={contracts} />;
}

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full bg-background items-center justify-center">
        <ContractViewSkeleton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <Suspense fallback={<ContractViewSkeleton />}>
          <ContractLoader userId={user.uid} />
        </Suspense>
      </main>
    </div>
  );
}
