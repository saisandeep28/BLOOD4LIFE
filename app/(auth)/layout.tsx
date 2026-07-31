import Link from 'next/link';
import { BrandLogo } from '@/components/ui/brand-logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-neutral-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brand/10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/20 via-neutral-900 to-neutral-900"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white font-bold">
              ❤
            </div>
            <span className="font-bold text-xl tracking-tight">BLOOD4LIFE</span>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Join the digital<br/>blood bank network.
          </h1>
          <p className="text-neutral-400 text-lg max-w-md">
            Whether you're a donor looking to save lives, or a hospital managing critical inventory, you belong here.
          </p>
        </div>
        
        <div className="relative z-10 text-sm text-neutral-500">
          © {new Date().getFullYear()} BLOOD4LIFE. All rights reserved.
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-5xl">
          {children}
        </div>
      </div>
    </div>
  );
}
