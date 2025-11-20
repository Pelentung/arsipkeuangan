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
import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddBillDialogProps {
  contractId: string;
  userId: string;
  onAddBill: (contractId: string, bill: { amount: number, billDate: string, description: string }) => void;
}

export function AddBillDialog({ contractId, userId, onAddBill }: AddBillDialogProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    if (Number(formData.get('amount')) <= 0) newErrors.amount = 'Jumlah tagihan harus lebih dari 0.';
    if (!formData.get('billDate')) newErrors.billDate = 'Tanggal tagihan wajib diisi.';
    if (!formData.get('description')) newErrors.description = 'Deskripsi tagihan wajib diisi.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!validateForm(formData)) {
      toast({
        title: 'Kesalahan Validasi',
        description: 'Silakan periksa kembali isian Anda.',
        variant: 'destructive',
      });
      return;
    }

    const newBill = {
        amount: Number(formData.get('amount')),
        billDate: formData.get('billDate') as string,
        description: formData.get('description') as string,
    };
    
    // The global function is attached to 'window' in page.tsx
    if (typeof (window as any).addBill === 'function') {
        (window as any).addBill(contractId, newBill);
        toast({
            title: 'Sukses',
            description: 'Tagihan berhasil ditambahkan.',
        });
        formRef.current?.reset();
        setOpen(false);
    } else {
        toast({
            title: 'Kesalahan',
            description: 'Fungsi untuk menyimpan tagihan tidak ditemukan.',
            variant: 'destructive'
        });
    }
  };

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
        <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Jumlah Tagihan (Rp)</Label>
            <Input id="amount" name="amount" type="number" placeholder="0" />
            {errors.amount && <p className="text-sm font-medium text-destructive">{errors.amount}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="billDate">Tanggal Tagihan</Label>
            <Input id="billDate" name="billDate" type="date" />
             {errors.billDate && <p className="text-sm font-medium text-destructive">{errors.billDate}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" name="description" placeholder="Cth: Pembayaran termin 1" />
            {errors.description && <p className="text-sm font-medium text-destructive">{errors.description}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
            <Button type="submit">Simpan Tagihan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
