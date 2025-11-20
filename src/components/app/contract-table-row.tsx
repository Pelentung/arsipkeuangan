'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import type { Contract } from '@/lib/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AddBillDialog } from './add-bill-dialog';
import { MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DeleteContractDialog } from './delete-contract-dialog';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';

interface ContractTableRowProps {
  contract: Contract;
  isOpen: boolean;
}

export default function ContractTableRow({
  contract,
  isOpen,
}: ContractTableRowProps) {
  const contractDate = new Date(contract.contractDate);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <TableRow className="bg-card hover:bg-card/90">
      <TableCell>
        <div className="font-medium">{contract.contractNumber}</div>
        <div className="text-xs text-muted-foreground">
          {format(contractDate, 'd MMM yyyy', { locale: id })}
        </div>
      </TableCell>
      <TableCell>{contract.implementer}</TableCell>
      <TableCell>
        <p className="max-w-xs truncate">{contract.description}</p>
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(contract.value)}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(contract.realization)}
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(contract.remainingValue)}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Lihat Tagihan</span>
            </Button>
          </CollapsibleTrigger>
          <AddBillDialog contractId={contract.id} userId={contract.userId} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi Kontrak</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/ubah-kontrak/${contract.id}`}>
                  Ubah Kontrak
                </Link>
              </DropdownMenuItem>
              <DeleteContractDialog contractId={contract.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
