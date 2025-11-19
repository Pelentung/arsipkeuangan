'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';

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

  const handleAuthAction = async (action: 'login' | 'signup') => {
    setError(null);
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      if (action === 'login') {
        await initiateEmailSignIn(auth, email, password);
      } else {
        await initiateEmailSignUp(auth, email, password);
      }
      // onAuthStateChanged will handle the redirect on success
    } catch (e: any) {
      switch (e.code) {
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.');
          break;
        case 'auth/email-already-in-use':
          setError('This email is already in use. Please log in.');
          break;
        case 'auth/weak-password':
          setError('The password is too weak. Please choose a stronger password.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
          break;
      }
    }
  };

  const handleButtonClick = (action: 'login' | 'signup') => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleAuthAction(action);
  };
  
  if (isUserLoading || user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Access Your Vault</CardTitle>
          <CardDescription>Enter your credentials below to access your account.</CardDescription>
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
              <Label htmlFor="password">Password</Label>
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
                  Login
                </Button>
                <Separator className="my-2" />
                 <Button onClick={handleButtonClick('signup')} variant="outline" className="w-full">
                  Sign Up
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
