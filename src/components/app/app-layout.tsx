'use client';

import { AppSidebar } from '@/components/app/app-sidebar';
import { ContractProvider, useContractContextData } from '@/contexts/contract-context';
import { ReactNode } from 'react';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import FirebaseErrorListener from '../firebase/error-listener';

export function AppLayout({ children }: { children: ReactNode }) {
    const contractContextValue = useContractContextData();

    return (
        <FirebaseClientProvider>
            <ContractProvider value={contractContextValue}>
                <div className="flex min-h-screen w-full bg-background">
                    <AppSidebar />
                    {children}
                </div>
                <FirebaseErrorListener />
            </ContractProvider>
        </FirebaseClientProvider>
    );
}
