'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { useActionState, useEffect, useRef, useState } from 'react';
import { addBill, type BillState } from '@/app/actions';
import { useFormStatus } from 'react-dom';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Simpan Tagihan
    </Button>
  );
}

interface AddBillDialogProps {
  contractId: string;
  userId: string;
}

export function AddBillDialog({ contractId, userId }: AddBillDialogProps) {
  const [open, setOpen] = useState(false);
  const initialState: BillState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(addBill, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
        if (state.errors && Object.keys(state.errors).length > 0) {
            toast({
                title: 'Kesalahan',
                description: state.message,
                variant: 'destructive',
            });
        } else {
             toast({
                title: 'Sukses',
                description: state.message,
            });
            formRef.current?.reset();
            setOpen(false); // Close dialog on success
        }
    }
  }, [state, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className='w-full'>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Tagihan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Tagihan Baru</DialogTitle>
          <DialogDescription>
            Masukkan detail tagihan untuk memperbarui realisasi kontrak.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={dispatch} className="grid gap-4 py-4">
          <input type="hidden" name="contractId" value={contractId} />
          <input type="hidden" name="userId" value={userId} />

          <div className="grid gap-2">
            <Label htmlFor="amount">Jumlah Tagihan (Rp)</Label>
            <Input id="amount" name="amount" type="number" placeholder="0" />
            {state?.errors?.amount && <p className="text-sm font-medium text-destructive">{state.errors.amount[0]}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="billDate">Tanggal Tagihan</Label>
            <Input id="billDate" name="billDate" type="date" />
            {state?.errors?.billDate && <p className="text-sm font-medium text-destructive">{state.errors.billDate[0]}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" name="description" placeholder="Cth: Pembayaran termin 1" />
            {state?.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
