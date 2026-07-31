'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const response = await api.post('/auth/password/forgot', data);
      if (response.success) {
        setIsSubmitted(true);
        toast.success('Password reset link sent to your email');
      }
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to process request. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Check your email</h2>
          <p className="text-neutral-500">
            We've sent a password reset link to your email address. Please check your inbox and spam folder.
          </p>
        </div>
        <Button asChild className="w-full" size="lg">
          <Link href="/login">Return to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-md mx-auto w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Forgot password?</h2>
        <p className="text-neutral-500">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              placeholder="name@example.com"
              className={`w-full h-11 px-4 py-2 border rounded-input bg-transparent focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all ${
                errors.email ? 'border-destructive' : 'border-border'
              }`}
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Sending link...' : 'Send reset link'}
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        Remember your password?{' '}
        <Link href="/login" className="font-medium text-brand hover:text-brand-dark">
          Log in
        </Link>
      </p>
    </div>
  );
}
