'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Missing verification token');
      return;
    }

    const verify = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`);
        if (response.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage('Verification failed');
        }
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.error?.message || 'Invalid or expired token');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="space-y-8 text-center max-w-md mx-auto w-full">
      {status === 'loading' && (
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Verifying your email</h2>
          <p className="text-neutral-500">Please wait while we verify your email address...</p>
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-r-transparent"></div>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div>
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Email Verified</h2>
          <p className="text-neutral-500 mb-8">
            Thank you! Your email address has been successfully verified.
          </p>
          <Button asChild className="w-full" size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div>
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Verification Failed</h2>
          <p className="text-neutral-500 mb-8">
            {errorMessage}
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full" size="lg">
              <Link href="/login">Return to Login</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
