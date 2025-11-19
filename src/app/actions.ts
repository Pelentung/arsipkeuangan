'use server';

import { summarizeContract } from '@/ai/flows/summarize-contract';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const FormSchema = z
  .object({
    documentName: z.string().min(1, 'Title is required.'),
    partiesInvolved: z.string().min(1, 'At least one party is required.'),
    effectiveDate: z.string().min(1, 'Start date is required.'),
    expirationDate: z.string().min(1, 'End date is required.'),
    terms: z.string().min(50, 'Contract content must be at least 50 characters.'),
    userId: z.string().min(1, 'User ID is required.'),
  })
  .refine((data) => new Date(data.effectiveDate) < new Date(data.expirationDate), {
    message: 'End date must be after start date.',
    path: ['expirationDate'],
  });

export type State = {
  errors?: {
    documentName?: string[];
    partiesInvolved?: string[];
    effectiveDate?: string[];
    expirationDate?: string[];
    terms?: string[];
    userId?: string[];
    server?: string[];
  };
  message?: string | null;
};

export async function addContract(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    documentName: formData.get('title'),
    partiesInvolved: formData.get('parties'),
    effectiveDate: formData.get('startDate'),
    expirationDate: formData.get('endDate'),
    terms: formData.get('content'),
    userId: formData.get('userId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to add contract. Please check the fields.',
    };
  }

  const { documentName, partiesInvolved, effectiveDate, expirationDate, terms, userId } = validatedFields.data;
  const { firestore } = initializeFirebase();

  try {
    const summaryResult = await summarizeContract({ contractText: terms });
    
    if (!summaryResult.summary) {
        throw new Error("AI summarization failed.");
    }

    const newContract = {
      documentName,
      partiesInvolved: partiesInvolved.split(',').map((p) => p.trim()),
      effectiveDate: Timestamp.fromDate(new Date(effectiveDate)),
      expirationDate: Timestamp.fromDate(new Date(expirationDate)),
      terms,
      summary: summaryResult.summary,
      userId,
      documentUrl: '', // Add a placeholder for documentUrl
    };

    const contractsColRef = collection(firestore, 'users', userId, 'contracts');
    await addDocumentNonBlocking(contractsColRef, newContract);

  } catch (error) {
    console.error(error);
    return {
      errors: { server: ['An unexpected error occurred. Could not save contract.'] },
      message: 'Database Error: Failed to Add Contract.',
    };
  }

  revalidatePath('/');
  return { message: 'Successfully added contract.' };
}
