'use client';
import { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseApp } from '@/firebase';
import Link from 'next/link';

export default function RegisterPage() {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    if (!name) {
      toast({
        title: 'Gagal Registrasi',
        description: 'Nama tidak boleh kosong.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // After creating the user, update their profile with the name
        const user = userCredential.user;
        return updateProfile(user, {
          displayName: name,
        });
      })
      .then(() => {
        // Redirect to home page after successful registration and profile update
        router.push('/');
      })
      .catch((error: any) => {
        let description = 'Terjadi kesalahan saat mencoba mendaftar.';
        switch (error.code) {
          case 'auth/email-already-in-use':
            description = 'Email ini sudah digunakan oleh akun lain.';
            break;
          case 'auth/weak-password':
            description = 'Kata sandi terlalu lemah. Minimal 6 karakter.';
            break;
          case 'auth/invalid-email':
            description = 'Format email tidak valid.';
            break;
        }
        toast({
          title: 'Gagal Registrasi',
          description,
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
          <CardDescription>
            Isi form di bawah ini untuk membuat akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
           <div className="grid gap-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nama Lengkap Anda"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-2">
              Sudah punya akun?{' '}
              <Link href="/login" className="underline text-primary">
                Login
              </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
