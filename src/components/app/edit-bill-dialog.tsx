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
import { Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useContractContext } from '@/contexts/contract-context';
import type { Bill } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { format } from 'date-fns';
import { useUser } from '@/firebase';

interface EditBillDialogProps {
  contractId: string;
  bill: Bill;
  isMenuItem?: boolean;
}

export function EditBillDialog({ contractId, bill, isMenuItem = false }: EditBillDialogProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { updateBill } = useContractContext();
  const { user } = useUser();
  const [status, setStatus] = useState<string | undefined>(bill.status);

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    if (!formData.get('spmNumber')) newErrors.spmNumber = 'Nomor SPM wajib diisi.';
    if (!formData.get('spmDate')) newErrors.spmDate = 'Tanggal SPM wajib diisi.';
    if (!formData.get('description')) newErrors.description = 'Uraian wajib diisi.';
    if (Number(formData.get('amount')) <= 0) newErrors.amount = 'Jumlah harus lebih dari 0.';
    if (!status) newErrors.status = 'Status wajib dipilih.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
        toast({ title: 'Akses Ditolak', description: 'Anda harus login untuk mengubah data.', variant: 'destructive'});
        return;
    }

    const formData = new FormData(event.currentTarget);

    if (!validateForm(formData)) {
      toast({
        title: 'Kesalahan Validasi',
        description: 'Silakan periksa kembali isian Anda.',
        variant: 'destructive',
      });
      return;
    }

    const updatedBill: Omit<Bill, 'id'> = {
        spmNumber: formData.get('spmNumber') as string,
        spmDate: formData.get('spmDate') as string,
        sp2dNumber: (formData.get('sp2dNumber') as string) || undefined,
        sp2dDate: (formData.get('sp2dDate') as string) || undefined,
        description: formData.get('description') as string,
        amount: Number(formData.get('amount')),
        status: status as Bill['status'],
    };
    
    updateBill(contractId, bill.id, updatedBill);
    toast({
        title: 'Sukses',
        description: 'Tagihan berhasil diperbarui.',
    });
    setOpen(false);
  };

  const TriggerComponent = isMenuItem ? DropdownMenuItem : Button;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            setErrors({});
            setStatus(bill.status);
        }
    }}>
      <DialogTrigger asChild>
        <TriggerComponent 
            {...(isMenuItem 
                ? { onSelect: (e) => e.preventDefault() } 
                : { variant: "ghost", size: "icon", className: "h-8 w-8 p-0" })}
        >
          <Edit className={cn("h-4 w-4", isMenuItem && "mr-2")} />
          {isMenuItem ? 'Ubah Tagihan' : <span className="sr-only">Ubah Tagihan</span>}
        </TriggerComponent>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah Tagihan</DialogTitle>
          <DialogDescription>
            Perbarui detail tagihan di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
          <div className="grid gap-2">
            <Label htmlFor="spmNumber">Nomor SPM</Label>
            <Input id="spmNumber" name="spmNumber" defaultValue={bill.spmNumber} />
            {errors.spmNumber && <p className="text-sm font-medium text-destructive">{errors.spmNumber}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="spmDate">Tanggal SPM</Label>
            <Input id="spmDate" name="spmDate" type="date" defaultValue={formatDateForInput(bill.spmDate)} />
             {errors.spmDate && <p className="text-sm font-medium text-destructive">{errors.spmDate}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sp2dNumber">Nomor SP2D (Opsional)</Label>
            <Input id="sp2dNumber" name="sp2dNumber" defaultValue={bill.sp2dNumber} />
            {errors.sp2dNumber && <p className="text-sm font-medium text-destructive">{errors.sp2dNumber}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sp2dDate">Tanggal SP2D (Opsional)</Label>
            <Input id="sp2dDate" name="sp2dDate" type="date" defaultValue={formatDateForInput(bill.sp2dDate)} />
             {errors.sp2dDate && <p className="text-sm font-medium text-destructive">{errors.sp2dDate}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Uraian</Label>
            <Textarea id="description" name="description" placeholder="Cth: Pembayaran termin 1" defaultValue={bill.description} />
            {errors.description && <p className="text-sm font-medium text-destructive">{errors.description}</p>}
          </div>
           <div className="grid gap-2">
            <Label htmlFor="amount">Jumlah (Rp)</Label>
            <Input id="amount" name="amount" type="number" placeholder="0" defaultValue={bill.amount} />
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
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
