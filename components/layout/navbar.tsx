'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { BrandLogoHeader } from '@/components/ui/brand-logo';
import { Menu, X, LogOut, User, ChevronDown, Phone, MapPin, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const ROLE_LABELS: Record<string, string> = {
  donor: 'Donor',
  hospital: 'Hospital',
  blood_bank: 'Blood Bank',
  admin: 'Admin',
  volunteer: 'Volunteer',
};

const ROLE_COLORS: Record<string, string> = {
  donor: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  hospital: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  blood_bank: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  admin: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  volunteer: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
};

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (_) {}
    logout();
    setIsProfileOpen(false);
    toast.success('Signed out successfully.');
    router.push('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white font-bold">
            ❤
          </div>
          <span className="font-bold text-xl tracking-tight text-brand">BLOOD4LIFE</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/donors" prefetch={true} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Find Donors</Link>
          <Link href="/hospitals" prefetch={true} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Hospitals</Link>
          <Link href="/blood-banks" prefetch={true} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Blood Banks</Link>
          <Link href="/blood-availability" prefetch={true} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Blood Availability Search</Link>
          <Link href="/about" prefetch={true} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">About Us</Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated && user ? (
              /* ── Profile Dropdown ── */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border hover:border-brand/60 hover:bg-brand/5 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <span className="text-sm font-semibold text-foreground max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-[#8b0000]/10 to-[#8b0000]/5 dark:from-red-950/40 dark:to-red-950/20 p-4 border-b border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#8b0000] text-white text-lg font-bold flex items-center justify-center shrink-0 shadow-md">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-neutral-900 dark:text-neutral-100 truncate">{user.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                          <span className={`inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${ROLE_COLORS[user.role] || 'bg-neutral-100 text-neutral-600'}`}>
                            {ROLE_LABELS[user.role] || user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-3 space-y-1">
                      <Link
                        href="/dashboard"
                        prefetch={true}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 transition-colors font-medium"
                      >
                        <User className="w-4 h-4" />
                        My Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Auth Buttons ── */
              <>
                <Link href="/login" prefetch={true}>
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/register" prefetch={true}>
                  <Button variant="default" className="bg-brand hover:bg-brand-dark">Sign up</Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="sm:hidden flex items-center">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-border bg-background px-4 py-6 space-y-4 shadow-lg absolute w-full">
          <nav className="flex flex-col gap-4">
            <Link href="/donors" className="text-base font-medium text-foreground hover:text-brand transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Find Donors</Link>
            <Link href="/hospitals" className="text-base font-medium text-foreground hover:text-brand transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Hospitals</Link>
            <Link href="/blood-banks" className="text-base font-medium text-foreground hover:text-brand transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Blood Banks</Link>
            <Link href="/blood-availability" className="text-base font-medium text-foreground hover:text-brand transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Blood Availability Search</Link>
            <Link href="/about" className="text-base font-medium text-foreground hover:text-brand transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          </nav>
          
          <div className="h-px bg-border my-4"></div>
          
          {isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-full bg-brand text-white font-bold flex items-center justify-center text-sm">{initials}</div>
                <div>
                  <p className="font-bold text-sm">{user.name}</p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
              </div>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">My Dashboard</Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="default" className="w-full bg-brand hover:bg-brand-dark">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

