'use client';

import { Contract } from '@/lib/types';
import { createContext, useContext, ReactNode } from 'react';

type ContractContextType = {
    addContract: (newContractData: Omit<Contract, 'id' | 'realization' | 'remainingValue'>) => void;
    addBill: (contractId: string, bill: { amount: number, billDate: string, description: string }) => void;
};

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function useContractContext() {
    const context = useContext(ContractContext);
    if (!context) {
        throw new Error('useContractContext must be used within a ContractProvider');
    }
    return context;
}

interface ContractProviderProps {
    children: ReactNode;
    onAddContract: (newContractData: Omit<Contract, 'id' | 'realization' | 'remainingValue'>) => void;
    onAddBill: (contractId: string, bill: { amount: number, billDate: string, description: string }) => void;
}

export function ContractProvider({ children, onAddContract, onAddBill }: ContractProviderProps) {
    const value = {
        addContract: onAddContract,
        addBill: onAddBill,
    };
    return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
}
