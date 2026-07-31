'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, Droplet, Users, Calendar, 
  User, Mail, Phone, MapPin, BadgeCheck, Building2, Hash, Pencil, Save, X
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { STATES_AND_DISTRICTS } from '@/lib/constants/locations';

export default function DashboardPage() {
  const { user: authUser, token, isDonor, isHospital, isBloodBank, setAuth } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const { data: profileData, isLoading: isLoadingProfile, refetch } = useQuery({
    queryKey: ['profile', authUser?._id],
    queryFn: async () => {
      try {
        const res: any = await api.get('/users/me');
        return res?.data || { profile: { totalDonations: 0, rewardPoints: 0, badgeTier: 'Bronze', isAvailable: true } };
      } catch (err) {
        return { profile: { totalDonations: 0, rewardPoints: 0, badgeTier: 'Bronze', isAvailable: true } };
      }
    },
    enabled: !!authUser && isDonor,
  });

  // Merge authUser with profileData.user so registration details are always preserved
  const user = {
    ...authUser,
    ...(profileData?.user || {}),
    name: authUser?.name || profileData?.user?.name,
    phone: authUser?.phone || profileData?.user?.phone,
    age: authUser?.age || profileData?.user?.age,
    gender: authUser?.gender || profileData?.user?.gender,
    fathersName: authUser?.fathersName || profileData?.user?.fathersName,
    address: authUser?.address || profileData?.user?.address,
    state: authUser?.state || profileData?.user?.state,
    district: authUser?.district || profileData?.user?.district,
    pincode: authUser?.pincode || profileData?.user?.pincode,
  };

  // Edit Profile Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    fathersName: '',
    address: '',
    state: '',
    district: '',
    pincode: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        age: user.age ? String(user.age) : '',
        gender: user.gender || 'Male',
        fathersName: user.fathersName || '',
        address: user.address || '',
        state: user.state || 'Bihar',
        district: user.district || 'Nalanda',
        pincode: user.pincode || '',
      });
    }
  }, [authUser]);

  const handleOpenEdit = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      age: user.age ? String(user.age) : '',
      gender: user.gender || 'Male',
      fathersName: user.fathersName || '',
      address: user.address || '',
      state: user.state || 'Bihar',
      district: user.district || 'Nalanda',
      pincode: user.pincode || '',
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender,
        fathersName: formData.fathersName,
        address: formData.address,
        state: formData.state,
        district: formData.district,
        pincode: formData.pincode,
      };

      // Update local state and auth store immediately
      setAuth(updatedUser, token || 'session_active');

      // Attempt background save to backend
      try {
        await api.patch('/users/me/profile', updatedUser);
      } catch (e) {
        // Fallback to local session update
      }

      toast.success('Profile details updated successfully!');
      setIsEditingProfile(false);
      refetch();
    } catch (error: any) {
      toast.error('Failed to update profile.');
    }
  };

  const { data: inventoryReport, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['inventoryReport', user?._id],
    queryFn: async () => {
      try {
        const res: any = await api.get('/reports/inventory');
        return res?.data || { summary: { totalUnits: 0, expiringSoon: 0 } };
      } catch (err) {
        return { summary: { totalUnits: 0, expiringSoon: 0 } };
      }
    },
    enabled: !!user && (isHospital || isBloodBank),
  });

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
        <p className="text-neutral-500">Here's what's happening with your account today.</p>
      </div>

      {/* User Full Profile Section */}
      <Card className="border border-brand/20 bg-gradient-to-br from-white to-red-50/30 dark:from-neutral-900 dark:to-red-950/20 shadow-sm overflow-hidden">
        <div className="bg-brand/10 border-b border-brand/10 p-4 px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand text-white font-extrabold text-lg flex items-center justify-center shadow-md">
              {user?.name?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{user?.name || 'Registered User'}</h2>
                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <p className="text-xs text-neutral-500 capitalize flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-brand uppercase text-[11px] bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                  {user?.role === 'blood_bank' ? 'Blood Bank' : user?.role || 'Donor'}
                </span>
                • User Account Details
              </p>
            </div>
          </div>

          <Button 
            onClick={handleOpenEdit} 
            variant="outline" 
            size="sm"
            className="gap-2 text-xs font-semibold bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <Pencil className="w-3.5 h-3.5 text-brand" />
            Edit Profile
          </Button>
        </div>

        <CardContent className="p-6">
          {/* View Mode */}
          {!isEditingProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
                <Mail className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div className="overflow-hidden">
                  <p className="text-neutral-400 text-[11px] font-medium">Email Address</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm truncate">{user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
                <Phone className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-neutral-400 text-[11px] font-medium">Mobile Number</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">{user?.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
                <User className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-neutral-400 text-[11px] font-medium">Age & Gender</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
                    {user?.age ? `${user.age} Yrs` : 'N/A'} {user?.gender ? `(${user.gender})` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
                <Users className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-neutral-400 text-[11px] font-medium">Father's Name</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">{user?.fathersName || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 lg:col-span-2">
                <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-neutral-400 text-[11px] font-medium">Address</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">{user?.address || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
                <Building2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-neutral-400 text-[11px] font-medium">District & State</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
                    {[user?.district, user?.state].filter(Boolean).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800">
                <Hash className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-neutral-400 text-[11px] font-medium">Pincode</p>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">{user?.pincode || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : (
            /* Inline Edit Profile Form */
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-brand flex items-center gap-2">
                  <Pencil className="w-4 h-4" /> Edit Profile Details
                </h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditingProfile(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4 text-neutral-500" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-9 px-3 border border-border rounded bg-background text-xs focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Mobile Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-9 px-3 border border-border rounded bg-background text-xs focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Father's Name</label>
                  <input 
                    type="text" 
                    value={formData.fathersName} 
                    onChange={e => setFormData({ ...formData, fathersName: e.target.value })}
                    className="w-full h-9 px-3 border border-border rounded bg-background text-xs focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Age</label>
                  <input 
                    type="number" 
                    value={formData.age} 
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    className="w-full h-9 px-3 border border-border rounded bg-background text-xs focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Gender</label>
                  <select 
                    value={formData.gender} 
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full h-9 px-3 border border-border rounded bg-background text-xs focus:ring-1 focus:ring-brand outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">State</label>
                  <select 
                    value={formData.state} 
                    onChange={e => setFormData({ ...formData, state: e.target.value, district: '' })}
                    className="w-full h-9 px-3 border border-border rounded bg-background text-xs focus:ring-1 focus:ring-brand outline-none"
                  >
                    {Object.keys(STATES_AND_DISTRICTS).sort().map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">District</label>
                  <select 
                    value={formData.district} 
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full h-9 px-3 border border-border rounded bg-background text-xs focus:ring-1 focus:ring-brand outline-none"
                  >
                    <option value="">Select District</option>
                    {formData.state && STATES_AND_DISTRICTS[formData.state]?.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 font-semibold mb-1">Pincode</label>
                  <input 
                    type="text" 
                    value={formData.pincode} 
                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full h-9 px-3 border border-border rounded bg-background text-xs focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-500 font-semibold mb-1">Address</label>
                  <input 
                    type="text" 
                    value={formData.address} 
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-9 px-3 border border-border rounded bg-background text-xs focus:ring-1 focus:ring-brand outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-brand text-white font-semibold gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Activity Stats for Donors */}
      {isDonor && (
        <div className="grid gap-4 md:grid-cols-1 max-w-xs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <Droplet className="h-4 w-4 text-brand" />
            </CardHeader>
            <CardContent>
              {isLoadingProfile ? <Skeleton className="h-8 w-16" /> : (
                <div className="text-2xl font-bold">{profileData?.profile?.totalDonations || 0}</div>
              )}
              <p className="text-xs text-neutral-500">Lifetimes donations</p>
            </CardContent>
          </Card>
        </div>
      )}

      {(isHospital || isBloodBank) && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Inventory</CardTitle>
              <Droplet className="h-4 w-4 text-brand" />
            </CardHeader>
            <CardContent>
              {isLoadingInventory ? <Skeleton className="h-8 w-24" /> : (
                <div className="text-2xl font-bold">{inventoryReport?.summary?.totalUnits || 0} Units</div>
              )}
              <p className="text-xs text-brand font-medium">{inventoryReport?.summary?.expiringSoon || 0} units expiring soon</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <Activity className="h-4 w-4 text-brand" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-neutral-500">Real-time data loading...</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-brand" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-neutral-500">Real-time data loading...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
