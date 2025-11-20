'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useContractContext } from '@/contexts/contract-context';

export function AddContractForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const { addContract } = useContractContext();

  const [value, setValue] = useState(0);
  const [realization, setRealization] = useState(0);
  const remainingValue = value - realization;
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };
  
  const validateForm = (formData: FormData) => {
      const newErrors: Record<string, string> = {};
      if (!formData.get('contractNumber')) newErrors.contractNumber = 'Nomor kontrak wajib diisi.';
      if (!formData.get('contractDate')) newErrors.contractDate = 'Tanggal kontrak wajib diisi.';
      if (!formData.get('description')) newErrors.description = 'Uraian wajib diisi.';
      if (!formData.get('implementer')) newErrors.implementer = 'Pelaksana wajib diisi.';
      if (Number(formData.get('value')) <= 0) newErrors.value = 'Nilai harus lebih dari 0.';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      
      if (!validateForm(formData)) {
          toast({
              title: 'Kesalahan Validasi',
              description: 'Silakan periksa kembali isian Anda.',
              variant: 'destructive'
          });
          return;
      }
      
      const newContract = {
          contractNumber: formData.get('contractNumber') as string,
          contractDate: formData.get('contractDate') as string,
          addendumNumber: formData.get('addendumNumber') as string || undefined,
          addendumDate: formData.get('addendumDate') as string || undefined,
          description: formData.get('description') as string,
          implementer: formData.get('implementer') as string,
          value: Number(formData.get('value')),
          realization: Number(formData.get('realization')) || 0,
          userId: 'local-user', // Placeholder for local storage
      };

      addContract(newContract);
      toast({
          title: 'Sukses',
          description: 'Berhasil menambahkan kontrak.'
      });
      formRef.current?.reset();
      router.push('/');
  }


  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
            <Label htmlFor="contractNumber">Nomor Kontrak</Label>
            <Input id="contractNumber" name="contractNumber" />
            {errors.contractNumber && <p className="text-sm font-medium text-destructive mt-1">{errors.contractNumber}</p>}
        </div>
        <div className="grid gap-2">
            <Label htmlFor="contractDate">Tanggal Kontrak</Label>
            <Input id="contractDate" name="contractDate" type="date" />
            {errors.contractDate && <p className="text-sm font-medium text-destructive mt-1">{errors.contractDate}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
            <Label htmlFor="addendumNumber">Nomor Addendum</Label>
            <Input id="addendumNumber" name="addendumNumber" placeholder="Opsional" />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="addendumDate">Tanggal Addendum</Label>
            <Input id="addendumDate" name="addendumDate" type="date" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Uraian</Label>
        <Textarea id="description" name="description" />
        {errors.description && <p className="text-sm font-medium text-destructive mt-1">{errors.description}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="implementer">Pelaksana</Label>
        <Input id="implementer" name="implementer" />
        {errors.implementer && <p className="text-sm font-medium text-destructive mt-1">{errors.implementer}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="grid gap-2">
            <Label htmlFor="value">Nilai (Rp)</Label>
            <Input 
              id="value" 
              name="value" 
              type="number" 
              placeholder="0"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
            {errors.value && <p className="text-sm font-medium text-destructive mt-1">{errors.value}</p>}
        </div>
        <div className="grid gap-2">
            <Label htmlFor="realization">Realisasi (Rp)</Label>
            <Input 
              id="realization" 
              name="realization" 
              type="number" 
              placeholder="0"
              value={realization}
              onChange={(e) => setRealization(Number(e.target.value))}
            />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="remainingValue">Sisa Kontrak (Rp)</Label>
            <Input id="remainingValue" name="remainingValue" type="text" readOnly value={formatCurrency(remainingValue)} className="bg-muted" />
        </div>
      </div>
       
      <div>
        <Button type="submit" className="w-full">
            Simpan
        </Button>
      </div>
    </form>
  );
}
