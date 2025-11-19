'use server';

import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getFirestoreAdmin } from '@/firebase/server-init';

const FormSchema = z.object({
  contractNumber: z.string().min(1, 'Nomor kontrak wajib diisi.'),
  contractDate: z.string().min(1, 'Tanggal kontrak wajib diisi.'),
  addendumNumber: z.string().optional(),
  addendumDate: z.string().optional(),
  description: z.string().min(1, 'Uraian wajib diisi.'),
  implementer: z.string().min(1, 'Pelaksana wajib diisi.'),
  value: z.coerce.number().min(0, 'Nilai harus angka positif.'),
  realization: z.coerce.number().min(0, 'Realisasi harus angka positif.'),
  remainingValue: z.coerce.number(),
  userId: z.string().min(1, 'ID Pengguna wajib diisi.'),
});

export type State = {
  errors?: {
    contractNumber?: string[];
    contractDate?: string[];
    description?: string[];
    implementer?: string[];
    value?: string[];
    realization?: string[];
    userId?: string[];
    server?: string[];
  };
  message?: string | null;
};

export async function addContract(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    contractNumber: formData.get('contractNumber'),
    contractDate: formData.get('contractDate'),
    addendumNumber: formData.get('addendumNumber'),
    addendumDate: formData.get('addendumDate'),
    description: formData.get('description'),
    implementer: formData.get('implementer'),
    value: formData.get('value'),
    realization: formData.get('realization'),
    remainingValue: formData.get('remainingValueNumeric'),
    userId: formData.get('userId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Gagal menambahkan kontrak. Silakan periksa kembali isian Anda.',
    };
  }

  const {
    userId,
    contractNumber,
    contractDate,
    addendumNumber,
    addendumDate,
    description,
    implementer,
    value,
    realization,
    remainingValue,
   } = validatedFields.data;
  const { firestore } = getFirestoreAdmin();

  try {
    const newContract: any = {
      userId,
      contractNumber,
      contractDate: Timestamp.fromDate(new Date(contractDate)),
      description,
      implementer,
      value,
      realization,
      remainingValue,
    };

    if (addendumNumber) newContract.addendumNumber = addendumNumber;
    if (addendumDate) newContract.addendumDate = Timestamp.fromDate(new Date(addendumDate));

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
