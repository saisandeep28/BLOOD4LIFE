'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Droplet, 
  Users, 
  Activity, 
  Calendar, 
  FileText, 
  Settings,
  LogOut,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BrandLogoHeader } from '@/components/ui/brand-logo';

export function Sidebar() {
  const pathname = usePathname();
  const { user, isDonor, isHospital, isBloodBank, logout } = useAuth();

  const getNavItems = () => {
    const commonItems = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    if (isDonor) {
      return [
        commonItems[0],
        { name: 'My Donations', href: '/dashboard/donations', icon: Droplet },
        { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
        commonItems[1],
      ];
    }

    if (isHospital) {
      return [
        commonItems[0],
        { name: 'Blood Requests', href: '/dashboard/requests', icon: Activity },
        { name: 'Inventory', href: '/dashboard/inventory', icon: Droplet },
        { name: 'Donors', href: '/dashboard/donors', icon: Users },
        { name: 'Reports', href: '/dashboard/reports', icon: FileText },
        commonItems[1],
      ];
    }

    if (isBloodBank) {
      return [
        commonItems[0],
        { name: 'Inventory', href: '/dashboard/inventory', icon: Droplet },
        { name: 'Requests', href: '/dashboard/requests', icon: Activity },
        { name: 'Camps', href: '/dashboard/camps', icon: Users },
        { name: 'Reports', href: '/dashboard/reports', icon: FileText },
        commonItems[1],
      ];
    }

    return commonItems;
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white font-bold">
            ❤
          </div>
          <span className="font-bold text-xl tracking-tight text-brand">BLOOD4LIFE</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-button text-sm font-medium transition-colors",
                isActive 
                  ? "bg-brand/10 text-brand" 
                  : "text-neutral-500 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-4">
          <Avatar>
            <AvatarFallback className="bg-brand/20 text-brand">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-medium truncate">{user?.name}</span>
            <span className="text-xs text-neutral-500 truncate capitalize">{user?.role.replace('_', ' ')}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log out
        </Button>
      </div>
    </div>
  );
}
