'use client';

import { Button } from '@/components/ui/button';
import { ContractView } from '@/components/app/contract-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useContractContext } from '@/contexts/contract-context';
import { Download } from 'lucide-react';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LaporanPage() {
    const { contracts } = useContractContext();
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/');
        }
    }, [user, isUserLoading, router]);

    const escapeCsvCell = (cell: any): string => {
        if (cell === null || cell === undefined) {
            return '';
        }
        const cellString = String(cell);
        // Although we are using semicolon as a separator, we still escape commas
        // as they can be present in the data. The main check is for the separator itself.
        if (cellString.includes(';') || cellString.includes('"') || cellString.includes('\n')) {
            // Enclose in double quotes and escape existing double quotes by doubling them
            return `"${cellString.replace(/"/g, '""')}"`;
        }
        return cellString;
    };

    const handleExport = () => {
        if (!user) {
            alert('Anda harus login untuk mengekspor data.');
            return;
        }
        if (contracts.length === 0) {
            alert('Tidak ada data untuk diekspor.');
            return;
        }

        const headers = [
            'Nomor Kontrak',
            'Tanggal Kontrak',
            'Nomor Addendum',
            'Tanggal Addendum',
            'Pelaksana',
            'Uraian Kontrak',
            'Nilai Kontrak (Rp)',
            'Realisasi Kontrak (Rp)',
            'Sisa Kontrak (Rp)',
            'Nomor SPM',
            'Tanggal SPM',
            'Nomor SP2D',
            'Tanggal SP2D',
            'Uraian Tagihan',
            'Status Tagihan',
            'Jumlah Tagihan (Rp)',
        ];

        const rows = contracts.flatMap(contract => {
            const addendumNumbers = contract.addendums?.map(a => a.number).join(', ') || '';
            const addendumDates = contract.addendums?.map(a => a.date).join(', ') || '';

            if (!contract.bills || contract.bills.length === 0) {
                return [[
                    escapeCsvCell(contract.contractNumber),
                    escapeCsvCell(contract.contractDate),
                    escapeCsvCell(addendumNumbers),
                    escapeCsvCell(addendumDates),
                    escapeCsvCell(contract.implementer),
                    escapeCsvCell(contract.description),
                    escapeCsvCell(contract.value),
                    escapeCsvCell(contract.realization),
                    escapeCsvCell(contract.remainingValue),
                    '', '', '', '', '', '', '', // Empty bill fields
                ]];
            }
            return contract.bills.map(bill => [
                escapeCsvCell(contract.contractNumber),
                escapeCsvCell(contract.contractDate),
                escapeCsvCell(addendumNumbers),
                escapeCsvCell(addendumDates),
                escapeCsvCell(contract.implementer),
                escapeCsvCell(contract.description),
                escapeCsvCell(contract.value),
                escapeCsvCell(contract.realization),
                escapeCsvCell(contract.remainingValue),
                escapeCsvCell(bill.spmNumber),
                escapeCsvCell(bill.spmDate),
                escapeCsvCell(bill.sp2dNumber),
                escapeCsvCell(bill.sp2dDate),
                escapeCsvCell(bill.description),
                escapeCsvCell(bill.status),
                escapeCsvCell(bill.amount),
            ]);
        });

        const csvContent = [
            headers.join(';'),
            ...rows.map(row => row.join(';'))
        ].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `laporan_kontrak_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (isUserLoading || !user) {
        return <p>Mengalihkan...</p>;
    }
    
    return (
        <>
             <Card className="w-full mb-8">
                <CardHeader className='flex-row items-center justify-between'>
                    <div>
                        <CardTitle>Laporan Keuangan</CardTitle>
                        <CardDescription>
                            Unduh semua data kontrak dan tagihan atau lihat langsung di bawah.
                        </CardDescription>
                    </div>
                     <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Ekspor ke CSV
                    </Button>
                </CardHeader>
            </Card>

            <ContractView />
        </>
    );
}
