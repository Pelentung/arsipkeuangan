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
import { useToast } from '@/hooks/use-toast';

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

  const handleDelete = () => {
    deleteBill(contractId, billId);
    toast({
      title: 'Sukses',
      description: 'Tagihan berhasil dihapus.',
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
