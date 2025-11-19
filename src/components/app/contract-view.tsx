'use client';

import type { Contract } from '@/lib/types';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { AddContractDialog } from '@/components/app/add-contract-dialog';
import { ContractCard } from '@/components/app/contract-card';
import { Skeleton } from '../ui/skeleton';
import { Search } from 'lucide-react';
import { useUser } from '@/firebase';

interface ContractViewProps {
  initialContracts: Contract[];
}

export function ContractView({ initialContracts }: ContractViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser();

  const filteredContracts = useMemo(() => {
    if (!searchTerm) return initialContracts;
    return initialContracts.filter(
      (contract) =>
        contract.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.partiesInvolved.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contract.summary && contract.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [initialContracts, searchTerm]);

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground">
            Manage and review all your contracts in one place.
          </p>
        </div>
        <AddContractDialog />
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, parties, or summary..."
          className="w-full max-w-sm pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredContracts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredContracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center flex-1 rounded-lg border border-dashed shadow-sm py-12">
          <h3 className="text-2xl font-bold tracking-tight">No contracts found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? 'Try a different search term or ' : 'Get started by '}
            <AddContractDialog>
                <span className="text-primary hover:underline cursor-pointer">adding a new contract</span>
            </AddContractDialog>
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
        <header className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </header>

        <div className="mb-6">
            <Skeleton className="h-10 w-full max-w-sm" />
        </div>

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
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}
