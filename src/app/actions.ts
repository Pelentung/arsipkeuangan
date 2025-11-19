'use server';

import { summarizeContract } from '@/ai/flows/summarize-contract';
import { db } from '@/lib/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const FormSchema = z
  .object({
    title: z.string().min(1, 'Title is required.'),
    parties: z.string().min(1, 'At least one party is required.'),
    startDate: z.string().min(1, 'Start date is required.'),
    endDate: z.string().min(1, 'End date is required.'),
    content: z.string().min(50, 'Contract content must be at least 50 characters.'),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: 'End date must be after start date.',
    path: ['endDate'],
  });

export type State = {
  errors?: {
    title?: string[];
    parties?: string[];
    startDate?: string[];
    endDate?: string[];
    content?: string[];
    server?: string[];
  };
  message?: string | null;
};

export async function addContract(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    title: formData.get('title'),
    parties: formData.get('parties'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to add contract. Please check the fields.',
    };
  }

  const { title, parties, startDate, endDate, content } = validatedFields.data;

  try {
    const summaryResult = await summarizeContract({ contractText: content });
    
    if (!summaryResult.summary) {
        throw new Error("AI summarization failed.");
    }

    const newContract = {
      title,
      parties: parties.split(',').map((p) => p.trim()),
      startDate: Timestamp.fromDate(new Date(startDate)),
      endDate: Timestamp.fromDate(new Date(endDate)),
      content,
      summary: summaryResult.summary,
      createdAt: Timestamp.now(),
    };

    await addDoc(collection(db, 'contracts'), newContract);
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
