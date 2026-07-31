'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'light' | 'dark';
}

export function BrandLogo({ className = '', size = 'md', variant = 'default' }: BrandLogoProps) {
  const sizeClasses = {
    sm: 'text-lg h-6',
    md: 'text-2xl h-8',
    lg: 'text-3xl h-10',
    xl: 'text-4xl h-12',
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <span 
        className={`font-black tracking-[0.02em] uppercase font-sans leading-none ${sizeClasses[size]} ${
          variant === 'light' 
            ? 'text-white' 
            : variant === 'dark' 
            ? 'text-black' 
            : 'text-neutral-900 dark:text-white'
        }`}
        style={{
          fontFamily: "'Impact', 'Arial Black', 'Trebuchet MS', sans-serif",
          letterSpacing: '-0.03em',
          transform: 'scaleY(1.05)',
        }}
      >
        <span className="text-brand dark:text-red-500">BLOOD</span>
        <span className="text-neutral-900 dark:text-white">4</span>
        <span className="text-brand dark:text-red-500">LIFE</span>
      </span>
    </div>
  );
}

export function BrandLogoHeader() {
  return (
    <Link href="/" prefetch={true} className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-full bg-brand text-white font-extrabold flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
        ❤
      </div>
      <BrandLogo size="md" />
    </Link>
  );
}
