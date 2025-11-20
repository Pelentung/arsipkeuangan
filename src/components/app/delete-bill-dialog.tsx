'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useContractContext } from '@/contexts/contract-context';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

interface DeleteBillDialogProps {
  contractId: string;
  billId: string;
}

export function DeleteBillDialog({
  contractId,
  billId,
}: DeleteBillDialogProps) {
  const { deleteBill } = useContractContext();
  const { toast } = useToast();
  const { user } = useUser();

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (user?.isAnonymous) {
      toast({
        title: 'Akses Ditolak',
        description: 'Mode tamu tidak dapat menghapus data.',
        variant: 'destructive',
      });
      return;
    }
    deleteBill(contractId, billId);
    toast({
      title: 'Sukses',
      description: 'Tagihan berhasil dihapus.',
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={user?.isAnonymous}>
          Hapus Tagihan
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus tagihan
            secara permanen dan memperbarui nilai realisasi kontrak.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
