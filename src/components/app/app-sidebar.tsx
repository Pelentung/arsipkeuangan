'use client';

import { AppIcon } from '@/components/app/app-icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FileText, LogOut, PanelLeft, BarChart2, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function AppSidebar() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Gagal keluar:', error);
      // Anda bisa menampilkan pesan error kepada pengguna di sini
    }
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="flex items-center gap-2 h-16 border-b px-6">
          <AppIcon className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">Gudang Kontrak</span>
        </div>
        <nav className="flex-1 p-4 flex flex-col justify-between">
          <div className="grid gap-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg bg-secondary text-primary px-3 py-2 transition-all hover:text-primary"
            >
              <FileText className="h-4 w-4" />
              Kontrak
            </Link>
            <Link
              href="/laporan"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ClipboardList className="h-4 w-4" />
              Laporan
            </Link>
            <Link
              href="/statistik"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <BarChart2 className="h-4 w-4" />
              Statistik
            </Link>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="justify-start">
            <LogOut className="mr-3 h-4 w-4" />
            Keluar
          </Button>
        </nav>
      </aside>
      <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Beralih Navigasi</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <div className="flex items-center gap-2 h-16 border-b px-6">
                <AppIcon className="w-6 h-6 text-primary" />
                <span className="font-semibold text-lg">Gudang Kontrak</span>
            </div>
            <nav className="grid gap-2 text-lg font-medium p-4">
              <Link
                href="/"
                className="flex items-center gap-4 rounded-xl bg-secondary px-3 py-2 text-primary"
              >
                <FileText className="h-5 w-5" />
                Kontrak
              </Link>
              <Link
                href="/laporan"
                className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-primary"
              >
                <ClipboardList className="h-5 w-5" />
                Laporan
              </Link>
              <Link
                href="/statistik"
                className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-primary"
              >
                <BarChart2 className="h-5 w-5" />
                Statistik
              </Link>
            </nav>
            <div className="mt-auto p-4">
               <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-lg">
                <LogOut className="mr-4 h-5 w-5" />
                Keluar
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 font-semibold">
           <AppIcon className="w-6 h-6 text-primary" />
          <span className="font-semibold">Gudang Kontrak</span>
        </div>
      </header>
    </>
  );
}
