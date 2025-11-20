'use client';
import { useState, useEffect } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
  createUserWithEmailAndPassword,
  updateProfile
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
import { Separator } from '@/components/ui/separator';
import { AppIcon } from '@/components/app/app-icon';

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

  const handleAnonymousLogin = () => {
    setIsLoading(true);
    signInAnonymously(auth)
      .then(() => {
          router.push('/dashboard');
      })
      .catch((error) => {
        toast({
          title: 'Gagal Login Anonim',
          description: 'Terjadi kesalahan saat mencoba masuk sebagai tamu.',
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
          <div className="relative w-full">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 top-[-10px] bg-card px-2 text-xs text-muted-foreground">
              ATAU
            </span>
          </div>
           <Button
            className="w-full"
            variant="secondary"
            onClick={handleAnonymousLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Lanjutkan sebagai Tamu'}
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
      <div className="flex items-center gap-3 mb-6">
        <AppIcon className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Gudang Kontrak</h1>
      </div>
      <LoginForm />
    </div>
  );
}
