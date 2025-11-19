'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addContract, type State } from '@/app/actions';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Tambah Kontrak
    </Button>
  );
}

export function AddContractForm({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useUser();
  const initialState: State = { message: null, errors: {} };
  
  // We need to bind the userId to the form action
  const addContractWithUserId = addContract.bind(null);

  const [state, dispatch] = useFormState(addContractWithUserId, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
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
        onSuccess();
      }
    }
  }, [state, toast, onSuccess]);

  return (
    <form ref={formRef} action={dispatch} className="grid gap-4 py-4">
      <input type="hidden" name="userId" value={user?.uid || ''} />
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Judul
        </Label>
        <div className="col-span-3">
          <Input id="title" name="title" className="w-full" />
          {state.errors?.documentName && <p className="text-sm font-medium text-destructive mt-1">{state.errors.documentName[0]}</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="parties" className="text-right">
          Pihak
        </Label>
        <div className="col-span-3">
          <Input id="parties" name="parties" placeholder="Nama dipisahkan koma" className="w-full" />
           {state.errors?.partiesInvolved && <p className="text-sm font-medium text-destructive mt-1">{state.errors.partiesInvolved[0]}</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="startDate" className="text-right">
          Tanggal Mulai
        </Label>
        <div className="col-span-3">
          <Input id="startDate" name="startDate" type="date" className="w-full" />
           {state.errors?.effectiveDate && <p className="text-sm font-medium text-destructive mt-1">{state.errors.effectiveDate[0]}</p>}
        </div>
      </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="endDate" className="text-right">
          Tanggal Selesai
        </Label>
        <div className="col-span-3">
          <Input id="endDate" name="endDate" type="date" className="w-full" />
          {state.errors?.expirationDate && <p className="text-sm font-medium text-destructive mt-1">{state.errors.expirationDate[0]}</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="content" className="text-right pt-2">
          Konten
        </Label>
        <div className="col-span-3">
          <Textarea id="content" name="content" className="w-full min-h-[150px]" />
           {state.errors?.terms && <p className="text-sm font-medium text-destructive mt-1">{state.errors.terms[0]}</p>}
        </div>
      </div>
       {state.errors?.server && <p className="text-sm font-medium text-destructive mt-1 text-center">{state.errors.server[0]}</p>}
      <div className="col-start-2 col-span-3">
        <SubmitButton />
      </div>
    </form>
  );
}
