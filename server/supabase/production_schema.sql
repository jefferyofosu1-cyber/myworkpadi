-- ==========================================
-- TaskGH Unified Production Schema (Master)
-- Idempotent Migration Script
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" SCHEMA extensions;

-- 2. ENUMS (Safe creation via DO block)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE public.booking_status AS ENUM (
            'requested', 'assessment', 'quoted', 'deposit_paid', 
            'assigned', 'arrived', 'in_progress', 'completed', 
            'confirmed', 'disputed', 'resolved', 'refunded', 'paid',
            'matching_failed'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_type') THEN
        CREATE TYPE public.booking_type AS ENUM ('fixed', 'assessment');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM ('pending', 'held_in_escrow', 'released', 'refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dispute_status') THEN
        CREATE TYPE public.dispute_status AS ENUM ('open', 'investigating', 'resolved');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resolution_outcome') THEN
        CREATE TYPE public.resolution_outcome AS ENUM (
            'FULL_REFUND', 'PARTIAL_REFUND', 'FULL_RELEASE', 
            'RELEASE_WITH_STRIKE', 'REWORK_ASSIGNED', 'REASSIGN_FREE'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dispute_category') THEN
        CREATE TYPE public.dispute_category AS ENUM ('QUALITY', 'NO_SHOW', 'MATERIALS', 'SAFETY');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tasker_onboarding_status') THEN
        CREATE TYPE public.tasker_onboarding_status AS ENUM ('pending', 'in_review', 'active');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role') THEN
        CREATE TYPE public.admin_role AS ENUM ('SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPPORT_ADMIN');
    END IF;
END $$;

-- 3. TABLES

-- Profiles (Core Identity)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone_number TEXT UNIQUE,
  momo_number TEXT,
  momo_provider TEXT, -- 'MTN', 'TELECEL', 'AT'
  residential_area TEXT,
  is_tasker BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  fcm_token TEXT, -- For push notifications
  location_coords extensions.geography(POINT, 4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tasker Specific Profiles
CREATE TABLE IF NOT EXISTS public.tasker_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews_count INT DEFAULT 0,
  tasks_completed INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  skills UUID[], -- Array of service/category IDs
  ghana_card_front_url TEXT,
  ghana_card_back_url TEXT,
  hourly_rate DECIMAL(10,2) DEFAULT 0.00,
  working_hours JSONB DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  service_radius_meters INT DEFAULT 10000,
  strikes INT DEFAULT 0, -- Automated deactivation at 3
  onboarding_status public.tasker_onboarding_status DEFAULT 'pending',
  agreed_to_terms_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Admin Profiles
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  role public.admin_role DEFAULT 'SUPPORT_ADMIN',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Categories (formerly services)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  assessment_fee_ghs DECIMAL(10,2) DEFAULT 300.00,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bookings (12-State Transaction)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) NOT NULL,
  tasker_id UUID REFERENCES public.tasker_profiles(id), -- Can be NULL until assigned
  category_id UUID REFERENCES public.categories(id),
  type public.booking_type NOT NULL DEFAULT 'assessment',
  status public.booking_status DEFAULT 'requested',
  description TEXT, -- Problem description
  location_address TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  location_coords extensions.geography(POINT, 4326),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  assigned_at TIMESTAMP WITH TIME ZONE,
  quoted_price DECIMAL(10,2), -- Final labor cost
  assessment_fee_ghs DECIMAL(10,2) DEFAULT 300.00,
  materials_receipt_url TEXT, -- Photo proof to unblock job start
  matching_rounds INT DEFAULT 0, -- Process 4 tracking
  is_manual_selection BOOLEAN DEFAULT FALSE, -- Premium direct request
  is_rework BOOLEAN DEFAULT FALSE, -- Platform-paid guarantee job
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Escrow Ledger (Process 3 - Audit Trail)
CREATE TABLE IF NOT EXISTS public.escrow_ledger (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount_ghs DECIMAL(10,2) NOT NULL,
  e_type TEXT CHECK (e_type IN ('held', 'released', 'refunded')),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Quotes (For Assessment Flow breakdown)
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  tasker_id UUID REFERENCES public.tasker_profiles(id),
  labor_cost DECIMAL(10,2) NOT NULL,
  materials_cost DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) GENERATED ALWAYS AS (labor_cost + materials_cost) STORED,
  status TEXT DEFAULT 'pending', -- pending, approved, declined, expired, superseded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewee_id UUID REFERENCES public.profiles(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payments (Standardized naming)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  payer_id UUID REFERENCES public.profiles(id),
  amount_ghs DECIMAL(10,2) NOT NULL,
  p_type TEXT CHECK (p_type IN ('assessment', 'deposit')),
  momo_number TEXT,
  momo_provider TEXT,
  status TEXT DEFAULT 'pending', -- pending, success, failed
  momo_reference TEXT UNIQUE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disputes (Process 5)
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  raised_by UUID REFERENCES public.profiles(id),
  category public.dispute_category NOT NULL,
  reason TEXT NOT NULL,
  evidence_urls TEXT[], 
  status public.dispute_status DEFAULT 'open', 
  outcome public.resolution_outcome,
  admin_notes TEXT,
  strike_applied BOOLEAN DEFAULT FALSE,
  sla_expires_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notifications (History for inbox)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. RPCs

-- High-Performance Geo-Matching (Professional Grace Version)
CREATE OR REPLACE FUNCTION public.find_nearby_taskers(
  cust_lat FLOAT, 
  cust_lng FLOAT, 
  req_category_id UUID,
  req_scheduled_at TIMESTAMP WITH TIME ZONE,
  max_radius_meters FLOAT DEFAULT 10000
)
RETURNS TABLE (
  tasker_id UUID,
  phone TEXT,
  rating DECIMAL,
  total_jobs INT,
  distance_meters FLOAT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tp.id as tasker_id,
    p.phone_number as phone,
    tp.rating,
    tp.tasks_completed as total_jobs,
    ST_Distance(
      p.location_coords,
      ST_SetSRID(ST_MakePoint(cust_lng, cust_lat), 4326)::extensions.geography
    ) as distance_meters
  FROM public.tasker_profiles tp
  JOIN public.profiles p ON p.id = tp.id
  WHERE 
    -- 1. Skill check
    req_category_id = ANY(tp.skills) 
    AND tp.is_verified = TRUE
    AND tp.is_available = TRUE
    
    -- 2. Proximity check (Uses smaller of max_radius or tasker's own radius)
    AND ST_DWithin(
      p.location_coords,
      ST_SetSRID(ST_MakePoint(cust_lng, cust_lat), 4326)::extensions.geography,
      LEAST(max_radius_meters, tp.service_radius_meters)
    )

    -- 3. Availability check: No overlapping bookings (+/- 3 hours)
    AND NOT EXISTS (
       SELECT 1 FROM public.bookings b 
       WHERE b.tasker_id = tp.id 
       AND b.status IN ('assigned', 'arrived', 'in_progress')
       AND b.scheduled_at > (req_scheduled_at - INTERVAL '3 hours')
       AND b.scheduled_at < (req_scheduled_at + INTERVAL '3 hours')
    )
  ORDER BY 3 DESC, 5 ASC; 
END;
$$;

-- 5. PERFORMANCE INDICES
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone_number);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tasker_id ON public.bookings(tasker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(momo_reference);

-- 6. SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_ledger ENABLE ROW LEVEL SECURITY;

-- 🛡️ Profiles: Users can read/edit their own data.
CREATE POLICY "Users can view own profile" ON public.profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

-- 🛡️ Tasker Profiles: Public read (for matching/search), self-management.
CREATE POLICY "Tasker profiles are viewable by all users" ON public.tasker_profiles 
FOR SELECT USING (TRUE);

CREATE POLICY "Taskers can edit own profile" ON public.tasker_profiles 
FOR UPDATE USING (auth.uid() = id);

-- 🛡️ Bookings: Critical privacy logic.
-- A booking is visible to the customer who created it OR the tasker assigned to it.
CREATE POLICY "Bookings visible to customer or assigned tasker" ON public.bookings
FOR SELECT USING (
    auth.uid() = customer_id OR 
    auth.uid() = tasker_id
);

CREATE POLICY "Customers can create bookings" ON public.bookings
FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Owners or assigned taskers can update bookings" ON public.bookings
FOR UPDATE USING (
    auth.uid() = customer_id OR 
    auth.uid() = tasker_id
);

-- 🛡️ Payments: Only the payer can see their transaction history.
CREATE POLICY "Payments visible to payer" ON public.payments
FOR SELECT USING (auth.uid() = payer_id);

-- 🛡️ Notifications: Private inbox.
CREATE POLICY "Notifications visible to recipient" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Notifications updateable by recipient" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- 🛡️ Disputes
CREATE POLICY "Involved parties can view disputes" ON public.disputes
FOR SELECT USING (
    auth.uid() = raised_by OR 
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.customer_id = auth.uid() OR b.tasker_id = auth.uid()))
);

-- 🛡️ Admin Access (Safety bypass for authorized roles)
CREATE POLICY "Admins have full access" ON public.profiles
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid() AND is_active = TRUE)
);
-- Note: In a real production setup, more granular admin policies would be defined across all tables.
