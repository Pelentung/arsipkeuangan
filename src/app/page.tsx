'use client';

import { AppSidebar } from '@/components/app/app-sidebar';
import { getContracts } from '@/lib/contracts';
import { ContractView, ContractViewSkeleton } from '@/components/app/contract-view';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import type { Contract } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, AlertTriangle, CheckCircle, PlusCircle } from 'lucide-react';
import { ContractStatusChart } from '@/components/app/contract-status-chart';
import { differenceInDays, isPast } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Dashboard({ contracts }: { contracts: Contract[] }) {
  const summary = useMemo(() => {
    const now = new Date();
    const total = contracts.length;
    const active = contracts.filter(c => !isPast(new Date(c.expirationDate))).length;
    const expiringSoon = contracts.filter(c => {
        const endDate = new Date(c.expirationDate);
        return !isPast(endDate) && differenceInDays(endDate, now) <= 30;
    }).length;
    const expired = total - active;

    return { total, active, expiringSoon, expired };
  }, [contracts]);

  const chartData = useMemo(() => {
     const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
     const monthlyData: { [key: string]: { active: number, expired: number, expiringSoon: number } } = {};

     contracts.forEach(contract => {
        const expiration = new Date(contract.expirationDate);
        const month = expiration.getMonth();
        const year = expiration.getFullYear();
        const key = `${monthNames[month]} ${year}`;

        if (!monthlyData[key]) {
            monthlyData[key] = { active: 0, expired: 0, expiringSoon: 0 };
        }
        
        const now = new Date();
        if (isPast(expiration)) {
            monthlyData[key].expired += 1;
        } else if (differenceInDays(expiration, now) <= 30) {
            monthlyData[key].expiringSoon += 1;
        } else {
            monthlyData[key].active += 1;
        }
     });

    return Object.entries(monthlyData).map(([month, data]) => ({ month, ...data }));
  }, [contracts]);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Dasbor</h1>
            <p className="text-muted-foreground">
                Selamat datang! Berikut adalah ringkasan data kontrak Anda.
            </p>
        </div>
        <Link href="/tambah-kontrak" passHref>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Kontrak
            </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kontrak</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kontrak Aktif</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Akan Berakhir (30 Hari)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.expiringSoon}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Telah Berakhir</CardTitle>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.expired}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Realisasi Data Kontrak per Bulan</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
            <ContractStatusChart data={chartData} />
        </CardContent>
      </Card>

      <ContractView initialContracts={contracts} />
    </>
  );
}


function DashboardLoader({ userId }: { userId: string }) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContracts() {
      if (userId) {
        const fetchedContracts = await getContracts(userId);
        setContracts(fetchedContracts);
        setLoading(false);
      }
    }
    loadContracts();
  }, [userId]);

  if (loading) {
    return <ContractViewSkeleton />;
  }

  return <Dashboard contracts={contracts} />;
}

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full bg-background items-center justify-center">
        <ContractViewSkeleton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <Suspense fallback={<ContractViewSkeleton />}>
          <DashboardLoader userId={user.uid} />
        </Suspense>
      </main>
    </div>
  );
}
