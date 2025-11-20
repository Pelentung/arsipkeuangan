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
    newContractData: Omit<Contract, 'id' | 'realization' | 'remainingValue' | 'bills'>
  ) => void;
  updateContract: (
    contractId: string,
    updatedData: Partial<Omit<Contract, 'id' | 'userId' | 'bills'>>
  ) => void;
  deleteContract: (contractId: string) => void;
  addBill: (contractId: string, bill: Omit<Bill, 'id'>) => void;
  updateBill: (contractId: string, billId: string, updatedBillData: Omit<Bill, 'id'>) => void;
  deleteBill: (contractId: string, billId: string) => void;
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
    newContractData: Omit<Contract, 'id' | 'realization' | 'remainingValue' | 'bills'>
  ) => {
    setContracts((prevContracts) => {
      const realization = newContractData.realization || 0;
      const newContract: Contract = {
        ...newContractData,
        id: new Date().toISOString(), // Simple unique ID
        realization,
        remainingValue: newContractData.value - realization,
        bills: [], // Initialize with an empty bills array
      };
      return [...prevContracts, newContract];
    });
  };

  const updateContract = (
    contractId: string,
    updatedData: Partial<Omit<Contract, 'id' | 'userId' | 'bills'>>
  ) => {
    setContracts((prevContracts) =>
      prevContracts.map((contract) => {
        if (contract.id === contractId) {
          const newContractData = { ...contract, ...updatedData };
          const realization = newContractData.realization;
          const remainingValue = newContractData.value - realization;
          return {
            ...newContractData,
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

  const addBill = (contractId: string, billData: Omit<Bill, 'id'>) => {
    const newBill: Bill = { ...billData, id: new Date().toISOString() };
    setContracts((prevContracts) => {
      return prevContracts.map((contract) => {
        if (contract.id === contractId) {
          const updatedBills = [...(contract.bills || []), newBill];
          const newRealization = updatedBills.reduce((sum, b) => sum + b.amount, 0);
          const newRemainingValue = contract.value - newRealization;

          return {
            ...contract,
            bills: updatedBills,
            realization: newRealization,
            remainingValue: newRemainingValue,
          };
        }
        return contract;
      });
    });
  };

  const updateBill = (contractId: string, billId: string, updatedBillData: Omit<Bill, 'id'>) => {
    setContracts(prevContracts => 
      prevContracts.map(contract => {
        if (contract.id === contractId) {
          const updatedBills = contract.bills.map(bill => 
            bill.id === billId ? { ...bill, ...updatedBillData } : bill
          );
          const newRealization = updatedBills.reduce((sum, b) => sum + b.amount, 0);
          const newRemainingValue = contract.value - newRealization;
          return {
            ...contract,
            bills: updatedBills,
            realization: newRealization,
            remainingValue: newRemainingValue,
          };
        }
        return contract;
      })
    );
  };
  
  const deleteBill = (contractId: string, billId: string) => {
    setContracts(prevContracts => 
      prevContracts.map(contract => {
        if (contract.id === contractId) {
          const updatedBills = contract.bills.filter(bill => bill.id !== billId);
          const newRealization = updatedBills.reduce((sum, b) => sum + b.amount, 0);
          const newRemainingValue = contract.value - newRealization;
          return {
            ...contract,
            bills: updatedBills,
            realization: newRealization,
            remainingValue: newRemainingValue,
          };
        }
        return contract;
      })
    );
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
    updateBill,
    deleteBill,
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
