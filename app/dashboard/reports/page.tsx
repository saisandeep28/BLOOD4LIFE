'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText, Activity, Droplet, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { InventoryChart } from '@/components/charts/inventory-chart';

export default function ReportsPage() {
  const { user, isDonor, isHospital, isBloodBank } = useAuth();
  
  const { data: donationsData, isLoading: isLoadingDonations } = useQuery({
    queryKey: ['reports', 'donations', user?._id],
    queryFn: () => api.get('/reports/donations').then(res => res.data),
    enabled: !!user,
  });

  const { data: inventoryData, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['reports', 'inventory', user?._id],
    queryFn: () => api.get('/reports/inventory').then(res => res.data),
    enabled: !!user && (isHospital || isBloodBank),
  });

  const handleExport = async (type: string) => {
    try {
      const res = await api.get('/reports/export', { params: { type } });
      if (res.data?.downloadUrl) {
        toast.success(`${type} report generated successfully.`);
        window.open(res.data.downloadUrl, '_blank');
      } else {
        toast.success(`Mock ${type} export successful`);
      }
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-neutral-500">View and export your data.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand" />
              Donation Activity
            </CardTitle>
            <CardDescription>Overview of your donation history and impact.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDonations ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <p className="text-sm font-medium text-neutral-500 mb-1">Total Donations</p>
                    <p className="text-3xl font-bold">{donationsData?.summary?.totalDonations || 0}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <p className="text-sm font-medium text-neutral-500 mb-1">Total Volume (ml)</p>
                    <p className="text-3xl font-bold">{donationsData?.summary?.totalVolume || 0}</p>
                  </div>
                </div>
                
                <Button className="w-full" onClick={() => handleExport('donations')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Donation Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {(isHospital || isBloodBank) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-brand" />
                Inventory Status
              </CardTitle>
              <CardDescription>Current blood unit inventory and projections.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingInventory ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                      <p className="text-sm font-medium text-neutral-500 mb-1">Total Units</p>
                      <p className="text-3xl font-bold">{inventoryData?.summary?.totalUnits || 0}</p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">Expiring Soon</p>
                      <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                        {inventoryData?.summary?.expiringSoon || 0}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Blood Group Distribution
                    </h4>
                    {inventoryData?.summary?.byBloodGroup ? (
                      <InventoryChart data={inventoryData.summary.byBloodGroup} />
                    ) : (
                      <div className="h-48 flex items-center justify-center text-sm text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                        Not enough data to display chart
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full" onClick={() => handleExport('inventory')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Inventory Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-neutral-500">
            <FileText className="w-12 h-12 mb-4 text-neutral-300" />
            <p>You haven't exported any reports recently.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
