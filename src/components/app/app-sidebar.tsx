'use client';

import { AppIcon } from '@/components/app/app-icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, PanelLeft, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/dashboard', label: 'Data Kontrak', icon: Home },
    { href: '/laporan', label: 'Laporan', icon: ClipboardList },
]

export function AppSidebar() {
  const pathname = usePathname();

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
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <nav className="flex-1 p-4 flex flex-col justify-between">
          <div className="grid gap-1">
            <NavLinks />
          </div>
        </nav>
      </aside>
  );
}
