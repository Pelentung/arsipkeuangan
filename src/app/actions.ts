'use server';

import { summarizeContract } from '@/ai/flows/summarize-contract';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getFirestoreAdmin } from '@/firebase/server-init';

const FormSchema = z
  .object({
    documentName: z.string().min(1, 'Judul wajib diisi.'),
    partiesInvolved: z.string().min(1, 'Setidaknya satu pihak wajib diisi.'),
    effectiveDate: z.string().min(1, 'Tanggal mulai wajib diisi.'),
    expirationDate: z.string().min(1, 'Tanggal berakhir wajib diisi.'),
    terms: z.string().min(50, 'Konten kontrak harus minimal 50 karakter.'),
    userId: z.string().min(1, 'ID Pengguna wajib diisi.'),
  })
  .refine((data) => new Date(data.effectiveDate) < new Date(data.expirationDate), {
    message: 'Tanggal berakhir harus setelah tanggal mulai.',
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
      message: 'Gagal menambahkan kontrak. Silakan periksa kembali isian Anda.',
    };
  }

  const { documentName, partiesInvolved, effectiveDate, expirationDate, terms, userId } = validatedFields.data;
  const { firestore } = getFirestoreAdmin();

  try {
    const summaryResult = await summarizeContract({ contractText: terms });
    
    if (!summaryResult.summary) {
        throw new Error("Gagal melakukan ringkasan AI.");
    }

    const newContract = {
      documentName,
      partiesInvolved: partiesInvolved.split(',').map((p) => p.trim()),
      effectiveDate: Timestamp.fromDate(new Date(effectiveDate)),
      expirationDate: Timestamp.fromDate(new Date(expirationDate)),
      terms,
      summary: summaryResult.summary,
      userId,
      documentUrl: '', // Tambahkan placeholder untuk documentUrl
    };

    const contractsColRef = collection(firestore, 'users', userId, 'contracts');
    await addDocumentNonBlocking(contractsColRef, newContract);

  } catch (error) {
    console.error(error);
    return {
      errors: { server: ['Terjadi kesalahan tak terduga. Tidak dapat menyimpan kontrak.'] },
      message: 'Kesalahan Database: Gagal Menambahkan Kontrak.',
    };
  }

  revalidatePath('/');
  return { message: 'Berhasil menambahkan kontrak.' };
}
