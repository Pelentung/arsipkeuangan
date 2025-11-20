'use client';

import { AppSidebar } from '@/components/app/app-sidebar';
import { ContractProvider, useContractContextData } from '@/contexts/contract-context';
import { ReactNode } from 'react';
import FirebaseErrorListener from '@/components/firebase/error-listener';
import { AppHeader } from './app-header';

function MainContent({ children }: { children: ReactNode }) {
    const contractContextValue = useContractContextData();

    return (
        <ContractProvider value={contractContextValue}>
            <div className="flex min-h-screen w-full flex-col">
                <AppHeader />
                <div className="flex flex-1">
                    <AppSidebar />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                        {children}
                    </main>
                </div>
                <footer className="p-4 text-center border-t">
                    <p className="text-sm text-muted-foreground">Design Aplication By : PELENTUNG</p>
                </footer>
            </div>
            <FirebaseErrorListener />
        </ContractProvider>
    );
}

export function AppLayout({ children }: { children: ReactNode }) {
    return <MainContent>{children}</MainContent>;
}
