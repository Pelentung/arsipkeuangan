'use server';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Contract } from './types';

export async function getContracts(): Promise<Contract[]> {
  try {
    const contractsCol = collection(db, 'contracts');
    const q = query(contractsCol, orderBy('endDate', 'asc'));
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
    console.error('Error fetching contracts: ', error);
    // In a real app, you'd want more robust error handling
    return [];
  }
}
