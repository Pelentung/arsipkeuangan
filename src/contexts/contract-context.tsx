'use client';

import { Contract, Bill } from '@/lib/types';
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';

type ContractContextType = {
  contracts: Contract[];
  loading: boolean;
  addContract: (
    newContractData: Omit<Contract, 'id' | 'realization' | 'remainingValue'>
  ) => void;
  updateContract: (
    contractId: string,
    updatedData: Omit<Contract, 'id' | 'userId'>
  ) => void;
  deleteContract: (contractId: string) => void;
  addBill: (contractId: string, bill: Omit<Bill, 'id'>) => void;
  getContractById: (contractId: string) => Contract | undefined;
};

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

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
      console.error('Failed to load contracts from localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('contracts', JSON.stringify(contracts));
      } catch (error) {
        console.error('Failed to save contracts to localStorage', error);
      }
    }
  }, [contracts, loading]);

  const addContract = (
    newContractData: Omit<Contract, 'id' | 'realization' | 'remainingValue'>
  ) => {
    setContracts((prevContracts) => {
      const newContract: Contract = {
        ...newContractData,
        id: new Date().toISOString(), // Simple unique ID
        realization: newContractData.realization || 0,
        remainingValue:
          newContractData.value - (newContractData.realization || 0),
      };
      return [...prevContracts, newContract];
    });
  };

  const updateContract = (
    contractId: string,
    updatedData: Omit<Contract, 'id' | 'userId'>
  ) => {
    setContracts((prevContracts) =>
      prevContracts.map((contract) => {
        if (contract.id === contractId) {
          const realization =
            updatedData.realization ?? contract.realization;
          const remainingValue = updatedData.value - realization;
          return {
            ...contract,
            ...updatedData,
            realization,
            remainingValue,
          };
        }
        return contract;
      })
    );
  };

  const deleteContract = (contractId: string) => {
    setContracts((prevContracts) =>
      prevContracts.filter((contract) => contract.id !== contractId)
    );
  };

  const addBill = (contractId: string, bill: Omit<Bill, 'id'>) => {
    setContracts((prevContracts) => {
      return prevContracts.map((contract) => {
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

  const getContractById = (contractId: string) => {
    return contracts.find((c) => c.id === contractId);
  };

  return {
    contracts,
    loading,
    addContract,
    updateContract,
    deleteContract,
    addBill,
    getContractById,
  };
}

interface ContractProviderProps {
  children: ReactNode;
  value: ContractContextType;
}

export function ContractProvider({
  children,
  value,
}: ContractProviderProps) {
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}
