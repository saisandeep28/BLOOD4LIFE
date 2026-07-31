'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';
import { RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { STATES_AND_DISTRICTS } from '@/lib/constants/locations';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  phone: z.string().optional(),
  
  // Donor Fields
  age: z.string().optional(),
  gender: z.string().optional(),
  fathersName: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  pincode: z.string().optional(),

  // Blood Bank specific fields
  city: z.string().optional(),
  bloodBankName: z.string().optional(),
  parentHospitalName: z.string().optional(),
  shortName: z.string().optional(),
  category: z.string().optional(),
  contactPerson: z.string().optional(),
  dghsSupported: z.string().optional(),
  licenseNumber: z.string().optional(),
  registrationDate: z.string().optional(),
  licenseStartDate: z.string().optional(),
  licenseEndDate: z.string().optional(),
  helplineNumber: z.string().optional(),
  componentFacility: z.string().optional(),
  apheresisFacility: z.string().optional(),
  beds: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  website: z.string().optional(),

  // Array fields for checkboxes
  donorTypes: z.array(z.string()).optional(),
  donationTypes: z.array(z.string()).optional(),
  componentTypes: z.array(z.string()).optional(),
  bagTypes: z.array(z.string()).optional(),
  ttiTypes: z.array(z.string()).optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// Helper Component for the Accordion Sections
function FormSection({ title, defaultOpen = false, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 bg-white dark:bg-neutral-900 rounded-md border border-border shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center px-4 py-3 bg-[#fdfafb] dark:bg-red-950/20 text-[#a0131c] dark:text-red-400 font-bold text-sm text-left hover:bg-[#faeff1] dark:hover:bg-red-950/40 transition-colors"
      >
        {isOpen ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
        {title}
      </button>
      {isOpen && (
        <div className="p-6 bg-white dark:bg-neutral-950">
          {children}
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const [role, setRole] = useState<'donor' | 'hospital' | 'blood_bank' | null>(null);
  
  // Donor Multi-step state
  const [donorStep, setDonorStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setValue } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      donorTypes: [],
      donationTypes: [],
      componentTypes: [],
      bagTypes: [],
      ttiTypes: [],
    },
  });

  const selectedState = watch('state');

  useEffect(() => {
    if (role === 'donor' && donorStep === 1) {
      generateCaptcha();
    }
  }, [donorStep, role]);

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  const handleGenerateOTP = async () => {
    if (!phone || !/^\+?[1-9]\d{1,14}$/.test(phone)) {
      toast.error('Please enter a valid mobile number with country code (e.g. +91XXXXXXXXXX or 10 digits)');
      return;
    }
    setOtpLoading(true);
    try {
      // Normalize to Indian numbers if 10 digits entered
      const formattedPhone = phone.length === 10 ? `+91${phone}` : phone;
      const res = await api.post('/auth/send-otp', { phone: formattedPhone });
      if (res.success) {
        setOtpSent(true);
        setValue('phone', formattedPhone);
        if (res.data && res.data.smsSent === false) {
          toast.warning(res.data.message || `SMS delivery failed. Use bypass OTP: ${res.data.otp}`, {
            duration: 15000,
          });
        } else {
          toast.success('OTP sent to your mobile phone!');
        }
      }
    } catch (err: any) {
      toast.error(err.error?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleValidateOTP = async () => {
    if (otp.length < 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }
    if (captchaInput !== captchaCode) {
      toast.error('Invalid Captcha. Please try again.');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }
    setOtpLoading(true);
    try {
      const formattedPhone = phone.length === 10 ? `+91${phone}` : phone;
      const res = await api.post('/auth/verify-otp', { phone: formattedPhone, otp });
      if (res.success) {
        setPhoneVerified(true);
        setValue('phone', formattedPhone);
        toast.success('Mobile number verified! Please fill in your details.');
        setDonorStep(2);
      }
    } catch (err: any) {
      toast.error(err.error?.message || 'Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    if (!role) return;

    // Check if user is already logged in or registered with this email/phone
    const activeUser = useAuthStore.getState().user;
    if (activeUser && (activeUser.email.toLowerCase() === data.email.toLowerCase() || (data.phone && activeUser.phone === data.phone))) {
      toast.error('You are already registered! Redirecting to login...', { duration: 4000 });
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return;
    }

    try {
      const payload = {
        ...data,
        role,
        name: role === 'blood_bank' ? (data.bloodBankName || data.name) : data.name,
      };

      let enrichedUser: any = null;
      let token = 'demo_token_' + Date.now();

      try {
        const response = await api.post('/auth/register', payload);
        if (response.success && response.data) {
          enrichedUser = {
            ...response.data.user,
            phone: data.phone || response.data.user.phone,
            age: data.age,
            gender: data.gender,
            fathersName: data.fathersName,
            address: data.address,
            state: data.state,
            district: data.district,
            pincode: data.pincode,
          };
          token = response.data.tokens.accessToken;
        }
      } catch (backendError: any) {
        // If backend explicitly returned 409 or duplicate email/user error, do NOT re-register!
        const errMessage = backendError?.error?.message || backendError?.message || '';
        const statusCode = backendError?.status || backendError?.statusCode;

        if (statusCode === 409 || errMessage.toLowerCase().includes('already registered') || errMessage.toLowerCase().includes('email_exists') || errMessage.toLowerCase().includes('user_already_registered')) {
          toast.error('This email/mobile is already registered! Please log in instead.', { duration: 4000 });
          setTimeout(() => {
            router.push('/login');
          }, 1200);
          return;
        }

        console.warn('Backend connection issue, fallback to session registration:', backendError);
        enrichedUser = {
          _id: 'usr_' + Date.now(),
          name: payload.name,
          email: data.email,
          phone: data.phone,
          role,
          age: data.age,
          gender: data.gender,
          fathersName: data.fathersName,
          address: data.address,
          state: data.state,
          district: data.district,
          pincode: data.pincode,
          isVerified: true,
          isPhoneVerified: true,
        };
      }

      if (enrichedUser) {
        setAuth(enrichedUser, token);
        toast.success('Registration successful! Welcome to BLOOD4LIFE.');
        window.location.href = '/';
      }
    } catch (error: any) {
      toast.error(error.error?.message || 'Failed to register. Please try again.');
    }
  };

  if (!role) {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => router.back()} 
          className="text-sm text-neutral-500 hover:text-foreground cursor-pointer flex items-center gap-1"
          type="button"
        >
          ← Back
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Create an account</h2>
          <p className="text-neutral-500">How would you like to join the BLOOD4LIFE platform?</p>
        </div>

        <div className="grid gap-4">
          <button onClick={() => setRole('donor')} className="flex flex-col items-start p-6 border-2 border-border rounded-card hover:border-brand hover:bg-brand/5 transition-all text-left">
            <span className="text-lg font-bold mb-1">Blood Donor or Recipient</span>
            <span className="text-sm text-neutral-500">Donate blood, track your impact, or request blood for yourself or a family member.</span>
          </button>
          
          <button onClick={() => setRole('hospital')} className="flex flex-col items-start p-6 border-2 border-border rounded-card hover:border-brand hover:bg-brand/5 transition-all text-left">
            <span className="text-lg font-bold mb-1">Hospital / Clinic</span>
            <span className="text-sm text-neutral-500">Manage blood inventory, raise emergency requests, and coordinate with donors.</span>
          </button>

          <button onClick={() => setRole('blood_bank')} className="flex flex-col items-start p-6 border-2 border-border rounded-card hover:border-brand hover:bg-brand/5 transition-all text-left">
            <span className="text-lg font-bold mb-1">Blood Bank</span>
            <span className="text-sm text-neutral-500">Track unit-level inventory, manage expiry, and coordinate inter-bank transfers.</span>
          </button>
        </div>

        <p className="text-center text-sm text-neutral-500 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-brand hover:text-brand-dark">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  // Common input styling class for Blood Bank form
  const inputCls = "w-full h-9 px-3 border border-border rounded-sm bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm";
  const labelCls = "text-[13px] font-medium text-neutral-600 dark:text-neutral-300 block mb-1";

  // Checkbox array options
  const donorTypeOptions = ['Voluntary', 'Replacement', 'Directed', 'Autologous', 'Family', 'Replacement External'];
  const donationTypeOptions = ['Whole Blood', 'Apheresis', 'Leucaperesis', 'Plasmapheresis', 'Plateletpheresis'];
  const componentTypeOptions = ['Whole Blood', 'Packed Red Blood Cells', 'Fresh Frozen Plasma', 'Platelet Concentrate', 'Cryoprecipitate', 'Single Donor Plasma', 'Cryo Poor Plasma'];
  const bagTypeOptions = ['Single (350/450ml)', 'Double (350/450ml)', 'Triple (350/450ml)', 'Quadruple (450 ml) with inline filter', 'Quadruple (450 ml) without inline filter', 'Penta Bag (450 ml)', 'Transfer Bags', 'Apheresis Kits'];
  const ttiTypeOptions = ['HIV 1&2', 'Hepatitis-B', 'Hepatitis-C', 'Syphilis', 'Malaria'];

  return (
    <div className={`space-y-8 mx-auto w-full ${role === 'blood_bank' ? 'max-w-6xl' : 'max-w-4xl'}`}>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <button 
            onClick={() => {
              if (role === 'donor' && donorStep === 2) setDonorStep(1);
              else setRole(null);
            }} 
            className="text-sm text-neutral-500 hover:text-foreground"
            type="button"
          >
            ← Back
          </button>
        </div>
        <h2 className="text-3xl font-normal text-brand tracking-tight mb-2 border-b pb-4">
          {role === 'donor' ? 'Donor Sign-Up' : role === 'hospital' ? 'Register Hospital' : 'Register Blood Bank'}
        </h2>
      </div>

      {role === 'blood_bank' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pb-12">
          
          <FormSection title="Blood Bank Address *" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelCls}>State<span className="text-destructive">*</span></label>
                <select className={inputCls} {...register('state', { onChange: () => setValue('district', '') })}>
                  <option value="">Select State</option>
                  {Object.keys(STATES_AND_DISTRICTS).sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>District<span className="text-destructive">*</span></label>
                <select className={inputCls} {...register('district')} disabled={!selectedState}>
                  <option value="">Select District</option>
                  {selectedState && STATES_AND_DISTRICTS[selectedState]?.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input type="text" placeholder="Enter your city" className={inputCls} {...register('city')} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Blood Bank Details *" defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gap-y-8">
              <div>
                <label className={labelCls}>Blood Bank Name<span className="text-destructive">*</span></label>
                <input type="text" placeholder="Enter blood bank name" className={inputCls} {...register('bloodBankName')} />
              </div>
              <div>
                <label className={labelCls}>Parent Hospital Name</label>
                <input type="text" placeholder="Enter parent hospital name" className={inputCls} {...register('parentHospitalName')} />
              </div>
              <div>
                <label className={labelCls}>Short Name</label>
                <input type="text" placeholder="Enter short name" className={inputCls} {...register('shortName')} />
              </div>

              <div>
                <label className={labelCls}>Category<span className="text-destructive">*</span></label>
                <select className={inputCls} {...register('category')}>
                  <option value="">Select category</option>
                  <option value="government">Government</option>
                  <option value="private">Private</option>
                  <option value="trust">Trust/Charitable</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Contact Person<span className="text-destructive">*</span></label>
                <input type="text" placeholder="Enter name" className={inputCls} {...register('contactPerson')} />
              </div>
              <div>
                <label className={labelCls}>DGHS Supported<span className="text-destructive">*</span></label>
                <select className={inputCls} {...register('dghsSupported')}>
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Email ID<span className="text-destructive">*</span></label>
                <input type="email" placeholder="Enter your email" className={`${inputCls} ${errors.email ? 'border-destructive' : ''}`} {...register('email')} />
              </div>
              <div>
                <label className={labelCls}>Contact Number<span className="text-destructive">*</span></label>
                <input type="text" placeholder="Enter contact number" className={inputCls} {...register('phone')} />
              </div>
              <div>
                <label className={labelCls}>License Number<span className="text-destructive">*</span></label>
                <input type="text" placeholder="Enter license number" className={inputCls} {...register('licenseNumber')} />
              </div>

              <div>
                <label className={labelCls}>Blood Bank First Registration Date<span className="text-destructive">*</span></label>
                <input type="date" className={inputCls} {...register('registrationDate')} />
              </div>
              <div>
                <label className={labelCls}>License Start Date<span className="text-destructive">*</span></label>
                <input type="date" className={inputCls} {...register('licenseStartDate')} />
              </div>
              <div>
                <label className={labelCls}>License End Date<span className="text-destructive">*</span></label>
                <input type="date" className={inputCls} {...register('licenseEndDate')} />
              </div>

              <div>
                <label className={labelCls}>Helpline Number</label>
                <input type="text" placeholder="Enter helpline number" className={inputCls} {...register('helplineNumber')} />
              </div>
              <div>
                <label className={labelCls}>Component Facility<span className="text-destructive">*</span></label>
                <select className={inputCls} {...register('componentFacility')}>
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Apheresis Facility<span className="text-destructive">*</span></label>
                <select className={inputCls} {...register('apheresisFacility')}>
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              
              <div>
                <label className={labelCls}>No. of beds</label>
                <input type="number" placeholder="Enter number of beds" className={inputCls} {...register('beds')} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Postal Address *">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gap-y-8">
              <div>
                <label className={labelCls}>Address 1<span className="text-destructive">*</span></label>
                <input type="text" placeholder="Enter address line 1" className={inputCls} {...register('address1')} />
              </div>
              <div>
                <label className={labelCls}>Address 2</label>
                <input type="text" placeholder="Enter address line 2" className={inputCls} {...register('address2')} />
              </div>
              <div>
                <label className={labelCls}>Pincode<span className="text-destructive">*</span></label>
                <input type="text" placeholder="Enter pincode" className={inputCls} {...register('pincode')} />
              </div>
              <div>
                <label className={labelCls}>Latitude</label>
                <input type="text" placeholder="Enter latitude" className={inputCls} {...register('latitude')} />
              </div>
              <div>
                <label className={labelCls}>Longitude</label>
                <input type="text" placeholder="Enter longitude" className={inputCls} {...register('longitude')} />
              </div>
              <div>
                <label className={labelCls}>Website</label>
                <input type="text" placeholder="Enter website URL" className={inputCls} {...register('website')} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Donor Type *">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {donorTypeOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value={opt} className="w-4 h-4 rounded border-border" {...register('donorTypes')} />
                  <span className="text-[13px]">{opt}</span>
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection title="Donation Type *">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {donationTypeOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value={opt} className="w-4 h-4 rounded border-border" {...register('donationTypes')} />
                  <span className="text-[13px]">{opt}</span>
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection title="Component Type *">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {componentTypeOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value={opt} className="w-4 h-4 rounded border-border" {...register('componentTypes')} />
                  <span className="text-[13px]">{opt}</span>
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection title="Bag Type *">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {bagTypeOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value={opt} className="w-4 h-4 rounded border-border" {...register('bagTypes')} />
                  <span className="text-[13px]">{opt}</span>
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection title="TTI Type *">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {ttiTypeOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" value={opt} className="w-4 h-4 rounded border-border" {...register('ttiTypes')} />
                  <span className="text-[13px]">{opt}</span>
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection title="Account Details *">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelCls}>Password<span className="text-destructive">*</span></label>
                <input type="password" placeholder="Create a password" className={`${inputCls} ${errors.password ? 'border-destructive' : ''}`} {...register('password')} />
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>
            </div>
          </FormSection>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setRole(null)} className="h-9 px-8 rounded-sm bg-[#8b0000] text-white hover:bg-[#6b0000] hover:text-white border-none font-medium">
              Cancel
            </Button>
            <Button type="submit" className="h-9 px-8 rounded-sm bg-[#8b0000] hover:bg-[#6b0000] text-white font-medium" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      ) : role === 'donor' && donorStep === 1 ? (
        // DONOR STEP 1 — Phone OTP Verification
        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 md:p-12 rounded-xl space-y-6">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">Verify Your Mobile Number</h3>
              <p className="text-sm text-neutral-500 mt-1">We will send a 6-digit OTP to confirm your number</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  disabled={otpSent}
                  maxLength={10}
                  className="flex-1 h-10 px-4 border border-border rounded-md bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm"
                />
                <Button
                  onClick={handleGenerateOTP}
                  disabled={otpSent || otpLoading}
                  className="bg-[#d9534f] hover:bg-[#c9302c] h-10 rounded-md font-normal text-sm px-5 whitespace-nowrap"
                >
                  {otpLoading && !otpSent ? 'Sending...' : otpSent ? '✓ Sent' : 'Send OTP'}
                </Button>
              </div>

              {otpSent && (
                <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="font-bold tracking-wider line-through decoration-neutral-400 bg-neutral-200 dark:bg-neutral-800 px-3 py-1.5 rounded text-lg select-none">
                      {captchaCode}
                    </span>
                    <button onClick={generateCaptcha} className="text-[#5cb85c] hover:text-[#4cae4c]" type="button">
                      <RefreshCw className="w-5 h-5 animate-spin-hover" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Captcha Code"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-full h-10 px-4 border border-border rounded-md bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm text-center mb-2"
                  />

                  <p className="text-xs text-neutral-500 text-center">OTP sent to <strong>{phone}</strong>. Please enter code below.</p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 h-10 px-4 border border-border rounded-md bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm text-center tracking-widest font-bold text-lg"
                    />
                    <Button
                      onClick={handleValidateOTP}
                      disabled={otp.length < 6 || otpLoading}
                      className="bg-[#d9534f] hover:bg-[#c9302c] h-10 rounded-md font-normal text-sm px-5"
                    >
                      {otpLoading ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="text-xs text-blue-600 hover:underline block text-center w-full"
                  >
                    Resend OTP / Change number
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : role === 'donor' && donorStep === 2 ? (
        // DONOR STEP 2 UI
        <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral-50 dark:bg-neutral-900/50 p-6 md:p-12 rounded-xl space-y-6">
          <div className="grid grid-cols-[100px_1fr] md:grid-cols-[100px_1fr_120px_1fr] gap-x-4 gap-y-6 items-center">
            
            <label className="text-sm font-bold text-right" htmlFor="name">Name<span className="text-destructive">*</span></label>
            <input 
              id="name" type="text" placeholder="Enter your name"
              className={`w-full h-9 px-3 border rounded-sm bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm ${errors.name ? 'border-destructive' : 'border-border'}`}
              {...register('name')}
            />
            
            <label className="text-sm font-bold text-right" htmlFor="age">Age<span className="text-destructive">*</span></label>
            <input 
              id="age" type="number" placeholder="Enter your Age"
              className="w-full h-9 px-3 border border-border rounded-sm bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm"
              {...register('age')}
            />

            <label className="text-sm font-bold text-right" htmlFor="gender">Gender<span className="text-destructive">*</span></label>
            <select 
              id="gender"
              className="w-full h-9 px-3 border border-border rounded-sm bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm"
              {...register('gender')}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <label className="text-sm font-bold text-right" htmlFor="fathersName">Father's Name<span className="text-destructive">*</span></label>
            <input 
              id="fathersName" type="text" placeholder="Father's Name"
              className="w-full h-9 px-3 border border-border rounded-sm bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm"
              {...register('fathersName')}
            />

            <label className="text-sm font-bold text-right" htmlFor="phone">Mobile<span className="text-destructive">*</span></label>
            <input 
              id="phone" type="text" readOnly
              className={`w-full h-9 px-3 border border-border rounded-sm bg-neutral-100 dark:bg-neutral-800 focus:outline-none focus:border-brand text-sm`}
              {...register('phone')}
            />

            <label className="text-sm font-bold text-right" htmlFor="email">Email<span className="text-destructive">*</span></label>
            <input 
              id="email" type="email" placeholder="Enter your Email ID"
              className={`w-full h-9 px-3 border rounded-sm bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm ${errors.email ? 'border-destructive' : 'border-border'}`}
              {...register('email')}
            />
            
            <label className="text-sm font-bold text-right" htmlFor="address">Address</label>
            <input 
              id="address" type="text" placeholder="Enter your Address"
              className="w-full h-9 px-3 border border-border rounded-sm bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm"
              {...register('address')}
            />

            <label className="text-sm font-bold text-right" htmlFor="state">State<span className="text-destructive">*</span></label>
            <select 
              id="state"
              className="w-full h-9 px-3 border border-border rounded-sm bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm"
              {...register('state', {
                onChange: () => setValue('district', '')
              })}
            >
              <option value="">Select State</option>
              {Object.keys(STATES_AND_DISTRICTS).sort().map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <label className="text-sm font-bold text-right" htmlFor="district">District<span className="text-destructive">*</span></label>
            <select 
              id="district"
              className="w-full h-9 px-3 border border-border rounded-sm bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm"
              {...register('district')}
              disabled={!selectedState}
            >
              <option value="">Select District</option>
              {selectedState && STATES_AND_DISTRICTS[selectedState]?.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>

            <label className="text-sm font-bold text-right" htmlFor="pincode">Pincode<span className="text-destructive">*</span></label>
            <input 
              id="pincode" type="text" placeholder="Enter your Pincode"
              className="w-full h-9 px-3 border border-border rounded-sm bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm"
              {...register('pincode')}
            />

            <label className="text-sm font-bold text-right" htmlFor="password">Password<span className="text-destructive">*</span></label>
            <div className="w-full relative">
              <input 
                id="password" type="password" placeholder="Create a password"
                className={`w-full h-9 px-3 border rounded-sm bg-white dark:bg-neutral-950 focus:outline-none focus:border-brand text-sm ${errors.password ? 'border-destructive' : 'border-border'}`}
                {...register('password')}
              />
            </div>
            
            {errors.password && (
               <div className="col-span-2 md:col-span-4 text-sm text-destructive text-center">
                 {errors.password.message}
               </div>
            )}
            
          </div>

          <div className="flex justify-center pt-8">
            <Button type="submit" className="bg-[#d9534f] hover:bg-[#c9302c] h-10 rounded-sm font-normal px-12" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 md:p-12 rounded-xl text-center text-neutral-500">
          Form for this role is not fully implemented in this prototype demo.
        </div>
      )}
    </div>
  );
}
