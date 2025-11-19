'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AddContractForm } from '@/components/app/add-contract-form';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

export function AddContractDialog({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contract
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Contract</DialogTitle>
          <DialogDescription>
            Fill in the details below. The contract content will be summarized using AI.
          </DialogDescription>
        </DialogHeader>
        <AddContractForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
