'use client';

import { Contract, Bill } from '@/lib/types';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type ContractContextType = {
    contracts: Contract[];
    loading: boolean;
    addContract: (newContractData: Omit<Contract, 'id' | 'realization' | 'remainingValue'>) => void;
    addBill: (contractId: string, bill: Omit<Bill, 'id'>) => void;
};

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function useContractContext() {
    const context = useContext(ContractContext);
    if (!context) {
        throw new Error('useContractContext must be used within a ContractProvider');
    }
    return context;
}

export function useContractContextData(): ContractContextType {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedContracts = localStorage.getItem('contracts');
            if (savedContracts) {
                setContracts(JSON.parse(savedContracts));
            }
        } catch (error) {
            console.error("Failed to load contracts from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            try {
                localStorage.setItem('contracts', JSON.stringify(contracts));
            } catch (error) {
                console.error("Failed to save contracts to localStorage", error);
            }
        }
    }, [contracts, loading]);

    const addContract = (newContractData: Omit<Contract, 'id' | 'realization' | 'remainingValue'>) => {
        setContracts(prevContracts => {
            const newContract: Contract = {
                ...newContractData,
                id: new Date().toISOString(), // Simple unique ID
                realization: newContractData.realization || 0,
                remainingValue: newContractData.value - (newContractData.realization || 0),
            };
            return [...prevContracts, newContract];
        });
    };

    const addBill = (contractId: string, bill: Omit<Bill, 'id'>) => {
        // Here you would also add the bill itself to a list of bills if you were storing them.
        // For now, we'll just update the financial figures on the contract.
        // The full bill object (including status) is available in the `bill` parameter.
        
        setContracts(prevContracts => {
            return prevContracts.map(contract => {
                if (contract.id === contractId) {
                    const newRealization = contract.realization + bill.amount;
                    const newRemainingValue = contract.value - newRealization;
                    
                    return {
                        ...contract,
                        realization: newRealization,
                        remainingValue: newRemainingValue,
                    };
                }
                return contract;
            });
        });
    };

    return { contracts, loading, addContract, addBill };
}


interface ContractProviderProps {
    children: ReactNode;
    value: ContractContextType;
}

export function ContractProvider({ children, value }: ContractProviderProps) {
    return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
}
