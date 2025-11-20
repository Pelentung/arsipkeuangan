'use client';
import { useState, useEffect } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
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
import { useFirebaseApp, useUser } from '@/firebase';
import Image from 'next/image';

function LoginForm() {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        router.push('/dashboard');
    })
    .catch((error: any) => {
      toast({
        title: 'Gagal Login',
        description:
          error.code === 'auth/invalid-credential'
            ? 'Email atau kata sandi salah.'
            : 'Terjadi kesalahan saat mencoba masuk.',
        variant: 'destructive',
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Card className="border-0 shadow-none w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Selamat Datang!</CardTitle>
          <CardDescription>
            Masukkan email dan kata sandi Anda untuk melanjutkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
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
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Login'}
          </Button>
        </CardFooter>
      </Card>
  )
}

export default function WelcomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return <p>Mengalihkan...</p>;
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex flex-col items-center gap-4 mb-6">
        <Image 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Logo_Kota_Medan_%28Seal_of_Medan%29.svg/500px-Logo_Kota_Medan_%28Seal_of_Medan%29.svg.png?20190418174340"
          alt="Logo Kota Medan"
          width={100}
          height={100}
          className='mb-4'
        />
        <div className="w-full max-w-md overflow-hidden">
             <p className="font-headline text-lg font-semibold whitespace-nowrap animate-marquee text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-600">
                Dinas Perumahan Kawasan Permukiman Cipta Karya dan Tata Ruang Kota Medan
            </p>
        </div>
        <h1 className="text-2xl font-headline font-bold text-center">ARSIP DATA KONTRAK</h1>
      </div>
      <LoginForm />
    </div>
  );
}