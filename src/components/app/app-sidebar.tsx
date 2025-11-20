'use client';

import { AppIcon } from '@/components/app/app-icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, PanelLeft, ClipboardList, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const navItems = [
    { href: '/', label: 'Data Kontrak', icon: Home },
    { href: '/laporan', label: 'Laporan', icon: ClipboardList },
]

export function AppSidebar() {
  const pathname = usePathname();
  const { user, claims } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
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
    <>
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="flex items-center gap-2 h-16 border-b px-6">
          <AppIcon className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">Data Kontrak</span>
        </div>
        <nav className="flex-1 p-4 flex flex-col justify-between">
          <div className="grid gap-1">
            <NavLinks />
          </div>
          {user && (
            <div className='border-t pt-4'>
                <div className='flex items-center gap-3 px-3 py-2'>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={claims?.picture} alt="Avatar" />
                        <AvatarFallback>{claims?.name?.[0] || 'T'}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                        <p className='text-sm font-medium leading-none'>{claims?.name || 'Tamu'}</p>
                        <p className='text-xs leading-none text-muted-foreground'>{claims?.email || 'Login sebagai tamu'}</p>
                    </div>
                </div>
                 <Button variant="ghost" className="w-full justify-start mt-2" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
          )}
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
                <span className="font-semibold text-lg">Data Kontrak</span>
            </div>
            <nav className="grid gap-2 text-lg font-medium p-4 flex-1">
               <NavLinks isMobile />
            </nav>
            {user && (
              <div className='border-t p-4'>
                  <div className='flex items-center gap-3 px-3 py-2 mb-2'>
                      <Avatar className="h-10 w-10">
                          <AvatarImage src={claims?.picture} alt="Avatar" />
                          <AvatarFallback>{claims?.name?.[0] || 'T'}</AvatarFallback>
                      </Avatar>
                      <div>
                          <p className='text-base font-medium leading-none'>{claims?.name || 'Tamu'}</p>
                          <p className='text-sm text-muted-foreground'>{claims?.email || 'Login sebagai tamu'}</p>
                      </div>
                  </div>
                  <Button variant="ghost" className="w-full justify-start text-lg" onClick={handleLogout}>
                      <LogOut className="mr-3 h-5 w-5" />
                      Logout
                  </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 font-semibold">
           <AppIcon className="w-6 h-6 text-primary" />
          <span className="font-semibold">Data Kontrak</span>
        </div>
      </header>
    </>
  );
}
