'use server';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getFirestoreAdmin } from '@/firebase/server-init';
import type { Contract } from './types';

export async function getContracts(userId: string): Promise<Contract[]> {
  if (!userId) {
    return [];
  }
  
  const { firestore } = getFirestoreAdmin();
  const contractsCol = collection(firestore, 'users', userId, 'contracts');
  const q = query(contractsCol, orderBy('contractDate', 'desc'));

  try {
    const contractSnapshot = await getDocs(q);
    const contractList = contractSnapshot.docs.map((doc) => {
      const data = doc.data();
      const contract: Contract = {
        id: doc.id,
        userId: data.userId,
        contractNumber: data.contractNumber,
        contractDate: data.contractDate.toDate().toISOString(),
        description: data.description,
        implementer: data.implementer,
        value: data.value,
        realization: data.realization,
        remainingValue: data.remainingValue,
      };
      if (data.addendumNumber) contract.addendumNumber = data.addendumNumber;
      if (data.addendumDate) contract.addendumDate = data.addendumDate.toDate().toISOString();
      return contract;
    });
    return contractList;
  } catch (error) {
    // Log a server-appropriate error.
    // We cannot use the client-side FirestorePermissionError here as this is a server module.
    console.error(`Error fetching contracts for user ${userId}:`, error);
    // Return empty array on error to prevent app crash on render
    return [];
  }
}
