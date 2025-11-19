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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Add Contract
    </Button>
  );
}

export function AddContractForm({ onSuccess }: { onSuccess: () => void }) {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useFormState(addContract, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: state.message,
        });
        formRef.current?.reset();
        onSuccess();
      }
    }
  }, [state, toast, onSuccess]);

  return (
    <form ref={formRef} action={dispatch} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <div className="col-span-3">
          <Input id="title" name="title" className="w-full" />
          {state.errors?.title && <p className="text-sm font-medium text-destructive mt-1">{state.errors.title[0]}</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="parties" className="text-right">
          Parties
        </Label>
        <div className="col-span-3">
          <Input id="parties" name="parties" placeholder="Comma-separated names" className="w-full" />
           {state.errors?.parties && <p className="text-sm font-medium text-destructive mt-1">{state.errors.parties[0]}</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="startDate" className="text-right">
          Start Date
        </Label>
        <div className="col-span-3">
          <Input id="startDate" name="startDate" type="date" className="w-full" />
           {state.errors?.startDate && <p className="text-sm font-medium text-destructive mt-1">{state.errors.startDate[0]}</p>}
        </div>
      </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="endDate" className="text-right">
          End Date
        </Label>
        <div className="col-span-3">
          <Input id="endDate" name="endDate" type="date" className="w-full" />
          {state.errors?.endDate && <p className="text-sm font-medium text-destructive mt-1">{state.errors.endDate[0]}</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="content" className="text-right pt-2">
          Content
        </Label>
        <div className="col-span-3">
          <Textarea id="content" name="content" className="w-full min-h-[150px]" />
           {state.errors?.content && <p className="text-sm font-medium text-destructive mt-1">{state.errors.content[0]}</p>}
        </div>
      </div>
       {state.errors?.server && <p className="text-sm font-medium text-destructive mt-1 text-center">{state.errors.server[0]}</p>}
      <div className="col-start-2 col-span-3">
        <SubmitButton />
      </div>
    </form>
  );
}
