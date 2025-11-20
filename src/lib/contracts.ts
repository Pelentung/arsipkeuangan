'use server';

import { getAuthedFirebase } from '@/firebase/server-init';
import type { Contract } from './types';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';


export async function getContracts(userId: string): Promise<Contract[]> {
  if (!userId) {
    return [];
  }
  
  try {
    const { firestore } = await getAuthedFirebase();
    const contractsColRef = collection(firestore, `users/${userId}/contracts`);
    const q = query(contractsColRef, orderBy('contractDate', 'desc'));

    const contractSnapshot = await getDocs(q);
    if (contractSnapshot.empty) {
      return [];
    }

    const contractList = contractSnapshot.docs.map((doc) => {
      const data = doc.data();
      const contract: Contract = {
        id: doc.id,
        userId: data.userId,
        contractNumber: data.contractNumber,
        contractDate: (data.contractDate as Timestamp).toDate().toISOString(),
        description: data.description,
        implementer: data.implementer,
        value: data.value,
        realization: data.realization,
        remainingValue: data.remainingValue,
      };
      if (data.addendumNumber) contract.addendumNumber = data.addendumNumber;
      if (data.addendumDate) contract.addendumDate = (data.addendumDate as Timestamp).toDate().toISOString();
      return contract;
    });
    return contractList;
  } catch (error) {
    console.error(`Error fetching contracts for user ${userId}:`, error);
    // In case of error (e.g., permissions), return an empty array
    // to prevent the page from crashing.
    return [];
  }
}
