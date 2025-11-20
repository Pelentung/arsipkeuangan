'use client';

import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogOut, Home, ClipboardList } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { AppIcon } from './app-icon';
import { usePathname } from 'next/navigation';


const navItems = [
    { href: '/dashboard', label: 'Data Kontrak', icon: Home },
    { href: '/laporan', label: 'Laporan', icon: ClipboardList },
]

export function AppHeader() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              isMobile ? 'text-lg' : 'text-sm'
            } ${isActive ? 'bg-secondary text-primary' : 'text-muted-foreground'}`}
          >
            <Icon className={isMobile ? 'h-5 w-5' : 'h-4 w-4'} />
            {label}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
      <div className='flex items-center gap-4'>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Beralih Navigasi</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <div className="flex items-center gap-2 h-16 border-b px-6">
                <AppIcon className="w-6 h-6 text-primary" />
                <span className="font-semibold font-headline text-lg">ARSIP DATA KONTRAK</span>
            </div>
            <nav className="grid gap-2 text-lg font-medium p-4 flex-1">
               <NavLinks isMobile />
            </nav>
          </SheetContent>
        </Sheet>
         <div className="hidden md:flex items-center gap-2 font-semibold">
           <AppIcon className="w-6 h-6 text-primary" />
          <span className="font-semibold font-headline">ARSIP DATA KONTRAK</span>
        </div>
      </div>
      
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.photoURL ?? undefined} alt="Avatar" />
                <AvatarFallback>{user.displayName?.[0] || 'T'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-3 px-2 py-1.5">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.photoURL ?? undefined} alt="Avatar" />
                <AvatarFallback>{user.displayName?.[0] || 'T'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium leading-none">
                  {user.displayName || 'Tamu'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email || 'Login sebagai tamu'}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
