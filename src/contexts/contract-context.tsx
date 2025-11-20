'use client';

import { Contract, Bill } from '@/lib/types';
import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { useFirestore, useUser, useCollection } from '@/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type ContractContextType = {
  contracts: Contract[];
  loading: boolean;
  addContract: (newContractData: Omit<Contract, 'id'| 'realization' | 'remainingValue' | 'bills' | 'userId'>) => void;
  updateContract: (contractId: string, updatedData: Partial<Omit<Contract, 'id' | 'userId' | 'bills'>>) => void;
  deleteContract: (contractId: string) => void;
  addBill: (contractId: string, bill: Omit<Bill, 'id'>) => void;
  updateBill: (contractId: string, billId: string, updatedBillData: Omit<Bill, 'id'>) => void;
  deleteBill: (contractId: string, billId: string) => void;
  getContractById: (contractId: string) => Contract | undefined;
};

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function useContractContext() {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContractContext must be used within a ContractProvider');
  }
  return context;
}

function fromTimestamp(timestamp: Timestamp | Date | string): string {
    if (!timestamp) return '';
    let date: Date;
    if (timestamp instanceof Timestamp) {
        date = timestamp.toDate();
    } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
    } else {
        date = timestamp;
    }
    if (isNaN(date.getTime())) {
        return ''; 
    }
    return date.toISOString();
}

const removeUndefinedProps = (obj: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};


export function useContractContextData(): ContractContextType {
  const { user } = useUser();
  const firestore = useFirestore();

  const contractsCollectionRef = useMemo(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'contracts');
  }, [firestore, user]);

  const { data: contractsData, isLoading: contractsLoading } = useCollection(contractsCollectionRef, {
      snapshotListenOptions: { includeMetadataChanges: true },
  });
  
  const contracts = useMemo(() => {
    if (!contractsData) return [];
    return contractsData.map((contract: any) => ({
      ...contract,
      id: contract.id,
      contractDate: fromTimestamp(contract.contractDate),
      addendumDate: contract.addendumDate ? fromTimestamp(contract.addendumDate) : undefined,
      bills: contract.bills?.map((bill: any) => ({
          ...bill,
          spmDate: fromTimestamp(bill.spmDate),
          sp2dDate: bill.sp2dDate ? fromTimestamp(bill.sp2dDate) : undefined,
      })) || [],
    }));
  }, [contractsData]);
  
  const loading = contractsLoading;

  const addContract = useCallback(async (newContractData: Omit<Contract, 'id'| 'realization' | 'remainingValue' | 'bills' | 'userId'>) => {
    if (!contractsCollectionRef) return;
    const dataToSave = {
      ...newContractData,
      realization: 0,
      remainingValue: newContractData.value,
      bills: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const cleanedData = removeUndefinedProps(dataToSave);

    addDoc(contractsCollectionRef, cleanedData).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: contractsCollectionRef.path,
        operation: 'create',
        requestResourceData: cleanedData,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [contractsCollectionRef]);


  const updateContract = useCallback(async (contractId: string, updatedData: Partial<Omit<Contract, 'id' | 'userId' | 'bills'>>) => {
    if (!contractsCollectionRef) return;
    const contractDoc = doc(contractsCollectionRef, contractId);
    
    const originalContract = contracts.find(c => c.id === contractId);
    if (!originalContract) return;

    const value = updatedData.value ?? originalContract.value;
    const realization = originalContract.realization;

    const dataToUpdate = {
        ...updatedData,
        remainingValue: value - realization,
        updatedAt: serverTimestamp(),
    };

    const cleanedData = removeUndefinedProps(dataToUpdate);

    updateDoc(contractDoc, cleanedData).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: contractDoc.path,
        operation: 'update',
        requestResourceData: cleanedData,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [contractsCollectionRef, contracts]);

  const deleteContract = useCallback(async (contractId: string) => {
    if (!contractsCollectionRef) return;
    const contractDoc = doc(contractsCollectionRef, contractId);
    deleteDoc(contractDoc).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: contractDoc.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [contractsCollectionRef]);

  const addBill = useCallback(async (contractId: string, billData: Omit<Bill, 'id'>) => {
    if (!contractsCollectionRef || !firestore) return;
    const contractDocRef = doc(contractsCollectionRef, contractId);
    const originalContract = contracts.find(c => c.id === contractId);
    if (!originalContract) return;

    const newBill: Bill = { ...billData, id: doc(collection(firestore, '_')).id };

    const updatedBills = [...(originalContract.bills || []), newBill];
    const newRealization = updatedBills.reduce((sum, b) => sum + b.amount, 0);
    const newRemainingValue = originalContract.value - newRealization;

    const dataToUpdate = {
        bills: updatedBills.map(removeUndefinedProps),
        realization: newRealization,
        remainingValue: newRemainingValue,
        updatedAt: serverTimestamp(),
    };

    const cleanedData = removeUndefinedProps(dataToUpdate);

    updateDoc(contractDocRef, cleanedData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: contractDocRef.path,
            operation: 'update',
            requestResourceData: cleanedData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }, [contractsCollectionRef, contracts, firestore]);

  const updateBill = useCallback(async (contractId: string, billId: string, updatedBillData: Omit<Bill, 'id'>) => {
     if (!contractsCollectionRef) return;
    const contractDocRef = doc(contractsCollectionRef, contractId);
    const originalContract = contracts.find(c => c.id === contractId);
    if (!originalContract) return;

    const updatedBills = originalContract.bills.map(bill => 
      bill.id === billId ? { id: bill.id, ...updatedBillData } : bill
    );

    const newRealization = updatedBills.reduce((sum, b) => sum + b.amount, 0);
    const newRemainingValue = originalContract.value - newRealization;
    
    const dataToUpdate = {
        bills: updatedBills.map(removeUndefinedProps),
        realization: newRealization,
        remainingValue: newRemainingValue,
        updatedAt: serverTimestamp(),
    };

    const cleanedData = removeUndefinedProps(dataToUpdate);

    updateDoc(contractDocRef, cleanedData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: contractDocRef.path,
            operation: 'update',
            requestResourceData: cleanedData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }, [contractsCollectionRef, contracts]);

  const deleteBill = useCallback(async (contractId: string, billId: string) => {
    if (!contractsCollectionRef) return;
    const contractDocRef = doc(contractsCollectionRef, contractId);
    const originalContract = contracts.find(c => c.id === contractId);
    if (!originalContract) return;
    
    const updatedBills = originalContract.bills.filter(bill => bill.id !== billId);
    const newRealization = updatedBills.reduce((sum, b) => sum + b.amount, 0);
    const newRemainingValue = originalContract.value - newRealization;

     const dataToUpdate = {
        bills: updatedBills,
        realization: newRealization,
        remainingValue: newRemainingValue,
        updatedAt: serverTimestamp(),
    };

    const cleanedData = removeUndefinedProps(dataToUpdate);

    updateDoc(contractDocRef, cleanedData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: contractDocRef.path,
            operation: 'update',
            requestResourceData: cleanedData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }, [contractsCollectionRef, contracts]);

  const getContractById = useCallback((contractId: string) => {
    return contracts.find((c) => c.id === contractId);
  }, [contracts]);

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

export function ContractProvider({ children, value }: ContractProviderProps) {
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}
