'use client';

import type { Contract } from '@/lib/types';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { ContractCard } from '@/components/app/contract-card';
import { Skeleton } from '../ui/skeleton';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useContractContext } from '@/contexts/contract-context';

export function ContractView() {
  const [searchTerm, setSearchTerm] = useState('');
  const { contracts, loading } = useContractContext();

  const filteredContracts = useMemo(() => {
    if (!contracts) return [];
    if (!searchTerm) return contracts;
    return contracts.filter(
      (contract) =>
        contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.implementer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contracts, searchTerm]);

  if (loading) {
    return <ContractViewSkeleton />;
  }

  return (
    <div className="flex flex-col h-full mt-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Semua Data</h2>
          <p className="text-muted-foreground">
            Cari dan kelola semua data keuangan Anda di bawah ini.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nomor, pelaksana, atau uraian..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
       </div>
      </header>

      {filteredContracts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredContracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center flex-1 rounded-lg border border-dashed shadow-sm py-12">
          <h3 className="text-2xl font-bold tracking-tight">Tidak ada data yang ditemukan</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? 'Coba kata kunci pencarian lain atau ' : 'Mulai dengan '}
            <Link href="/tambah-kontrak">
                <span className="text-primary hover:underline cursor-pointer">menambahkan data baru</span>
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}

export function ContractViewSkeleton() {
    return (
      <div className="flex flex-col h-full">
        {/* Dashboard Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_,i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-80 w-full mb-8" />
        
        {/* Contract List Skeleton */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-full max-w-sm" />
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border bg-card text-card-foreground p-4 rounded-lg shadow">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                 <Skeleton className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}
