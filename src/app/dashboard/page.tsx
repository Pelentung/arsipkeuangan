'use client';

import { ContractView } from '@/components/app/contract-view';
import { Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Coins, Receipt, Wallet, PlusCircle } from 'lucide-react';
import { ContractStatusChart } from '@/components/app/contract-status-chart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useContractContext } from '@/contexts/contract-context';
import { useUser } from '@/firebase';

function Dashboard() {
  const { contracts, loading } = useContractContext();
  const { user, isUserLoading } = useUser();

  const summary = useMemo(() => {
    if (loading || !contracts) {
      return { total: 0, totalValue: 0, totalRealization: 0, totalRemaining: 0 };
    }
    const total = contracts.length;
    const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
    const totalRealization = contracts.reduce((sum, c) => sum + c.realization, 0);
    const totalRemaining = totalValue - totalRealization;

    return { total, totalValue, totalRealization, totalRemaining };
  }, [contracts, loading]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };
  
  const chartData = useMemo(() => {
     if (loading || !contracts) return [];
     const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
     const monthlyData: { [key: string]: { realisasi: number } } = {};

     contracts.forEach(contract => {
        const contractDate = new Date(contract.contractDate);
        if (isNaN(contractDate.getTime())) return;
        const month = contractDate.getMonth();
        const year = contractDate.getFullYear();
        const key = `${monthNames[month]} ${year}`;

        if (!monthlyData[key]) {
            monthlyData[key] = { realisasi: 0 };
        }
        
        monthlyData[key].realisasi += contract.realization;
     });

    return Object.entries(monthlyData).map(([month, data]) => ({ month, ...data }));
  }, [contracts, loading]);

  if (isUserLoading || !user) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Kontrak</h1>
            <p className="text-muted-foreground">
                Selamat datang, {user?.displayName || 'Pengguna'}!
            </p>
        </div>
        <Link href="/tambah-kontrak" passHref>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Data
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
            <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Realisasi</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalRealization)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sisa</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalRemaining)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Realisasi Data Keuangan per Bulan</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
            <ContractStatusChart data={chartData} />
        </CardContent>
      </Card>

      <ContractView />
    </>
  );
}

export default function DashboardPage() {
  return (
      <Suspense fallback={<p>Memuat...</p>}>
        <Dashboard />
      </Suspense>
  );
}
