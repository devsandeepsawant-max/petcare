-- -------------------------------------------------------------
-- DOG GROOMING BUSINESS MANAGEMENT & ONLINE BOOKING MVP SCHEMA
-- -------------------------------------------------------------

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('customer', 'groomer', 'admin')) DEFAULT 'customer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    emergency_contact TEXT,
    internal_notes TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PETS
CREATE TABLE IF NOT EXISTS public.pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    size_category TEXT NOT NULL CHECK (size_category IN ('SMALL', 'MEDIUM', 'LARGE')),
    weight_kg NUMERIC(5,2) NOT NULL DEFAULT 5.0,
    gender TEXT NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    date_of_birth DATE,
    coat_type TEXT NOT NULL DEFAULT 'Short',
    allergies TEXT,
    temperament TEXT NOT NULL DEFAULT 'Friendly',
    special_handling_notes TEXT,
    vaccination_status TEXT NOT NULL CHECK (vaccination_status IN ('UP_TO_DATE', 'EXPIRED', 'NOT_DECLARED')) DEFAULT 'NOT_DECLARED',
    vaccination_doc_url TEXT,
    photo_url TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PET HEALTH RECORDS
CREATE TABLE IF NOT EXISTS public.pet_health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    vet_name TEXT,
    vet_clinic TEXT,
    vet_phone TEXT,
    medical_conditions TEXT,
    known_allergies TEXT,
    sensitivities TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. PET DOCUMENTS
CREATE TABLE IF NOT EXISTS public.pet_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL CHECK (doc_type IN ('VACCINATION', 'MEDICAL', 'REGISTRATION', 'OTHER')),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    image_url TEXT,
    base_duration_mins INTEGER NOT NULL DEFAULT 60,
    requires_assessment BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. SERVICE PRICING (by Pet Size)
CREATE TABLE IF NOT EXISTS public.service_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    pet_size TEXT NOT NULL CHECK (pet_size IN ('SMALL', 'MEDIUM', 'LARGE')),
    base_price NUMERIC(10,2) NOT NULL,
    estimated_duration_mins INTEGER NOT NULL DEFAULT 60,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(service_id, pet_size)
);

-- 8. SERVICE ADDONS
CREATE TABLE IF NOT EXISTS public.service_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    duration_mins INTEGER NOT NULL DEFAULT 15,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. GROOMERS
CREATE TABLE IF NOT EXISTS public.groomers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    experience_years INTEGER NOT NULL DEFAULT 2,
    specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. GROOMER AVAILABILITY
CREATE TABLE IF NOT EXISTS public.groomer_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    groomer_id UUID NOT NULL REFERENCES public.groomers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(groomer_id, day_of_week, start_time)
);

-- 11. APPOINTMENTS
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_code TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE RESTRICT,
    groomer_id UUID REFERENCES public.groomers(id) ON DELETE SET NULL,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW')) DEFAULT 'PENDING',
    pet_size TEXT NOT NULL CHECK (pet_size IN ('SMALL', 'MEDIUM', 'LARGE')),
    base_price NUMERIC(10,2) NOT NULL,
    addons_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    deposit_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    special_instructions TEXT,
    cancellation_reason TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. APPOINTMENT ITEMS (Pricing Snapshots)
CREATE TABLE IF NOT EXISTS public.appointment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('SERVICE', 'ADDON')),
    item_id UUID NOT NULL,
    name TEXT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    duration_mins INTEGER NOT NULL DEFAULT 15,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. GROOMING SESSIONS
CREATE TABLE IF NOT EXISTS public.grooming_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
    groomer_id UUID NOT NULL REFERENCES public.groomers(id) ON DELETE RESTRICT,
    pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE RESTRICT,
    check_in_time TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    coat_condition_notes TEXT,
    behavior_notes TEXT,
    vet_referral_flag BOOLEAN NOT NULL DEFAULT false,
    vet_referral_reason TEXT,
    pre_groom_photo_url TEXT,
    post_groom_photo_url TEXT,
    completed_services TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL CHECK (status IN ('SCHEDULED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED')) DEFAULT 'SCHEDULED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. GROOMING NOTES
CREATE TABLE IF NOT EXISTS public.grooming_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.grooming_sessions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    note_type TEXT NOT NULL CHECK (note_type IN ('CHECK_IN', 'OBSERVATION', 'INCIDENT', 'CUSTOMER_COMMUNICATION', 'COMPLETION')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. GROOMING PHOTOS
CREATE TABLE IF NOT EXISTS public.grooming_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.grooming_sessions(id) ON DELETE CASCADE,
    photo_type TEXT NOT NULL CHECK (photo_type IN ('BEFORE', 'AFTER', 'COAT_CONDITION', 'OTHER')),
    photo_url TEXT NOT NULL,
    caption TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE RESTRICT,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('CASH', 'UPI', 'RAZORPAY')),
    payment_status TEXT NOT NULL CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')) DEFAULT 'PENDING',
    transaction_ref TEXT,
    is_deposit BOOLEAN NOT NULL DEFAULT false,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE RESTRICT,
    invoice_number TEXT NOT NULL UNIQUE,
    subtotal NUMERIC(10,2) NOT NULL,
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL DEFAULT CURRENT_DATE,
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 19. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('BOOKING_CREATED', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'REMINDER', 'GROOMING_COMPLETED', 'PAYMENT_RECEIVED')),
    channel TEXT NOT NULL CHECK (channel IN ('EMAIL', 'WHATSAPP', 'IN_APP')),
    recipient TEXT NOT NULL,
    subject TEXT,
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('QUEUED', 'SENT', 'FAILED')) DEFAULT 'QUEUED',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 20. INCIDENTS (Veterinary and safety concerns)
CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.grooming_sessions(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    groomer_id UUID NOT NULL REFERENCES public.groomers(id),
    incident_type TEXT NOT NULL CHECK (incident_type IN ('SKIN_IRRITATION', 'EAR_INFECTION_NOTICED', 'MATTED_COAT_RISK', 'MINOR_SCRATCH', 'BEHAVIORAL_AGGRESSION', 'OTHER')),
    description TEXT NOT NULL,
    vet_referral_advised BOOLEAN NOT NULL DEFAULT false,
    customer_notified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 21. BUSINESS SETTINGS
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL DEFAULT 'Pawsome Grooming Studio',
    tagline TEXT NOT NULL DEFAULT 'Because Every Dog Deserves a Little Extra Care',
    address TEXT NOT NULL DEFAULT '124 Green Glen Park, Bangalore 560103',
    phone TEXT NOT NULL DEFAULT '+91 98765 43210',
    email TEXT NOT NULL DEFAULT 'contact@pawsomecare.com',
    opening_time TIME NOT NULL DEFAULT '09:00:00',
    closing_time TIME NOT NULL DEFAULT '19:00:00',
    booking_interval_mins INTEGER NOT NULL DEFAULT 30,
    cancellation_hours_window INTEGER NOT NULL DEFAULT 24,
    require_deposit BOOLEAN NOT NULL DEFAULT false,
    deposit_percentage INTEGER NOT NULL DEFAULT 20,
    razorpay_enabled BOOLEAN NOT NULL DEFAULT false,
    upi_enabled BOOLEAN NOT NULL DEFAULT true,
    cash_enabled BOOLEAN NOT NULL DEFAULT true,
    is_demo_mode BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 22. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_appointments_date_groomer ON public.appointments(scheduled_date, groomer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON public.appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_pets_customer ON public.pets(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_appointment ON public.payments(appointment_id);

-- -------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groomers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groomer_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grooming_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read and update their own profile; Admins have full access
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid() OR public.is_admin());

-- Services & Pricing: Publicly readable for active records; Admin editable
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin can manage services" ON public.services FOR ALL USING (public.is_admin());
CREATE POLICY "Public can view pricing" ON public.service_pricing FOR SELECT USING (true);
CREATE POLICY "Public can view addons" ON public.service_addons FOR SELECT USING (is_active = true OR public.is_admin());

-- Pets: Customers can read and manage their own pets; Groomers can view assigned pets; Admins have full access
CREATE POLICY "Customers view own pets" ON public.pets FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Customers manage own pets" ON public.pets FOR ALL USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()) OR public.is_admin()
);

-- Appointments: Customers view own bookings; Groomers view assigned; Admins manage all
CREATE POLICY "Customers view own appointments" ON public.appointments FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Groomers view assigned appointments" ON public.appointments FOR SELECT USING (
  groomer_id IN (SELECT id FROM public.groomers WHERE user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Admins manage all appointments" ON public.appointments FOR ALL USING (public.is_admin());

-- Business Settings: Publicly readable; Admin editable
CREATE POLICY "Anyone can view business settings" ON public.business_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.business_settings FOR ALL USING (public.is_admin());
