'use client';

import { AppSidebar } from '@/components/app/app-sidebar';
import { ContractView } from '@/components/app/contract-view';
import { Suspense, useEffect, useMemo, useState } from 'react';
import type { Contract } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Coins, Receipt, Wallet, PlusCircle } from 'lucide-react';
import { ContractStatusChart } from '@/components/app/contract-status-chart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ContractProvider } from '@/contexts/contract-context';

function Dashboard() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedContracts = localStorage.getItem('contracts');
      if (savedContracts) {
        setContracts(JSON.parse(savedContracts));
      }
    } catch (error) {
      console.error("Failed to load contracts from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if(!loading) {
      try {
        localStorage.setItem('contracts', JSON.stringify(contracts));
      } catch (error) {
        console.error("Failed to save contracts to localStorage", error);
      }
    }
  }, [contracts, loading]);

  const handleAddContract = (newContractData: Omit<Contract, 'id' | 'realization' | 'remainingValue'>) => {
    setContracts(prevContracts => {
      const newContract: Contract = {
        ...newContractData,
        id: new Date().toISOString(), // Simple unique ID
        realization: newContractData.realization || 0,
        remainingValue: newContractData.value - (newContractData.realization || 0),
      };
      return [...prevContracts, newContract];
    });
  };

  const handleAddBill = (contractId: string, bill: { amount: number, billDate: string, description: string }) => {
    setContracts(prevContracts => {
      return prevContracts.map(contract => {
        if (contract.id === contractId) {
          const newRealization = contract.realization + bill.amount;
          const newRemainingValue = contract.value - newRealization;
          return {
            ...contract,
            realization: newRealization,
            remainingValue: newRemainingValue,
          };
        }
        return contract;
      });
    });
  };

  const summary = useMemo(() => {
    const total = contracts.length;
    const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
    const totalRealization = contracts.reduce((sum, c) => sum + c.realization, 0);
    const totalRemaining = totalValue - totalRealization;

    return { total, totalValue, totalRealization, totalRemaining };
  }, [contracts]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };
  
  const chartData = useMemo(() => {
     const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
     const monthlyData: { [key: string]: { nilai: number, realisasi: number } } = {};

     contracts.forEach(contract => {
        const contractDate = new Date(contract.contractDate);
        const month = contractDate.getMonth();
        const year = contractDate.getFullYear();
        const key = `${monthNames[month]} ${year}`;

        if (!monthlyData[key]) {
            monthlyData[key] = { nilai: 0, realisasi: 0 };
        }
        
        monthlyData[key].nilai += contract.value;
        monthlyData[key].realisasi += contract.realization;
     });

    return Object.entries(monthlyData).map(([month, data]) => ({ month, ...data }));
  }, [contracts]);

  if (loading) {
    return <p>Memuat data lokal...</p>;
  }

  return (
    <ContractProvider onAddContract={handleAddContract} onAddBill={handleAddBill}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Dasbor</h1>
            <p className="text-muted-foreground">
                Selamat datang! Berikut adalah ringkasan data keuangan Anda.
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

      <ContractView initialContracts={contracts} />
    </ContractProvider>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <Suspense fallback={<p>Memuat...</p>}>
          <Dashboard />
        </Suspense>
      </main>
    </div>
  );
}
