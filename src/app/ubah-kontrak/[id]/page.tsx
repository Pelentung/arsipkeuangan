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
  const { user, isUserLoading } = useUser();
  const { getContractById, loading: contractsLoading } = useContractContext();
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (contractsLoading) return; // Wait until data is loaded
    const contractId = Array.isArray(id) ? id[0] : id;
    const foundContract = getContractById(contractId);

    if (foundContract) {
      setContract(foundContract);
    } else {
      // If contract not found (maybe due to permissions or it doesn't exist), redirect
      router.push('/dashboard');
    }
  }, [id, getContractById, contractsLoading, router]);

  if (isUserLoading || contractsLoading || !user || !contract) {
    return <p>Memuat data kontrak...</p>;
  }

  return (
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
  );
}
