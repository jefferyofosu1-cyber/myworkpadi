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
            'confirmed', 'disputed', 'resolved', 'refunded'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_type') THEN
        CREATE TYPE public.booking_type AS ENUM ('fixed', 'assessment');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM ('pending', 'held_in_escrow', 'released', 'refunded');
    END IF;
END $$;

-- 3. TABLES

-- Profiles (Core Identity)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone_number TEXT UNIQUE,
  momo_number TEXT,
  residential_area TEXT,
  is_tasker BOOLEAN DEFAULT FALSE,
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
  skills UUID[], -- Array of service IDs
  ghana_card_front_url TEXT,
  ghana_card_back_url TEXT,
  hourly_rate DECIMAL(10,2) DEFAULT 0.00,
  working_hours JSONB DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  service_radius_meters INT DEFAULT 10000,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Services Categories
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2),
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bookings (12-State Transaction)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) NOT NULL,
  tasker_id UUID REFERENCES public.tasker_profiles(id), -- Can be NULL until assigned
  service_id UUID REFERENCES public.services(id),
  category_id UUID, -- For flat mapping during matching
  type public.booking_type NOT NULL DEFAULT 'assessment',
  status public.booking_status DEFAULT 'requested',
  description TEXT,
  location_address TEXT,
  location_coords extensions.geography(POINT, 4326),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  quoted_price DECIMAL(10,2),
  assessment_fee_ghs DECIMAL(10,2) DEFAULT 100.00,
  materials_receipt_url TEXT, -- Photo proof to unblock job start
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Quotes (For Assessment Flow breakdown)
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  tasker_id UUID REFERENCES public.tasker_profiles(id),
  labor_cost DECIMAL(10,2) NOT NULL,
  materials_cost DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) GENERATED ALWAYS AS (labor_cost + materials_cost) STORED,
  status TEXT DEFAULT 'pending', -- pending, approved, declined
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reviews (Process 2 Step 6)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewee_id UUID REFERENCES public.profiles(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Escrow Payments
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  momo_number TEXT,
  network_provider TEXT,
  status public.payment_status DEFAULT 'pending',
  paystack_reference TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disputes (Process 5)
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  raised_by UUID REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  evidence_urls TEXT[], 
  status TEXT DEFAULT 'open', 
  admin_decision TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. RPCs

-- High-Performance Geo-Matching
CREATE OR REPLACE FUNCTION public.find_nearby_taskers(
  cust_lat FLOAT, 
  cust_lng FLOAT, 
  req_category_id UUID
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
    -- Check if Tasker offers this service
    req_category_id = ANY(tp.skills) 
    AND tp.is_verified = TRUE
    AND tp.is_available = TRUE
    -- Check if within Tasker's specific service radius
    AND ST_DWithin(
      p.location_coords,
      ST_SetSRID(ST_MakePoint(cust_lng, cust_lat), 4326)::extensions.geography,
      tp.service_radius_meters
    )
  ORDER BY 3 DESC, 5 ASC; 
END;
$$;

-- 5. SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
