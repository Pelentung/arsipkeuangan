'use client';

import { AddContractForm } from '@/components/app/add-contract-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';

export default function TambahKontrakPage() {
    const { user, isUserLoading } = useUser();

    if (isUserLoading || !user) {
        return null;
    }

    return (
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
    );
}
