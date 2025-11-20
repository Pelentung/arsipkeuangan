'use client';

import { AddContractForm } from '@/components/app/add-contract-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TambahKontrakPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <p>Memuat...</p>
    }

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Tambah Data Keuangan Baru</CardTitle>
                    <CardDescription>
                        Isi detail di bawah ini untuk menambahkan data baru ke dalam sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AddContractForm />
                </CardContent>
            </Card>
        </main>
    );
}
