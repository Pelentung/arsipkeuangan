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
  const q = query(contractsCol, orderBy('expirationDate', 'asc'));

  try {
    const contractSnapshot = await getDocs(q);
    const contractList = contractSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        documentName: data.documentName,
        partiesInvolved: data.partiesInvolved,
        effectiveDate: data.effectiveDate.toDate().toISOString(),
        expirationDate: data.expirationDate.toDate().toISOString(),
        terms: data.terms,
        documentUrl: data.documentUrl,
        summary: data.summary,
      } as Contract;
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
