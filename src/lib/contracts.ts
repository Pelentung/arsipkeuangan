'use server';

import { getFirestoreAdmin } from '@/firebase/server-init';
import type { Contract } from './types';
import type { Timestamp } from 'firebase-admin/firestore';

export async function getContracts(userId: string): Promise<Contract[]> {
  if (!userId) {
    return [];
  }
  
  const { firestore } = getFirestoreAdmin();
  const contractsCol = firestore.collection(`users/${userId}/contracts`);
  const q = contractsCol.orderBy('contractDate', 'desc');

  try {
    const contractSnapshot = await q.get();
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
    return [];
  }
}
