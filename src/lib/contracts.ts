'use server';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Contract } from './types';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

export async function getContracts(): Promise<Contract[]> {
  const contractsCol = collection(db, 'contracts');
  const q = query(contractsCol, orderBy('endDate', 'asc'));

  try {
    const contractSnapshot = await getDocs(q);
    const contractList = contractSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        parties: data.parties,
        startDate: data.startDate.toDate().toISOString(),
        endDate: data.endDate.toDate().toISOString(),
        content: data.content,
        summary: data.summary,
        createdAt: data.createdAt.toDate().toISOString(),
      } as Contract;
    });
    return contractList;
  } catch (error) {
    const permissionError = new FirestorePermissionError({
        path: contractsCol.path,
        operation: 'list',
    });
    errorEmitter.emit('permission-error', permissionError);
    // Return empty array on error to prevent app crash
    return [];
  }
}
