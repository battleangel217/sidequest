'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { activateUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ActivatePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const { uid, token } = params;
    
    if (uid && token) {
      activateUser(Array.isArray(uid) ? uid[0] : uid, Array.isArray(token) ? token[0] : token)
        .then(() => {
          setStatus('success');
          toast({
            title: 'Account Activated',
            description: 'Your email has been successfully verified.',
          });
        })
        .catch((error) => {
          console.error(error);
          setStatus('error');
          toast({
            variant: 'destructive',
            title: 'Activation Failed',
            description: 'The activation link is invalid or has expired.',
          });
        });
    } else {
        setStatus('error');
    }
  }, [params, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Account Activation</CardTitle>
          <CardDescription>
            {status === 'loading'
              ? 'Verifying your email address...'
              : status === 'success'
              ? 'Email Verified!'
              : 'Verification Failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 py-6">
          {status === 'loading' && (
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          )}
          {status === 'success' && (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="text-center text-muted-foreground">
                Your account is now active. You can log in to access all features.
              </p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center gap-2">
              <XCircle className="h-16 w-16 text-destructive" />
              <p className="text-center text-muted-foreground">
                We couldn't verify your email. The link might be broken or expired.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === 'success' ? (
            <Button asChild className="w-full">
              <Link href="/auth">Go to Login</Link>
            </Button>
          ) : status === 'error' ? (
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth">Back to Sign Up</Link>
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
