'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Shield, Bell, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-neutral-500">Manage your security and account preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand" />
              Security & Credentials
            </CardTitle>
            <CardDescription>Manage your password and authentication settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-border rounded-lg flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Account Password</h4>
                <p className="text-xs text-neutral-500">Keep your account secure with a strong password</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Password update link sent to ' + user?.email)}>Update</Button>
            </div>
            <div className="p-4 border border-border rounded-lg flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Two-Factor Authentication</h4>
                <p className="text-xs text-neutral-500">Add an extra layer of mobile verification</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success('2FA status: Active via Mobile OTP')}>Managed</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Configure how you receive alerts and donor updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-border rounded-lg flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Emergency SMS Alerts</h4>
                <p className="text-xs text-neutral-500">Receive urgent blood need SMS in your district</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success('SMS Alerts Enabled')}>Enabled</Button>
            </div>
            <div className="p-4 border border-border rounded-lg flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Email Updates</h4>
                <p className="text-xs text-neutral-500">Monthly blood donation camp schedules</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success('Email Preferences Updated')}>Subscribed</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
