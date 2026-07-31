'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-danger" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-neutral-500 max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error has occurred. Our team has been notified.
      </p>
      <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
        <Button onClick={() => reset()} size="lg">
          Try again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}
