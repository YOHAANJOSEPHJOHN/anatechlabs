'use client';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(undefined);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!auth) {
      setErrorMessage("Authentication service is not available.");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Attempting Firebase sign-in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase sign-in successful for:', userCredential.user.email);
      
      const idToken = await userCredential.user.getIdToken();
      
      console.log('Attempting to create server session...');
      const response = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        let errorMsg = 'Failed to create server session.';
        try {
            const errorData = await response.json();
            if (errorData.message) errorMsg = errorData.message;
        } catch(e) {
            // Ignore if response is not json
        }
        throw new Error(errorMsg);
      }
      
      console.log('Server session created. Redirecting to /admin...');
      router.replace('/admin');

    } catch (error: any) {
      console.error("Login process failed:", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          setErrorMessage('Invalid email or password.');
      } else {
          setErrorMessage(error.message || 'An error occurred during authentication. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        <div className="mb-8 flex items-center gap-2">
            <Image src="https://image2url.com/images/1762929258972-a137849d-1725-4457-aaab-d3f2cd2f07a2.png" alt="AnaTech Logo" width={40} height={40} />
            <span className="font-bold font-display text-2xl text-primary">AnaTech Admin</span>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : <> <LogIn className="mr-2 h-4 w-4" /> Login </>}
              </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
