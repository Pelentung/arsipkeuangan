'use client';

import { AppSidebar } from '@/components/app/app-sidebar';
import { ContractProvider, useContractContextData } from '@/contexts/contract-context';
import { ReactNode } from 'react';
import FirebaseErrorListener from '../firebase/error-listener';

function MainContent({ children }: { children: ReactNode }) {
    const contractContextValue = useContractContextData();

    return (
        <ContractProvider value={contractContextValue}>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />
                {children}
            </div>
            <FirebaseErrorListener />
        </ContractProvider>
    );
}

export function AppLayout({ children }: { children: ReactNode }) {
    return <MainContent>{children}</MainContent>;
}
