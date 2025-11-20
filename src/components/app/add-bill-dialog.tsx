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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useContractContext } from '@/contexts/contract-context';
import type { Bill } from '@/lib/types';

interface AddBillDialogProps {
  contractId: string;
  userId: string;
}

export function AddBillDialog({ contractId, userId }: AddBillDialogProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addBill } = useContractContext();
  const [status, setStatus] = useState<string | undefined>();

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    if (!formData.get('spmNumber')) newErrors.spmNumber = 'Nomor SPM wajib diisi.';
    if (!formData.get('spmDate')) newErrors.spmDate = 'Tanggal SPM wajib diisi.';
    if (!formData.get('sp2dNumber')) newErrors.sp2dNumber = 'Nomor SP2D wajib diisi.';
    if (!formData.get('sp2dDate')) newErrors.sp2dDate = 'Tanggal SP2D wajib diisi.';
    if (!formData.get('description')) newErrors.description = 'Uraian wajib diisi.';
    if (Number(formData.get('amount')) <= 0) newErrors.amount = 'Jumlah harus lebih dari 0.';
    if (!status) newErrors.status = 'Status wajib dipilih.';
    
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

    const newBill: Omit<Bill, 'id'> = {
        spmNumber: formData.get('spmNumber') as string,
        spmDate: formData.get('spmDate') as string,
        sp2dNumber: formData.get('sp2dNumber') as string,
        sp2dDate: formData.get('sp2dDate') as string,
        description: formData.get('description') as string,
        amount: Number(formData.get('amount')),
        status: status as Bill['status'],
    };
    
    addBill(contractId, newBill);
    toast({
        title: 'Sukses',
        description: 'Tagihan berhasil ditambahkan.',
    });
    formRef.current?.reset();
    setStatus(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            setErrors({});
            setStatus(undefined);
        }
    }}>
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
        <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
          <div className="grid gap-2">
            <Label htmlFor="spmNumber">Nomor SPM</Label>
            <Input id="spmNumber" name="spmNumber" />
            {errors.spmNumber && <p className="text-sm font-medium text-destructive">{errors.spmNumber}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="spmDate">Tanggal SPM</Label>
            <Input id="spmDate" name="spmDate" type="date" />
             {errors.spmDate && <p className="text-sm font-medium text-destructive">{errors.spmDate}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sp2dNumber">Nomor SP2D</Label>
            <Input id="sp2dNumber" name="sp2dNumber" />
            {errors.sp2dNumber && <p className="text-sm font-medium text-destructive">{errors.sp2dNumber}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sp2dDate">Tanggal SP2D</Label>
            <Input id="sp2dDate" name="sp2dDate" type="date" />
             {errors.sp2dDate && <p className="text-sm font-medium text-destructive">{errors.sp2dDate}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Uraian</Label>
            <Textarea id="description" name="description" placeholder="Cth: Pembayaran termin 1" />
            {errors.description && <p className="text-sm font-medium text-destructive">{errors.description}</p>}
          </div>
           <div className="grid gap-2">
            <Label htmlFor="amount">Jumlah (Rp)</Label>
            <Input id="amount" name="amount" type="number" placeholder="0" />
            {errors.amount && <p className="text-sm font-medium text-destructive">{errors.amount}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" onValueChange={setStatus} value={status}>
                <SelectTrigger id="status">
                    <SelectValue placeholder="Pilih status pembayaran" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Uang Muka (DP)">Uang Muka (DP)</SelectItem>
                    <SelectItem value="Termin">Termin</SelectItem>
                    <SelectItem value="Termin Terakhir">Termin Terakhir</SelectItem>
                </SelectContent>
            </Select>
            {errors.status && <p className="text-sm font-medium text-destructive">{errors.status}</p>}
          </div>

          <DialogFooter className='mt-4'>
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
