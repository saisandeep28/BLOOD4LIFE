'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Droplet, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

type AppointmentRecord = {
  id: string;
  facility: string;
  city: string;
  date: string;
  timeSlot: string;
  donationType: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
};

const AP_BLOOD_BANKS = [
  'Govt General Hospital (GGH), Vijayawada',
  'AIIMS Mangalagiri Blood Bank, Guntur',
  'Rotary Club Blood Bank, Visakhapatnam',
  'Govt General Hospital (GGH), Kakinada',
  'Red Cross Society Blood Bank, Tirupati',
  'Rangaraya Medical College Blood Bank, Kakinada',
  'District Head Quarters Hospital, Eluru'
];

export default function AppointmentsPage() {
  const { user, isDonor } = useAuth();
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Form State
  const [selectedBank, setSelectedBank] = useState(AP_BLOOD_BANKS[0]);
  const [donationDate, setDonationDate] = useState('2026-07-30');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [donationType, setDonationType] = useState('Whole Blood');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load appointments
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageKey = `user_appointments_${user?._id || 'active'}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setAppointments(JSON.parse(saved));
        } catch (e) {
          setAppointments([]);
        }
      }
    }
  }, [user?._id]);

  const saveAppointments = (newList: AppointmentRecord[]) => {
    setAppointments(newList);
    if (typeof window !== 'undefined') {
      const storageKey = `user_appointments_${user?._id || 'active'}`;
      localStorage.setItem(storageKey, JSON.stringify(newList));
    }
  };

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newAppt: AppointmentRecord = {
        id: `APT-${Math.floor(10000 + Math.random() * 90000)}`,
        facility: selectedBank,
        city: selectedBank.split(',')[1] || 'Andhra Pradesh',
        date: donationDate,
        timeSlot: timeSlot,
        donationType: donationType,
        status: 'Scheduled',
        createdAt: new Date().toISOString()
      };

      const updated = [newAppt, ...appointments];
      saveAppointments(updated);
      setIsSubmitting(false);
      setIsBookingOpen(false);
      toast.success('Donation appointment scheduled successfully!');
    }, 500);
  };

  const handleCancelAppointment = (id: string) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' as const } : a);
    saveAppointments(updated);
    toast.info('Appointment cancelled.');
  };

  const filteredAppointments = appointments.filter(a => 
    filter === 'upcoming' ? a.status === 'Scheduled' : a.status === 'Completed' || a.status === 'Cancelled'
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-neutral-500">Schedule and manage your blood donation appointments.</p>
        </div>
        {isDonor && (
          <Button onClick={() => setIsBookingOpen(!isBookingOpen)} className="font-semibold">
            {isBookingOpen ? 'Close Booking' : 'Schedule Appointment'}
          </Button>
        )}
      </div>

      {/* Booking Form (Visible when isBookingOpen is true) */}
      {isBookingOpen && (
        <Card className="border-brand/30 shadow-lg bg-white dark:bg-neutral-900 animate-in fade-in slide-in-from-top-2 duration-200">
          <CardHeader className="border-b border-border bg-neutral-50/50 dark:bg-neutral-900/50">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Droplet className="w-5 h-5 text-brand" />
              Schedule Voluntary Blood Donation Appointment
            </CardTitle>
            <p className="text-sm text-neutral-500">Book a verified time slot at an accredited blood bank in your area.</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleScheduleAppointment} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Accredited Blood Center *</label>
                <select 
                  className="w-full h-11 px-4 border border-border rounded-lg bg-background text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  required
                >
                  {AP_BLOOD_BANKS.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Preferred Date *</label>
                  <input 
                    type="date"
                    className="w-full h-11 px-4 border border-border rounded-lg bg-background text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                    value={donationDate}
                    onChange={(e) => setDonationDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Time Slot *</label>
                  <select 
                    className="w-full h-11 px-4 border border-border rounded-lg bg-background text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Donation Component *</label>
                  <select 
                    className="w-full h-11 px-4 border border-border rounded-lg bg-background text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                    value={donationType}
                    onChange={(e) => setDonationType(e.target.value)}
                  >
                    <option value="Whole Blood">Whole Blood</option>
                    <option value="Packed Red Blood Cells (RBC)">Packed Red Cells (RBC)</option>
                    <option value="Single Donor Platelets (SDP)">Platelets (SDP)</option>
                    <option value="Fresh Frozen Plasma (FFP)">Plasma (FFP)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setIsBookingOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-brand hover:bg-brand/90 text-white font-semibold px-6">
                  {isSubmitting ? 'Scheduling...' : 'Confirm Appointment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button 
          variant={filter === 'upcoming' ? 'default' : 'outline'} 
          onClick={() => setFilter('upcoming')}
          size="sm"
        >
          Upcoming ({appointments.filter(a => a.status === 'Scheduled').length})
        </Button>
        <Button 
          variant={filter === 'past' ? 'default' : 'outline'} 
          onClick={() => setFilter('past')}
          size="sm"
        >
          Past ({appointments.filter(a => a.status !== 'Scheduled').length})
        </Button>
      </div>

      {/* Appointments Grid */}
      {filteredAppointments.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <Calendar className="w-12 h-12 text-neutral-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No {filter} appointments</h3>
          <p className="text-neutral-500 mb-6 max-w-md">
            {isDonor 
              ? "You don't have any appointments scheduled in this section. Click 'Schedule Appointment' above to book your next donation." 
              : "There are no appointments scheduled for your facility."}
          </p>
          {isDonor && !isBookingOpen && (
            <Button onClick={() => setIsBookingOpen(true)} variant="outline">
              Schedule Appointment
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
              <div className={`h-2 w-full ${appointment.status === 'Scheduled' ? 'bg-brand' : appointment.status === 'Completed' ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-base line-clamp-1">{appointment.facility}</h3>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                      appointment.status === 'Scheduled' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' 
                        : appointment.status === 'Completed' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="bg-brand/10 text-brand px-2 py-1 rounded text-xs font-semibold shrink-0">
                    {appointment.donationType}
                  </div>
                </div>
                
                <div className="space-y-2.5 mb-6 text-sm">
                  <div className="flex items-center text-neutral-700 dark:text-neutral-300">
                    <Calendar className="w-4 h-4 mr-2 text-brand shrink-0" />
                    <strong>{appointment.date}</strong>
                  </div>
                  <div className="flex items-center text-neutral-700 dark:text-neutral-300">
                    <Clock className="w-4 h-4 mr-2 text-brand shrink-0" />
                    <span>{appointment.timeSlot}</span>
                  </div>
                  <div className="flex items-start text-neutral-600 dark:text-neutral-400 text-xs">
                    <MapPin className="w-4 h-4 mr-2 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{appointment.city}</span>
                  </div>
                </div>
                
                {appointment.status === 'Scheduled' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
