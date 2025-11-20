'use client';

import { AppSidebar } from '@/components/app/app-sidebar';
import { ContractProvider, useContractContextData } from '@/contexts/contract-context';
import { ReactNode } from 'react';
import FirebaseErrorListener from '@/components/firebase/error-listener';

function MainContent({ children }: { children: ReactNode }) {
    const contractContextValue = useContractContextData();

    return (
        <ContractProvider value={contractContextValue}>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                  {children}
                </main>
            </div>
            <FirebaseErrorListener />
        </ContractProvider>
    );
}

export function AppLayout({ children }: { children: ReactNode }) {
    return <MainContent>{children}</MainContent>;
}
