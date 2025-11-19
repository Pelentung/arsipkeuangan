'use client';

import { AppIcon } from '@/components/app/app-icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FileText, PanelLeft } from 'lucide-react';
import Link from 'next/link';

export function AppSidebar() {
  return (
    <>
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="flex items-center gap-2 h-16 border-b px-6">
          <AppIcon className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">Contract Vault</span>
        </div>
        <nav className="flex-1 p-4">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg bg-secondary text-primary px-3 py-2 transition-all hover:text-primary"
          >
            <FileText className="h-4 w-4" />
            Contracts
          </Link>
        </nav>
      </aside>
      <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex items-center gap-2 h-16 border-b px-6">
                <AppIcon className="w-6 h-6 text-primary" />
                <span className="font-semibold text-lg">Contract Vault</span>
            </div>
            <nav className="grid gap-2 text-lg font-medium p-4">
              <Link
                href="#"
                className="flex items-center gap-4 rounded-xl bg-secondary px-3 py-2 text-primary"
              >
                <FileText className="h-5 w-5" />
                Contracts
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 font-semibold">
           <AppIcon className="w-6 h-6 text-primary" />
          <span className="font-semibold">Contract Vault</span>
        </div>
      </header>
    </>
  );
}
