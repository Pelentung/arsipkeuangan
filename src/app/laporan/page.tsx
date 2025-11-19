'use client';

import { AppSidebar } from '@/components/app/app-sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LaporanPage() {
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
                <p>Memuat...</p>
            </div>
        );
    }
    
    return (
        <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
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
        </div>
    );
}
