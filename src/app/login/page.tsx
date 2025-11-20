'use client';
import { useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInAnonymously,
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
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Gagal Login',
        description:
          error.code === 'auth/invalid-credential'
            ? 'Email atau kata sandi salah.'
            : 'Terjadi kesalahan saat mencoba masuk.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      router.push('/');
    } catch (error) {
       toast({
        title: 'Gagal Login Anonim',
        description: 'Terjadi kesalahan saat mencoba masuk sebagai tamu.',
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
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
    </div>
  );
}
