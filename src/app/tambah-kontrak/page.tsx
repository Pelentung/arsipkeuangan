'use client';

import { AddContractForm } from '@/components/app/add-contract-form';
import { AppSidebar } from '@/components/app/app-sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TambahKontrakPage() {
    
    return (
        <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
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
        </div>
    );
}
