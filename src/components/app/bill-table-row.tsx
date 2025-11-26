'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import type { Bill } from '@/lib/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '../ui/dropdown-menu';
import { DeleteBillDialog } from './delete-bill-dialog';
import { EditBillDialog } from './edit-bill-dialog';
import { useUser } from '@/firebase';

interface BillTableRowProps {
    bill: Bill;
    contractId: string;
    readOnly?: boolean;
}

export default function BillTableRow({ bill, contractId, readOnly = false }: BillTableRowProps) {
    const { user } = useUser();
    const spmDate = bill.spmDate ? new Date(bill.spmDate) : null;
    const sp2dDate = bill.sp2dDate ? new Date(bill.sp2dDate) : null;
    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(num);
      };
      
    return (
        <TableRow>
            <TableCell>
                <div className="font-medium">{bill.spmNumber}</div>
                <div className="text-xs text-muted-foreground">
                    {spmDate ? format(spmDate, 'd MMM yyyy', { locale: id }) : '-'}
                </div>
            </TableCell>
            <TableCell>
                 <div className="font-medium">{bill.sp2dNumber || '-'}</div>
                <div className="text-xs text-muted-foreground">
                    {sp2dDate ? format(sp2dDate, 'd MMM yyyy', { locale: id }) : '-'}
                </div>
            </TableCell>
            <TableCell>
                <p>{bill.description}</p>
            </TableCell>
            <TableCell>{bill.status}</TableCell>
            <TableCell className="text-right font-medium">
                {formatCurrency(bill.amount)}
            </TableCell>
            {!readOnly && (
                <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                        <EditBillDialog contractId={contractId} bill={bill} />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aksi Tagihan</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <EditBillDialog contractId={contractId} bill={bill} isMenuItem />
                                <DeleteBillDialog contractId={contractId} billId={bill.id} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TableCell>
            )}
        </TableRow>
    );
}
