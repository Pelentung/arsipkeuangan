'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LaporanPage() {
    
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Halaman Laporan</CardTitle>
                    <CardDescription>
                        Halaman ini sedang dalam pengembangan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Fitur laporan akan segera tersedia di sini.</p>
                </CardContent>
            </Card>
        </main>
    );
}
