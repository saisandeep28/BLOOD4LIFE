'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Droplet, Plus, Filter, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function InventoryPage() {
  const { user, isHospital, isBloodBank, isLoading: isAuthLoading } = useAuth();
  
  const { data: inventoryData, isLoading: isInventoryLoading } = useQuery({
    queryKey: ['inventory', user?._id],
    queryFn: () => api.get('/reports/inventory').then(res => res.data),
    enabled: !!user && (isHospital || isBloodBank),
  });

  const isLoading = isAuthLoading || isInventoryLoading;
  const units = inventoryData?.data || [];
  const summary = inventoryData?.summary;

  if (isAuthLoading) {
    return <div className="flex items-center justify-center h-64"><Skeleton className="h-32 w-32 rounded-full" /></div>;
  }

  if (!isHospital && !isBloodBank) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <h3 className="text-xl font-bold mb-2">Access Denied</h3>
        <p className="text-neutral-500">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blood Inventory</h1>
          <p className="text-neutral-500">Manage and monitor your facility's blood units.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button asChild>
            <Link href="/dashboard/inventory/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Unit
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="col-span-1 lg:col-span-2 bg-brand text-brand-foreground border-transparent">
            <CardContent className="p-6 flex items-center justify-between h-full">
              <div>
                <p className="text-sm font-medium opacity-80 mb-1">Total Available Units</p>
                <h2 className="text-4xl font-bold">{summary?.totalUnits || 0}</h2>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Droplet className="w-8 h-8 text-white" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 lg:col-span-3 border-orange-200 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-900/10">
            <CardContent className="p-6 flex items-center gap-4 h-full">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 dark:text-orange-300">Expiring Soon</h3>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  <span className="font-bold">{summary?.expiringSoon || 0}</span> units are expiring within the next 7 days. Please prioritize their use.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>Detailed view of all blood units.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : units.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
              <Droplet className="w-12 h-12 text-neutral-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Inventory is empty</h3>
              <p className="text-neutral-500 mb-6">You don't have any blood units logged in the system.</p>
              <Button asChild>
                <Link href="/dashboard/inventory/add">Add First Unit</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-900/50">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Unit ID</th>
                    <th className="px-6 py-3">Blood Group</th>
                    <th className="px-6 py-3">Component</th>
                    <th className="px-6 py-3">Volume (ml)</th>
                    <th className="px-6 py-3">Collection Date</th>
                    <th className="px-6 py-3">Expiry Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((unit: any) => (
                    <tr key={unit._id} className="border-b border-border last:border-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{unit._id.substring(0, 8)}</td>
                      <td className="px-6 py-4 font-bold text-brand">{unit.bloodGroup}</td>
                      <td className="px-6 py-4 capitalize">{unit.componentType?.replace('_', ' ')}</td>
                      <td className="px-6 py-4">{unit.volumeMl}</td>
                      <td className="px-6 py-4">{formatDate(unit.collectionDate)}</td>
                      <td className="px-6 py-4">
                        <span className={new Date(unit.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'text-danger font-medium' : ''}>
                          {formatDate(unit.expiryDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                          unit.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          unit.status === 'reserved' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}>
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" className="h-8">Manage</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
