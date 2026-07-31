'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      router.push('/login');
    }
  }, [token, router]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;
    
    try {
      const response = await api.post('/auth/password/reset', {
        token,
        newPassword: data.password,
      });
      
      if (response.success) {
        setIsSuccess(true);
        toast.success('Password has been reset successfully');
      }
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to reset password. The link may have expired.');
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Password reset complete</h2>
          <p className="text-neutral-500">
            Your password has been successfully updated. You can now log in with your new password.
          </p>
        </div>
        <Button asChild className="w-full" size="lg">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="space-y-8 max-w-md mx-auto w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Reset password</h2>
        <p className="text-neutral-500">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">New Password</label>
            <input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              className={`w-full h-11 px-4 py-2 border rounded-input bg-transparent focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all ${
                errors.password ? 'border-destructive' : 'border-border'
              }`}
              {...register('password')}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••"
              className={`w-full h-11 px-4 py-2 border rounded-input bg-transparent focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all ${
                errors.confirmPassword ? 'border-destructive' : 'border-border'
              }`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}
