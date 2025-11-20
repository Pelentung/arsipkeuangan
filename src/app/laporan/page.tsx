'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useContractContext } from '@/contexts/contract-context';
import { Download } from 'lucide-react';

export default function LaporanPage() {
    const { contracts } = useContractContext();

    const escapeCsvCell = (cell: any): string => {
        if (cell === null || cell === undefined) {
            return '';
        }
        const cellString = String(cell);
        if (cellString.includes(',') || cellString.includes('"') || cellString.includes('\n')) {
            return `"${cellString.replace(/"/g, '""')}"`;
        }
        return cellString;
    };

    const handleExport = () => {
        if (contracts.length === 0) {
            alert('Tidak ada data untuk diekspor.');
            return;
        }

        const headers = [
            'Nomor Kontrak',
            'Tanggal Kontrak',
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
            if (!contract.bills || contract.bills.length === 0) {
                return [[
                    escapeCsvCell(contract.contractNumber),
                    escapeCsvCell(contract.contractDate),
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
            headers.join(','),
            ...rows.map(row => row.join(','))
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
    
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                    <CardTitle>Ekspor Laporan Keuangan</CardTitle>
                    <CardDescription>
                        Unduh semua data kontrak dan tagihan Anda dalam format CSV untuk analisis lebih lanjut di aplikasi spreadsheet.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Ekspor Semua Data ke CSV
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                        File akan berisi semua detail kontrak dan setiap tagihan yang terkait sebagai baris terpisah.
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
