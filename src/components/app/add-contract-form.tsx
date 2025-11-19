'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addContract, type ContractState } from '@/app/actions';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Simpan
    </Button>
  );
}

export function AddContractForm() {
  const { user } = useUser();
  const router = useRouter();
  const initialState: ContractState = { message: null, errors: {} };
  
  const [state, dispatch] = useActionState(addContract, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const [value, setValue] = useState(0);
  const [realization, setRealization] = useState(0);
  const remainingValue = value - realization;

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
        router.push('/');
      }
    }
  }, [state, toast, router]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };


  return (
    <form ref={formRef} action={dispatch} className="grid gap-6 py-4">
      <input type="hidden" name="userId" value={user?.uid || ''} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
            <Label htmlFor="contractNumber">Nomor Kontrak</Label>
            <Input id="contractNumber" name="contractNumber" />
            {state.errors?.contractNumber && <p className="text-sm font-medium text-destructive mt-1">{state.errors.contractNumber[0]}</p>}
        </div>
        <div className="grid gap-2">
            <Label htmlFor="contractDate">Tanggal Kontrak</Label>
            <Input id="contractDate" name="contractDate" type="date" />
            {state.errors?.contractDate && <p className="text-sm font-medium text-destructive mt-1">{state.errors.contractDate[0]}</p>}
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
        {state.errors?.description && <p className="text-sm font-medium text-destructive mt-1">{state.errors.description[0]}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="implementer">Pelaksana</Label>
        <Input id="implementer" name="implementer" />
        {state.errors?.implementer && <p className="text-sm font-medium text-destructive mt-1">{state.errors.implementer[0]}</p>}
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
            {state.errors?.value && <p className="text-sm font-medium text-destructive mt-1">{state.errors.value[0]}</p>}
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
             {state.errors?.realization && <p className="text-sm font-medium text-destructive mt-1">{state.errors.realization[0]}</p>}
        </div>
        <div className="grid gap-2">
            <Label htmlFor="remainingValue">Sisa Kontrak (Rp)</Label>
            <Input id="remainingValue" name="remainingValue" type="text" readOnly value={formatCurrency(remainingValue)} className="bg-muted" />
             <input type="hidden" name="remainingValueNumeric" value={remainingValue} />
        </div>
      </div>
       
       {state.errors?.server && <p className="text-sm font-medium text-destructive mt-1 text-center">{state.errors.server[0]}</p>}
      
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
