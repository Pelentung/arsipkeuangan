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

interface DeleteContractDialogProps {
  contractId: string;
}

export function DeleteContractDialog({
  contractId,
}: DeleteContractDialogProps) {
  const { deleteContract } = useContractContext();
  const { toast } = useToast();
  const { user } = useUser();

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
     if (!user) {
      toast({
        title: 'Akses Ditolak',
        description: 'Anda harus login untuk menghapus data.',
        variant: 'destructive',
      });
      return;
    }
    deleteContract(contractId);
    toast({
      title: 'Sukses',
      description: 'Kontrak berhasil dihapus.',
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Hapus Kontrak
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus kontrak
            secara permanen dari database.
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
