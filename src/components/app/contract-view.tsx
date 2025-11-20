'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '../ui/skeleton';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useContractContext } from '@/contexts/contract-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ContractTableRow from './contract-table-row';

export function ContractView() {
  const [searchTerm, setSearchTerm] = useState('');
  const { contracts, loading } = useContractContext();
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredContracts = useMemo(() => {
    if (!contracts) return [];
    if (!searchTerm) return contracts;
    return contracts.filter(
      (contract) =>
        contract.contractNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contract.implementer
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
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
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nomor Kontrak & Addendum</TableHead>
                <TableHead>Pelaksana</TableHead>
                <TableHead>Uraian</TableHead>
                <TableHead className="text-right">Nilai</TableHead>
                <TableHead className="text-right">Realisasi</TableHead>
                <TableHead className="text-right">Sisa</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center w-[150px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract, index) => (
                <ContractTableRow
                    key={contract.id}
                    contract={contract}
                    isOpen={openStates[contract.id] || false}
                    onToggle={() => toggleRow(contract.id)}
                    isEven={index % 2 === 0}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center flex-1 rounded-lg border border-dashed shadow-sm py-12">
          <h3 className="text-2xl font-bold tracking-tight">
            Tidak ada data yang ditemukan
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm
              ? 'Coba kata kunci pencarian lain atau '
              : 'Mulai dengan '}
            <Link href="/tambah-kontrak">
              <span className="text-primary hover:underline cursor-pointer">
                menambahkan data baru
              </span>
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
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
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

      <div className="rounded-lg border">
        <div className="p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
