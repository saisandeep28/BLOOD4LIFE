'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Button } from '@/components/ui/button';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Fatal Error</h1>
          <p className="text-lg text-neutral-500 mb-8 max-w-md">
            We're sorry, but a critical error has occurred that prevents the application from loading.
          </p>
          <Button onClick={() => window.location.reload()} size="lg">
            Reload Page
          </Button>
        </div>
      </body>
    </html>
  );
}
