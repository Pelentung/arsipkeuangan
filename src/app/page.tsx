import { AppSidebar } from '@/components/app/app-sidebar';
import { getContracts } from '@/lib/contracts';
import { ContractView, ContractViewSkeleton } from '@/components/app/contract-view';
import { Suspense } from 'react';

async function ContractLoader() {
  const contracts = await getContracts();
  return <ContractView initialContracts={contracts} />;
}

export default function Home() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <Suspense fallback={<ContractViewSkeleton />}>
          <ContractLoader />
        </Suspense>
      </main>
    </div>
  );
}
