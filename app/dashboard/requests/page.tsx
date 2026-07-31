'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, MapPin, Droplet, Plus, Filter, Clock } from 'lucide-react';
import Link from 'next/link';

export default function RequestsPage() {
  const { user, isDonor, isHospital, isBloodBank } = useAuth();
  
  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['requests', user?._id],
    queryFn: () => {
      // Donors see nearby/their own requests. Facilities see their own requests.
      const endpoint = isDonor ? '/requests/nearby' : '/requests';
      return api.get(endpoint).then(res => res.data);
    },
    enabled: !!user,
  });

  const requests = Array.isArray(requestsData) ? requestsData : requestsData?.requests || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isDonor ? 'Urgent Needs' : 'Blood Requests'}</h1>
          <p className="text-neutral-500">
            {isDonor 
              ? 'Find people in your area who need your help right now.' 
              : 'Manage your facility\'s blood requests and matches.'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          {(isHospital || isDonor) && (
            <Button asChild>
              <Link href="/dashboard/requests/new">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Link>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-16 h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <Activity className="w-12 h-12 text-neutral-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No active requests</h3>
          <p className="text-neutral-500 mb-6 max-w-md">
            {isDonor 
              ? "There are currently no urgent blood requests in your immediate area." 
              : "Your facility doesn't have any active blood requests."}
          </p>
          {(isHospital || isDonor) && (
            <Button asChild variant="outline">
              <Link href="/dashboard/requests/new">Create a Request</Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request: any) => (
            <Card key={request._id} className={request.priority === 'critical' ? 'border-danger/50 shadow-sm shadow-danger/10' : ''}>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className={`p-6 sm:w-48 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-border ${
                    request.priority === 'critical' ? 'bg-danger/5 text-danger' : 'bg-neutral-50 dark:bg-neutral-900/50'
                  }`}>
                    <Droplet className={`w-8 h-8 mb-2 ${request.priority === 'critical' ? 'text-danger' : 'text-brand'}`} />
                    <div className="text-2xl font-bold">{request.bloodGroup}</div>
                    <div className="text-xs font-medium uppercase tracking-wider mt-1">{request.priority}</div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{request.patientName || 'Anonymous Patient'}</h3>
                        <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs px-2 py-1 rounded capitalize">
                          {request.status?.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start text-sm text-neutral-600 dark:text-neutral-400">
                          <MapPin className="w-4 h-4 mr-2 text-neutral-400 shrink-0 mt-0.5" />
                          <span>{request.hospitalName || 'City Hospital'} • {request.distance ? `${request.distance.toFixed(1)} km away` : 'Location provided'}</span>
                        </div>
                        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                          <Clock className="w-4 h-4 mr-2 text-neutral-400 shrink-0" />
                          <span>Needed by: {formatDate(request.neededBy)}</span>
                        </div>
                        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                          <Activity className="w-4 h-4 mr-2 text-neutral-400 shrink-0" />
                          <span>Units needed: {request.unitsNeeded || 1}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4 border-t border-border mt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {isDonor ? (
                        <Button size="sm" className="bg-brand hover:bg-brand-dark text-white">
                          Respond to Request
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="text-danger hover:text-danger hover:bg-danger/10">
                          Close Request
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
