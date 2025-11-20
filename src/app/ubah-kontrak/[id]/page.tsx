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
import { useUser } from '@/firebase';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Contract } from '@/lib/types';

export default function UbahKontrakPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { getContractById, loading: contractsLoading } = useContractContext();
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (contractsLoading || !user) return; // Wait until data is loaded
    const contractId = Array.isArray(id) ? id[0] : id;
    const foundContract = getContractById(contractId);

    if (foundContract) {
      // Security check: ensure user owns the contract
      if (foundContract.userId === user.uid) {
        setContract(foundContract);
      } else {
        router.push('/'); // Redirect if not owner
      }
    } else {
      router.push('/');
    }
  }, [id, getContractById, contractsLoading, router, user, userLoading]);

  if (userLoading || contractsLoading || !contract) {
    return <p>Memuat data kontrak...</p>;
  }

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
          <EditContractForm contract={contract} />
        </CardContent>
      </Card>
    </main>
  );
}
