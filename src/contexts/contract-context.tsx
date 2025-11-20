'use client';

import { Contract, Bill } from '@/lib/types';
import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
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

function fromTimestamp(timestamp: Timestamp | Date): string {
    if (!timestamp) return '';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return date.toISOString();
}

export function useContractContextData(): ContractContextType {
  const { user } = useUser();
  const firestore = useFirestore();

  const contractsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    const contractsCollection = collection(firestore, 'contracts');
    return query(contractsCollection, where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: contractsData, isLoading: contractsLoading } = useCollection(contractsQuery, {
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
          sp2dDate: fromTimestamp(bill.sp2dDate),
      })) || [],
    }));
  }, [contractsData]);
  
  const loading = contractsLoading;

  const addContract = useCallback(async (newContractData: Omit<Contract, 'id'| 'realization' | 'remainingValue' | 'bills' | 'userId'>) => {
    if (!firestore || !user) return;
    const contractsCollection = collection(firestore, 'contracts');
    const dataToSave = {
      ...newContractData,
      userId: user.uid,
      realization: 0,
      remainingValue: newContractData.value,
      bills: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    addDoc(contractsCollection, dataToSave).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: contractsCollection.path,
        operation: 'create',
        requestResourceData: dataToSave,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore, user]);


  const updateContract = useCallback(async (contractId: string, updatedData: Partial<Omit<Contract, 'id' | 'userId' | 'bills'>>) => {
    if (!firestore) return;
    const contractDoc = doc(firestore, 'contracts', contractId);
    
    const originalContract = contracts.find(c => c.id === contractId);
    if (!originalContract) return;

    const value = updatedData.value ?? originalContract.value;
    const realization = originalContract.realization;

    const dataToUpdate = {
        ...updatedData,
        remainingValue: value - realization,
        updatedAt: serverTimestamp(),
    };

    updateDoc(contractDoc, dataToUpdate).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: contractDoc.path,
        operation: 'update',
        requestResourceData: dataToUpdate,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore, contracts]);

  const deleteContract = useCallback(async (contractId: string) => {
    if (!firestore) return;
    const contractDoc = doc(firestore, 'contracts', contractId);
    deleteDoc(contractDoc).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: contractDoc.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore]);

  const addBill = useCallback(async (contractId: string, billData: Omit<Bill, 'id'>) => {
    if (!firestore) return;
    const contractDocRef = doc(firestore, 'contracts', contractId);
    const originalContract = contracts.find(c => c.id === contractId);
    if (!originalContract) return;

    const newBill: Bill = { ...billData, id: doc(collection(firestore, 'temp')).id };

    const updatedBills = [...(originalContract.bills || []), newBill];
    const newRealization = updatedBills.reduce((sum, b) => sum + b.amount, 0);
    const newRemainingValue = originalContract.value - newRealization;

    const dataToUpdate = {
        bills: updatedBills,
        realization: newRealization,
        remainingValue: newRemainingValue,
        updatedAt: serverTimestamp(),
    };

    updateDoc(contractDocRef, dataToUpdate).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: contractDocRef.path,
            operation: 'update',
            requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore, contracts]);

  const updateBill = useCallback(async (contractId: string, billId: string, updatedBillData: Omit<Bill, 'id'>) => {
     if (!firestore) return;
    const contractDocRef = doc(firestore, 'contracts', contractId);
    const originalContract = contracts.find(c => c.id === contractId);
    if (!originalContract) return;

    const updatedBills = originalContract.bills.map(bill => 
      bill.id === billId ? { id: bill.id, ...updatedBillData } : bill
    );

    const newRealization = updatedBills.reduce((sum, b) => sum + b.amount, 0);
    const newRemainingValue = originalContract.value - newRealization;
    
    const dataToUpdate = {
        bills: updatedBills,
        realization: newRealization,
        remainingValue: newRemainingValue,
        updatedAt: serverTimestamp(),
    };

    updateDoc(contractDocRef, dataToUpdate).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: contractDocRef.path,
            operation: 'update',
            requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore, contracts]);

  const deleteBill = useCallback(async (contractId: string, billId: string) => {
    if (!firestore) return;
    const contractDocRef = doc(firestore, 'contracts', contractId);
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

    updateDoc(contractDocRef, dataToUpdate).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: contractDocRef.path,
            operation: 'update',
            requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore, contracts]);

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
