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
            Tambah Kontrak
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Tambah Kontrak Baru</DialogTitle>
          <DialogDescription>
            Isi detail di bawah ini. Konten kontrak akan diringkas menggunakan AI.
          </DialogDescription>
        </DialogHeader>
        <AddContractForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
