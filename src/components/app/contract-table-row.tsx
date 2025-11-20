'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { useState } from 'react';
import BillTableRow from './bill-table-row';

interface ContractTableRowProps {
  contract: Contract;
}

export default function ContractTableRow({ contract }: ContractTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contractDate = new Date(contract.contractDate);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <Collapsible asChild>
      <>
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
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className='h-8 w-8 p-0'>
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span className="sr-only">Lihat Tagihan</span>
                </Button>
              </CollapsibleTrigger>
              <AddBillDialog
                contractId={contract.id}
                userId={contract.userId}
              />
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
                    <Link href={`/ubah-kontrak/${contract.id}`}>Ubah Kontrak</Link>
                  </DropdownMenuItem>
                  <DeleteContractDialog contractId={contract.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>
        </TableRow>
        <CollapsibleContent asChild>
          <TableRow>
            <TableCell colSpan={7} className="p-0">
              <div className="p-4 bg-muted/50">
                <h4 className="font-semibold mb-2">Detail Tagihan</h4>
                {contract.bills && contract.bills.length > 0 ? (
                  <div className='rounded-md border bg-card'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No. SPM</TableHead>
                          <TableHead>No. SP2D</TableHead>
                          <TableHead>Uraian</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Jumlah</TableHead>
                          <TableHead className="text-center w-[120px]">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contract.bills.map((bill) => (
                          <BillTableRow key={bill.id} bill={bill} contractId={contract.id} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada tagihan untuk kontrak ini.
                  </p>
                )}
              </div>
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  );
}
