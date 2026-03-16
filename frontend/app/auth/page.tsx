'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, Eye, EyeOff } from 'lucide-react';
import { signUp, signIn, signInWithGoogle } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import { useTheme } from 'next-themes';

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Password Visibility State
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirm, setShowSignUpConfirm] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setIsLoading(true);
    try {
      await signInWithGoogle(credentialResponse.credential);
      toast({
        title: 'Welcome!',
        description: 'Successfully signed in with Google. Redirecting to dashboard...',
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed';
      toast({
        title: 'Sign In Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast({
      title: 'Sign In Failed',
      description: 'Google authentication was not completed.',
      variant: 'destructive',
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!signUpEmail || !signUpUsername || !signUpPassword || !signUpConfirm) {
        toast({
          title: 'Missing Fields',
          description: 'Please fill in all fields',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (signUpPassword !== signUpConfirm) {
        toast({
          title: 'Passwords Do Not Match',
          description: 'Please ensure both passwords are the same',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      await signUp(signUpUsername, signUpEmail, signUpPassword);

      toast({
        title: 'Welcome to SideQuest!',
        description: 'Account created successfully. Sign in to continue.',
      });

      // Reset signup form and switch to signin tab
      setSignUpEmail('');
      setSignUpUsername('');
      setSignUpPassword('');
      setSignUpConfirm('');
      setActiveTab('signin');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: 'Sign Up Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!signInEmail || !signInPassword) {
        toast({
          title: 'Missing Fields',
          description: 'Please fill in all fields',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      signIn(signInEmail, signInPassword);
      toast({
        title: 'Welcome Back!',
        description: 'Redirecting to dashboard...',
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid credentials';
      toast({
        title: 'Sign In Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:to-slate-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <Flame className="w-8 h-8 text-accent" />
          <span className="text-2xl font-bold text-foreground">SideQuest</span>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
        <p className="text-muted-foreground mt-2">Join the quest for a more productive you</p>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 relative h-11">
            <TabsTrigger value="signup" className="z-10 h-full">Sign Up</TabsTrigger>
            <div className="absolute inset-y-2 left-1/2 w-[2px] -translate-x-1/2 bg-black/10 dark:bg-white/10 z-20 pointer-events-none rounded-full"></div>
            <TabsTrigger value="signin" className="z-10 h-full">Sign In</TabsTrigger>
          </TabsList>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="p-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="Choose your quest name"
                  value={signUpUsername}
                  onChange={(e) => setSignUpUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showSignUpPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showSignUpConfirm ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={signUpConfirm}
                    onChange={(e) => setSignUpConfirm(e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpConfirm(!showSignUpConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showSignUpConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Start Your Quest'}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                By signing up, you agree to our Terms of Service
              </p>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme={mounted && resolvedTheme === 'dark' ? 'filled_black' : 'outline'}
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </form>
          </TabsContent>

          {/* Sign In Tab */}
          <TabsContent value="signin" className="p-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showSignInPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Continue Your Quest'}
              </Button>

              <div className="text-center text-sm mt-4">
                <Link href="#" className="text-primary hover:underline">
                  Forgot your password?
                </Link>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme={mounted && resolvedTheme === 'dark' ? 'filled_black' : 'outline'}
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
    </GoogleOAuthProvider>
  );
}
