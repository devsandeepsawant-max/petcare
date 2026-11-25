export type UserRole = "customer" | "groomer" | "admin";

export type PetSize = "SMALL" | "MEDIUM" | "LARGE";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type PaymentMethod = "CASH" | "UPI" | "RAZORPAY";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  emergency_contact?: string;
  internal_notes?: string;
  is_demo?: boolean;
  created_at: string;
}

export interface Pet {
  id: string;
  customer_id: string;
  name: string;
  breed: string;
  size_category: PetSize;
  weight_kg: number;
  gender: "MALE" | "FEMALE";
  date_of_birth?: string;
  coat_type: string;
  allergies?: string;
  temperament: string;
  special_handling_notes?: string;
  vaccination_status: "UP_TO_DATE" | "EXPIRED" | "NOT_DECLARED";
  vaccination_doc_url?: string;
  photo_url?: string;
  is_demo?: boolean;
  created_at: string;
}

export interface ServicePrice {
  id: string;
  service_id: string;
  pet_size: PetSize;
  base_price: number;
  estimated_duration_mins: number;
}

export interface ServiceAddon {
  id: string;
  service_id?: string;
  name: string;
  description: string;
  price: number;
  duration_mins: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  image_url: string;
  base_duration_mins: number;
  is_active: boolean;
  requires_assessment?: boolean;
  pricing: ServicePrice[];
  addons: ServiceAddon[];
  is_demo?: boolean;
}

export interface Groomer {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar_url?: string;
  experience_years: number;
  specialties: string[];
  is_active: boolean;
  is_demo?: boolean;
}

export interface GroomerAvailability {
  id: string;
  groomer_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday ... 6=Saturday
  start_time: string; // HH:MM:SS
  end_time: string;
  is_active: boolean;
}

export interface AppointmentItem {
  id: string;
  appointment_id: string;
  item_type: "SERVICE" | "ADDON";
  item_id: string;
  name: string;
  unit_price: number;
  duration_mins: number;
}

export interface Appointment {
  id: string;
  reference_code: string;
  customer_id: string;
  pet_id: string;
  groomer_id?: string;
  service_id: string;
  scheduled_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  status: AppointmentStatus;
  pet_size: PetSize;
  base_price: number;
  addons_total: number;
  total_amount: number;
  deposit_amount: number;
  special_instructions?: string;
  cancellation_reason?: string;
  is_demo?: boolean;
  created_at: string;
  // Hydrated helper relationships
  customer?: Customer;
  pet?: Pet;
  groomer?: Groomer;
  service?: Service;
  items?: AppointmentItem[];
}

export interface GroomingSession {
  id: string;
  appointment_id: string;
  groomer_id: string;
  pet_id: string;
  check_in_time?: string;
  started_at?: string;
  completed_at?: string;
  coat_condition_notes?: string;
  behavior_notes?: string;
  vet_referral_flag: boolean;
  vet_referral_reason?: string;
  pre_groom_photo_url?: string;
  post_groom_photo_url?: string;
  completed_services?: string[];
  status: "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED";
}

export interface Payment {
  id: string;
  appointment_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_ref?: string;
  is_deposit: boolean;
  is_demo: boolean;
  created_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  opening_time: string;
  closing_time: string;
  booking_interval_mins: number;
  cancellation_hours_window: number;
  require_deposit: boolean;
  deposit_percentage: number;
  razorpay_enabled: boolean;
  upi_enabled: boolean;
  cash_enabled: boolean;
  is_demo_mode: boolean;
}
