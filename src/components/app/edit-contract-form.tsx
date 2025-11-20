'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useContractContext } from '@/contexts/contract-context';
import type { Contract, Addendum } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { PlusCircle, Trash2 } from 'lucide-react';

interface EditContractFormProps {
  contract: Contract;
}

export function EditContractForm({ contract }: EditContractFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const { updateContract, contracts } = useContractContext();

  const [value, setValue] = useState(contract.value);
  const realization = contract.realization;
  const remainingValue = value - realization;
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addendums, setAddendums] = useState<Partial<Addendum>[]>(contract.addendums || [{ number: '', date: '' }]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch {
      try {
        return format(new Date(dateString), 'yyyy-MM-dd');
      } catch {
        return '';
      }
    }
  };

  const handleAddendumChange = (index: number, field: keyof Addendum, value: string) => {
    const newAddendums = [...addendums];
    newAddendums[index] = { ...newAddendums[index], [field]: value };
    setAddendums(newAddendums);
  };

  const addAddendumRow = () => {
    setAddendums([...addendums, { number: '', date: '' }]);
  };

  const removeAddendumRow = (index: number) => {
    const newAddendums = addendums.filter((_, i) => i !== index);
    setAddendums(newAddendums);
  };
  
  const validateForm = (formData: FormData) => {
      const newErrors: Record<string, string> = {};
      const contractNumber = formData.get('contractNumber') as string;

      if (!contractNumber) newErrors.contractNumber = 'Nomor kontrak wajib diisi.';
      
      const isDuplicate = contracts.some(
        c => c.contractNumber === contractNumber && c.id !== contract.id
      );

      if (isDuplicate) {
          toast({
              title: 'Gagal Menyimpan',
              description: 'Nomor kontrak sudah ada. Silakan gunakan nomor lain.',
              variant: 'destructive'
          });
          return false;
      }
      
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
          if (Object.keys(errors).length > 0) {
            toast({
                title: 'Kesalahan Validasi',
                description: 'Silakan periksa kembali isian Anda.',
                variant: 'destructive'
            });
          }
          return;
      }

      const filteredAddendums = addendums
        .filter(addendum => addendum.number && addendum.date)
        .map(addendum => ({
            number: addendum.number!,
            date: addendum.date!
        }));
      
      const updatedData: Partial<Contract> = {
          contractNumber: formData.get('contractNumber') as string,
          contractDate: formData.get('contractDate') as string,
          description: formData.get('description') as string,
          implementer: formData.get('implementer') as string,
          value: Number(formData.get('value')),
          addendums: filteredAddendums.length > 0 ? filteredAddendums : [],
      };

      updateContract(contract.id, updatedData);
      
      toast({
          title: 'Sukses',
          description: 'Berhasil memperbarui kontrak.'
      });
      router.push('/dashboard');
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
            <Label htmlFor="contractNumber">Nomor Kontrak</Label>
            <Input id="contractNumber" name="contractNumber" defaultValue={contract.contractNumber} />
            {errors.contractNumber && <p className="text-sm font-medium text-destructive mt-1">{errors.contractNumber}</p>}
        </div>
        <div className="grid gap-2">
            <Label htmlFor="contractDate">Tanggal Kontrak</Label>
            <Input id="contractDate" name="contractDate" type="date" defaultValue={formatDateForInput(contract.contractDate)} />
            {errors.contractDate && <p className="text-sm font-medium text-destructive mt-1">{errors.contractDate}</p>}
        </div>
      </div>
      
       <div className="grid gap-4">
        <Label>Addendum (Opsional)</Label>
        {addendums.map((addendum, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] items-end gap-2 p-3 border rounded-lg bg-muted/50">
            <div className="grid gap-2">
              <Label htmlFor={`addendumNumber-${index}`} className="text-xs">Nomor Addendum {index + 1}</Label>
              <Input
                id={`addendumNumber-${index}`}
                name={`addendumNumber-${index}`}
                placeholder="Nomor Addendum"
                value={addendum.number || ''}
                onChange={(e) => handleAddendumChange(index, 'number', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
               <Label htmlFor={`addendumDate-${index}`} className="text-xs">Tanggal Addendum {index + 1}</Label>
              <Input
                id={`addendumDate-${index}`}
                name={`addendumDate-${index}`}
                type="date"
                value={addendum.date ? formatDateForInput(addendum.date) : ''}
                onChange={(e) => handleAddendumChange(index, 'date', e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => removeAddendumRow(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addAddendumRow}
          className="w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Addendum
        </Button>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Uraian</Label>
        <Textarea id="description" name="description" defaultValue={contract.description} />
        {errors.description && <p className="text-sm font-medium text-destructive mt-1">{errors.description}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="implementer">Pelaksana</Label>
        <Input id="implementer" name="implementer" defaultValue={contract.implementer} />
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
              type="text" 
              readOnly 
              value={formatCurrency(realization)}
              className="bg-muted"
            />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="remainingValue">Sisa Kontrak (Rp)</Label>
            <Input id="remainingValue" name="remainingValue" type="text" readOnly value={formatCurrency(remainingValue)} className="bg-muted" />
        </div>
      </div>
       
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
            Batal
        </Button>
        <Button type="submit" className="w-full">
            Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
