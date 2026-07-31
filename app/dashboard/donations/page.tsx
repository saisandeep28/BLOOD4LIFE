'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Droplet, Calendar, MapPin, Download, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

type DonationRecord = {
  id: string;
  date: string;
  facility: string;
  city: string;
  bloodGroup: string;
  units: number;
  status: 'Completed' | 'Verified';
  certificateId: string;
};

export default function DonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonationRecord[]>([]);

  // Load user's actual stored completed donations from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageKey = `user_donations_${user?._id || 'active'}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Only include completed or verified past donations
          const completed = parsed.filter((d: any) => d.status === 'Completed' || d.status === 'Verified');
          setDonations(completed);
        } catch (e) {
          setDonations([]);
        }
      }
    }
  }, [user?._id]);

  const downloadCertificate = (record: DonationRecord) => {
    toast.info(`Downloading official donation certificate ${record.certificateId}...`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Donations</h1>
          <p className="text-neutral-500">View your completed voluntary blood donation history and certificates.</p>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid gap-4 md:grid-cols-1 max-w-xs">
        <Card className="border-brand/20 bg-gradient-to-br from-white to-red-50/40 dark:from-neutral-900 dark:to-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Completed Donations</CardTitle>
            <Droplet className="w-5 h-5 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-brand">{donations.length}</div>
            <p className="text-xs text-neutral-500 mt-1">Verified completed donations</p>
          </CardContent>
        </Card>
      </div>

      {/* Donation Records */}
      <Card className="shadow-sm">
        <CardHeader className="border-b border-border bg-neutral-50/50 dark:bg-neutral-900/50">
          <CardTitle className="text-lg">Donation Records & Certificates</CardTitle>
          <p className="text-xs text-neutral-500">Past completed blood donation records and authenticated certificates.</p>
        </CardHeader>

        <CardContent className="p-0">
          {donations.length === 0 ? (
            /* Clean Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center py-16">
              <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-4">
                <Droplet className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Blood Donations Recorded Yet</h3>
              <p className="text-neutral-500 text-sm max-w-md">
                You haven't completed any recorded blood donations yet. Complete a voluntary blood donation at an accredited blood bank to see your history and download certificates here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {donations.map((record) => (
                <div key={record.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 font-bold text-sm">
                      {record.bloodGroup}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base">{record.facility}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800">
                          {record.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          Date: <strong className="text-neutral-700 dark:text-neutral-300">{record.date}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          Location: <strong className="text-neutral-700 dark:text-neutral-300">{record.city}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Cert ID: <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-[11px]">{record.certificateId}</code>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadCertificate(record)}
                      className="gap-2 text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Certificate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
