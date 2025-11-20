'use client';

import { EditContractForm } from '@/components/app/edit-contract-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useContractContext } from '@/contexts/contract-context';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Contract } from '@/lib/types';

export default function UbahKontrakPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getContractById, loading } = useContractContext();
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (loading) return; // Wait until data is loaded
    const contractId = Array.isArray(id) ? id[0] : id;
    const foundContract = getContractById(contractId);

    if (foundContract) {
      setContract(foundContract);
    } else {
      // Handle case where contract is not found, maybe redirect
      router.push('/');
    }
  }, [id, getContractById, loading, router]);

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Ubah Data Keuangan</CardTitle>
          <CardDescription>
            Perbarui detail di bawah ini untuk mengubah data yang sudah ada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contract ? (
            <EditContractForm contract={contract} />
          ) : (
            <p>Memuat data kontrak...</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
