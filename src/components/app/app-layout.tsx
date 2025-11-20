'use client';

import { AppSidebar } from '@/components/app/app-sidebar';
import { ContractProvider, useContractContextData } from '@/contexts/contract-context';
import { ReactNode } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
    const contractContextValue = useContractContextData();

    return (
        <ContractProvider value={contractContextValue}>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />
                {children}
            </div>
        </ContractProvider>
    );
}
