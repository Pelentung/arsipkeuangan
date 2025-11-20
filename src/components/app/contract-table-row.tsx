'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import type { Contract } from '@/lib/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AddBillDialog } from './add-bill-dialog';

interface ContractTableRowProps {
  contract: Contract;
}

export default function ContractTableRow({ contract }: ContractTableRowProps) {
  const contractDate = new Date(contract.contractDate);
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{contract.contractNumber}</div>
        <div className="text-xs text-muted-foreground">{format(contractDate, 'd MMM yyyy', { locale: id })}</div>
      </TableCell>
      <TableCell>{contract.implementer}</TableCell>
      <TableCell>
        <p className="max-w-xs truncate">{contract.description}</p>
      </TableCell>
      <TableCell className="text-right">{formatCurrency(contract.value)}</TableCell>
      <TableCell className="text-right">{formatCurrency(contract.realization)}</TableCell>
      <TableCell className="text-right font-medium">{formatCurrency(contract.remainingValue)}</TableCell>
      <TableCell className="text-center">
        <AddBillDialog contractId={contract.id} userId={contract.userId} />
      </TableCell>
    </TableRow>
  );
}
