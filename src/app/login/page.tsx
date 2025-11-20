'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getRedirectResult } from 'firebase/auth';


const updateSession = async (token: string) => {
  await fetch('/api/login', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        const token = await result.user.getIdToken();
        await updateSession(token);
        router.push('/');
      }
    });
  }, [auth, router]);

  const handleAuthAction = async (action: 'login' | 'signup') => {
    setError(null);
    if (!email || !password) {
      setError('Silakan masukkan email dan kata sandi.');
      return;
    }

    try {
      const userCredential = action === 'login'
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);
      
      const token = await userCredential.user.getIdToken();
      await updateSession(token);
      router.push('/');
      
    } catch (e: any) {
      switch (e.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Email atau kata sandi tidak valid. Silakan coba lagi.');
          break;
        case 'auth/email-already-in-use':
          setError('Email ini sudah digunakan. Silakan masuk.');
          break;
        case 'auth/weak-password':
          setError('Kata sandi terlalu lemah. Silakan pilih kata sandi yang lebih kuat.');
          break;
        default:
          console.error(e);
          setError('Terjadi kesalahan tak terduga. Silakan coba lagi.');
          break;
      }
    }
  };

  const handleButtonClick = (action: 'login' | 'signup') => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleAuthAction(action);
  };
  
  if (isUserLoading || user) {
    return null; // Atau spinner pemuatan
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">SISTEM PEREKAMAN DATA KEUANGAN</CardTitle>
          <CardDescription>Masukkan kredensial Anda di bawah ini untuk mengakses akun Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <div className="flex flex-col gap-2">
                <Button onClick={handleButtonClick('login')} className="w-full">
                  Masuk
                </Button>
                <Separator className="my-2" />
                 <Button onClick={handleButtonClick('signup')} variant="outline" className="w-full">
                  Daftar
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
