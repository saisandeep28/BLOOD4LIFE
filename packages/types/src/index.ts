// ============================================================
// Life For All — Shared Type Definitions
// ============================================================

// ─── Enums ───────────────────────────────────────────────────

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  DONOR = 'donor',
  RECIPIENT = 'recipient',
  HOSPITAL = 'hospital',
  BLOOD_BANK = 'blood_bank',
  VOLUNTEER = 'volunteer',
  NGO = 'ngo',
  GOVERNMENT = 'government',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum ComponentType {
  WHOLE_BLOOD = 'whole_blood',
  PLASMA = 'plasma',
  PLATELETS = 'platelets',
  RBC = 'rbc',
  CRYOPRECIPITATE = 'cryoprecipitate',
}

export enum UrgencyLevel {
  CRITICAL = 'critical',
  URGENT = 'urgent',
  PLANNED = 'planned',
}

export enum RequestStatus {
  SUBMITTED = 'submitted',
  MATCHING = 'matching',
  DONORS_CONFIRMED = 'donors_confirmed',
  IN_PROGRESS = 'in_progress',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum BloodUnitStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  ISSUED = 'issued',
  DISCARDED = 'discarded',
  TRANSFERRED = 'transferred',
  EXPIRED = 'expired',
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export enum NotificationType {
  EMERGENCY_REQUEST = 'emergency_request',
  REQUEST_MATCH = 'request_match',
  APPOINTMENT_REMINDER = 'appointment_reminder',
  STOCK_ALERT = 'stock_alert',
  EXPIRY_ALERT = 'expiry_alert',
  VERIFICATION_UPDATE = 'verification_update',
  DONATION_COMPLETE = 'donation_complete',
  REWARD_MILESTONE = 'reward_milestone',
  SYSTEM_ALERT = 'system_alert',
  BROADCAST = 'broadcast',
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  WHATSAPP = 'whatsapp',
  IN_APP = 'in_app',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

export enum VolunteerTaskStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EN_ROUTE = 'en_route',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum BadgeTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  LIFESAVER = 'lifesaver',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum DonorMatchStatus {
  NOTIFIED = 'notified',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  NO_RESPONSE = 'no_response',
}

export enum AuditAction {
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_SUSPENDED = 'user_suspended',
  USER_VERIFIED = 'user_verified',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_RESET = 'password_reset',
  ROLE_CHANGED = 'role_changed',
  PERMISSION_CHANGED = 'permission_changed',
  ENTITY_VERIFIED = 'entity_verified',
  ENTITY_REJECTED = 'entity_rejected',
  REQUEST_CREATED = 'request_created',
  REQUEST_FULFILLED = 'request_fulfilled',
  INVENTORY_ADDED = 'inventory_added',
  INVENTORY_UPDATED = 'inventory_updated',
  INVENTORY_DISCARDED = 'inventory_discarded',
  TRANSFER_REQUESTED = 'transfer_requested',
  TRANSFER_APPROVED = 'transfer_approved',
  DATA_EXPORTED = 'data_exported',
  SETTINGS_CHANGED = 'settings_changed',
}

// ─── GeoJSON ─────────────────────────────────────────────────

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// ─── User ────────────────────────────────────────────────────

export interface IUser {
  _id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  avatar?: string;
  authProviders: string[];
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFAEnabled: boolean;
  twoFASecret?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  employerId?: string; // for hospital/blood bank staff
  createdAt: Date;
  updatedAt: Date;
}

// ─── Donor Profile ───────────────────────────────────────────

export interface IDonorProfile {
  _id: string;
  userId: string;
  bloodGroup: BloodGroup;
  dob: Date;
  weight: number;
  gender: Gender;
  lastDonationDate?: Date;
  nextEligibleDate?: Date;
  isAvailable: boolean;
  autoResumeDate?: Date;
  healthFlags: string[];
  chronicConditions: string[];
  hemoglobinLevel?: number;
  location: GeoJSONPoint;
  address: string;
  city: string;
  state: string;
  pincode: string;
  rewardPoints: number;
  badgeTier: BadgeTier;
  totalDonations: number;
  donationStreak: number;
  responseRate: number;
  reliabilityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Recipient Profile ───────────────────────────────────────

export interface IRecipientProfile {
  _id: string;
  userId: string;
  savedDonors: string[];
  medicalDocuments: IMedicalDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedicalDocument {
  name: string;
  url: string;
  uploadedAt: Date;
  mimeType: string;
  size: number;
}

// ─── Hospital ────────────────────────────────────────────────

export interface IHospital {
  _id: string;
  userId: string; // admin user who manages this
  name: string;
  registrationNumber: string;
  address: string;
  location: GeoJSONPoint;
  city: string;
  state: string;
  pincode: string;
  contactInfo: {
    phone: string;
    email: string;
    emergencyPhone?: string;
  };
  verificationStatus: VerificationStatus;
  verificationDocuments: string[];
  rejectionReason?: string;
  staff: string[];
  operatingHours?: {
    open: string;
    close: string;
    days: string[];
  };
  facilities: string[];
  specialties: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Blood Bank ──────────────────────────────────────────────

export interface IBloodBank {
  _id: string;
  userId: string;
  name: string;
  registrationNumber: string;
  address: string;
  location: GeoJSONPoint;
  city: string;
  state: string;
  pincode: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  verificationStatus: VerificationStatus;
  verificationDocuments: string[];
  rejectionReason?: string;
  storageUnits: IStorageUnit[];
  operatingHours?: {
    open: string;
    close: string;
    days: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorageUnit {
  unitId: string;
  name: string;
  type: string;
  capacity: number;
  currentOccupancy: number;
  temperature?: number;
}

// ─── Blood Unit ──────────────────────────────────────────────

export interface IBloodUnit {
  _id: string;
  facilityId: string;
  facilityType: 'hospital' | 'blood_bank';
  bloodGroup: BloodGroup;
  componentType: ComponentType;
  unitCode: string;
  collectionDate: Date;
  expiryDate: Date;
  status: BloodUnitStatus;
  storageLocationId?: string;
  donorId?: string;
  donationId?: string;
  quantityMl: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Blood Request ───────────────────────────────────────────

export interface IRequest {
  _id: string;
  requesterId: string;
  requesterRole: UserRole;
  bloodGroup: BloodGroup;
  componentType?: ComponentType;
  unitsNeeded: number;
  unitsFulfilled: number;
  urgencyLevel: UrgencyLevel;
  hospitalId?: string;
  hospitalName?: string;
  patientName?: string;
  patientAge?: number;
  reason?: string;
  status: RequestStatus;
  matchedDonors: IMatchedDonor[];
  location: GeoJSONPoint;
  city: string;
  radiusKm: number;
  escalationLevel: number;
  medicalDocuments?: string[];
  notes?: string;
  fulfilledAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  slaDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMatchedDonor {
  donorId: string;
  donorName: string;
  status: DonorMatchStatus;
  notifiedAt: Date;
  respondedAt?: Date;
  distance?: number;
  matchScore?: number;
}

// ─── Appointment ─────────────────────────────────────────────

export interface IAppointment {
  _id: string;
  donorId: string;
  facilityId: string;
  facilityType: 'hospital' | 'blood_bank';
  facilityName: string;
  slotStart: Date;
  slotEnd: Date;
  status: AppointmentStatus;
  remindersSent: Date[];
  notes?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Donation ────────────────────────────────────────────────

export interface IDonation {
  _id: string;
  donorId: string;
  donorName: string;
  unitId?: string;
  facilityId: string;
  facilityType: 'hospital' | 'blood_bank';
  facilityName: string;
  bloodGroup: BloodGroup;
  componentType: ComponentType;
  date: Date;
  quantityMl: number;
  certificateUrl?: string;
  certificateId?: string;
  hemoglobinLevel?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Notification ────────────────────────────────────────────

export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  payload?: Record<string, unknown>;
  status: NotificationStatus;
  sentAt?: Date;
  readAt?: Date;
  actionUrl?: string;
  isCritical: boolean;
  createdAt: Date;
}

// ─── Volunteer Task ──────────────────────────────────────────

export interface IVolunteerTask {
  _id: string;
  requestId?: string;
  title: string;
  description: string;
  volunteerId?: string;
  assignedBy?: string;
  status: VolunteerTaskStatus;
  location?: GeoJSONPoint;
  city: string;
  acceptedAt?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── NGO Camp ────────────────────────────────────────────────

export interface INGOCamp {
  _id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  description: string;
  location: GeoJSONPoint;
  address: string;
  city: string;
  scheduledDate: Date;
  endDate: Date;
  registeredDonors: string[];
  maxCapacity: number;
  outcomeStats: {
    totalDonors: number;
    totalUnitsCollected: number;
    bloodGroupBreakdown: Record<string, number>;
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  contactInfo: {
    phone: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ─── Audit Log ───────────────────────────────────────────────

export interface IAuditLog {
  _id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditAction;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
  ipAddress: string;
  userAgent?: string;
  timestamp: Date;
}

// ─── Roles & Permissions ─────────────────────────────────────

export interface IRolePermission {
  _id: string;
  roleName: UserRole;
  permissions: string[];
  description: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── API Response Envelope ───────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ─── Auth DTOs ───────────────────────────────────────────────

export interface RegisterDTO {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  userId: string;
  role: UserRole;
  email: string;
}

// ─── Search DTOs ─────────────────────────────────────────────

export interface SearchDonorsDTO {
  bloodGroup?: BloodGroup;
  lat: number;
  lng: number;
  radiusKm?: number;
  page?: number;
  pageSize?: number;
}

export interface SearchFacilityDTO {
  lat?: number;
  lng?: number;
  radiusKm?: number;
  city?: string;
  bloodGroup?: BloodGroup;
  page?: number;
  pageSize?: number;
}

// ─── Dashboard Stats ─────────────────────────────────────────

export interface PlatformStats {
  totalDonors: number;
  totalLivesSaved: number;
  totalRequestsFulfilled: number;
  totalPartnerHospitals: number;
  totalBloodBanks: number;
  activeRequests: number;
}

export interface DonorStats {
  totalDonations: number;
  livesImpacted: number;
  currentStreak: number;
  rewardPoints: number;
  badgeTier: BadgeTier;
  nextEligibleDate?: Date;
  cityDemandTrend: Record<string, number>;
}

export interface InventoryStats {
  totalUnits: number;
  byBloodGroup: Record<string, number>;
  byComponent: Record<string, number>;
  expiringIn7Days: number;
  expiringIn14Days: number;
  lowStockGroups: string[];
}

export interface AdminAnalytics {
  totalUsers: number;
  usersByRole: Record<string, number>;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  donationsThisMonth: number;
  requestsFulfilledThisMonth: number;
  averageTTF: number;
  fulfillmentRate: number;
  wastageRate: number;
  donorRetentionRate: number;
}
