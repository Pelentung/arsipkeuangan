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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


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
    <Card className="border-0 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Selamat Datang Kembali!</CardTitle>
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


function RegisterForm() {
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
        const user = userCredential.user;
        return updateProfile(user, {
          displayName: name,
        });
      })
      .then(() => {
        router.push('/dashboard');
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
     <Card className="border-0 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
          <CardDescription>
            Isi form di bawah ini untuk membuat akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
           <div className="grid gap-2">
            <Label htmlFor="register-name">Nama</Label>
            <Input
              id="register-name"
              type="text"
              placeholder="Nama Lengkap Anda"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="nama@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="register-password">Kata Sandi</Label>
            <Input
              id="register-password"
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
      <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Daftar</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
