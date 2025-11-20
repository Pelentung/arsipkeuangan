'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAuthedFirebase } from '@/firebase/server-init';
import { addDoc, collection, doc, runTransaction, Timestamp } from 'firebase/firestore';

const ContractFormSchema = z.object({
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

const BillFormSchema = z.object({
  amount: z.coerce.number().gt(0, 'Jumlah tagihan harus lebih dari 0.'),
  billDate: z.string().min(1, 'Tanggal tagihan wajib diisi.'),
  description: z.string().min(1, 'Deskripsi tagihan wajib diisi.'),
  userId: z.string().min(1, 'ID Pengguna wajib diisi.'),
  contractId: z.string().min(1, 'ID Kontrak wajib diisi.'),
});


export type ContractState = {
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

export type BillState = {
  errors?: {
    amount?: string[];
    billDate?: string[];
    description?: string[];
    server?: string[];
  };
  message?: string | null;
};

export async function addContract(prevState: ContractState, formData: FormData): Promise<ContractState> {
  const validatedFields = ContractFormSchema.safeParse({
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

  try {
    const { firestore } = await getAuthedFirebase();
    
    const newContract: any = {
        userId,
        contractNumber,
        contractDate: Timestamp.fromDate(new Date(contractDate)),
        description,
        implementer,
        value,
        realization,
        remainingValue,
        createdAt: Timestamp.now(),
      };
    
      if (addendumNumber) newContract.addendumNumber = addendumNumber;
      if (addendumDate && addendumDate.length > 0) newContract.addendumDate = Timestamp.fromDate(new Date(addendumDate));

    const contractsColRef = collection(firestore, `users/${userId}/contracts`);
    await addDoc(contractsColRef, newContract);

  } catch (error: any) {
    console.error("Database Error:", error);
    return {
      errors: { server: ['Gagal menyimpan kontrak ke database.'] },
      message: 'Gagal menambahkan kontrak akibat kesalahan database.',
    };
  }

  revalidatePath('/');
  return { message: 'Berhasil menambahkan kontrak.' };
}

export async function addBill(prevState: BillState, formData: FormData): Promise<BillState> {
  const validatedFields = BillFormSchema.safeParse({
    amount: formData.get('amount'),
    billDate: formData.get('billDate'),
    description: formData.get('description'),
    userId: formData.get('userId'),
    contractId: formData.get('contractId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Gagal menambahkan tagihan.',
    };
  }
  
  const { userId, contractId, amount, billDate, description } = validatedFields.data;
  
  try {
    const { firestore } = await getAuthedFirebase();
    const contractRef = doc(firestore, `users/${userId}/contracts/${contractId}`);
    const billsColRef = collection(contractRef, 'bills');

    await runTransaction(firestore, async (transaction) => {
      const contractDoc = await transaction.get(contractRef);
      if (!contractDoc.exists()) {
        throw new Error("Kontrak tidak ditemukan!");
      }

      const contractData = contractDoc.data();
      if (!contractData) {
        throw new Error("Data kontrak tidak ditemukan!");
      }
      
      const currentRealization = contractData.realization || 0;
      const newRealization = currentRealization + amount;
      const contractValue = contractData.value || 0;
      const newRemainingValue = contractValue - newRealization;

      // Update the contract
      transaction.update(contractRef, {
        realization: newRealization,
        remainingValue: newRemainingValue,
      });

      // Add the new bill
      const newBillRef = doc(billsColRef); // Create a new bill with an auto-generated ID
      transaction.set(newBillRef, {
        amount,
        billDate: Timestamp.fromDate(new Date(billDate)),
        description,
        createdAt: Timestamp.now(),
      });
    });
  } catch (error: any) {
    console.error("Transaction Error:", error);
    const errorMessage = error.message || 'Terjadi kesalahan saat menyimpan tagihan.';
    return {
      errors: { server: [errorMessage] },
      message: `Kesalahan Database: ${errorMessage}`,
    };
  }
  
  revalidatePath('/');
  return { message: 'Tagihan berhasil ditambahkan.' };
}
