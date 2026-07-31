'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';
import { Mail, Phone, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload = loginMethod === 'email' 
        ? { email: email.trim(), password }
        : { phone: phone.trim(), password };

      const response: any = await api.post('/auth/login', payload);

      if (response?.success && response?.data) {
        setAuth(response.data.user, response.data.tokens.accessToken);
        toast.success('Login successful! Welcome back.');
        router.push('/dashboard');
      } else {
        toast.error(response?.error?.message || 'Invalid credentials.');
        setErrorMessage(response?.error?.message || 'Invalid credentials.');
      }
    } catch (error: any) {
      const msg = error?.error?.message || error?.message || 'Failed to login. Please check your credentials.';
      toast.error(msg);
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-md mx-auto w-full">
      <button 
        onClick={() => router.back()} 
        className="text-sm text-neutral-500 hover:text-foreground cursor-pointer flex items-center gap-1"
        type="button"
      >
        ← Back
      </button>
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
        <p className="text-neutral-500">Choose your login method to access your account.</p>
      </div>

      {/* Login Method Toggle Pills */}
      <div className="grid grid-cols-2 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => { setLoginMethod('email'); setErrorMessage(''); }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold rounded-lg transition-all ${
            loginMethod === 'email'
              ? 'bg-white dark:bg-neutral-800 text-brand dark:text-red-500 shadow-sm border border-neutral-200/60 dark:border-neutral-700'
              : 'text-neutral-500 hover:text-foreground'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Email Address
        </button>

        <button
          type="button"
          onClick={() => { setLoginMethod('phone'); setErrorMessage(''); }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold rounded-lg transition-all ${
            loginMethod === 'phone'
              ? 'bg-white dark:bg-neutral-800 text-brand dark:text-red-500 shadow-sm border border-neutral-200/60 dark:border-neutral-700'
              : 'text-neutral-500 hover:text-foreground'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          Phone Number
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {loginMethod === 'email' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email Address</label>
              <input 
                id="email" 
                type="email" 
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 py-2 border border-border rounded-input bg-transparent focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">Mobile Phone Number</label>
              <input 
                id="phone" 
                type="tel" 
                required
                placeholder="10-digit mobile number (e.g. 9876543210)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-4 py-2 border border-border rounded-input bg-transparent focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <Link href="/forgot-password" className="text-sm font-medium text-brand hover:text-brand-dark">
                Forgot password?
              </Link>
            </div>
            <input 
              id="password" 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 py-2 border border-border rounded-input bg-transparent focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
          </div>
        </div>

        {errorMessage && (
          <p className="text-sm text-destructive text-center font-medium bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg border border-red-200 dark:border-red-900">
            {errorMessage}
          </p>
        )}

        <Button type="submit" className="w-full bg-brand hover:bg-brand-dark" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : `Sign In with ${loginMethod === 'email' ? 'Email' : 'Phone'}`}
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500 pt-2">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-brand hover:text-brand-dark">
          Sign up
        </Link>
      </p>
    </div>
  );
}
