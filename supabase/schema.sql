-- TaskGH Database Schema Definition

-- 1. ENUMS
CREATE TYPE booking_status AS ENUM ('pending', 'assessing', 'quoted', 'accepted', 'completed', 'cancelled');
CREATE TYPE booking_type AS ENUM ('fixed', 'assessment');
CREATE TYPE payment_status AS ENUM ('pending', 'held_in_escrow', 'released', 'refunded');

-- 2. TABLES

-- Extended User Profiles (Links 1:1 with auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE,
  is_tasker BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tasker Specific Data
CREATE TABLE public.tasker_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  location TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews_count INT DEFAULT 0,
  tasks_completed INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE, -- Ghana Card Verification
  skills TEXT[] -- Array of service UUIDs or strings
);

-- Services Categories
CREATE TABLE public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2),
  icon_name TEXT
);

-- Bookings (The core transaction)
CREATE TABLE public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) NOT NULL,
  tasker_id UUID REFERENCES public.tasker_profiles(id) NOT NULL,
  service_id UUID REFERENCES public.services(id),
  type booking_type NOT NULL,
  status booking_status DEFAULT 'pending',
  description TEXT,
  address TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  quoted_price DECIMAL(10,2), -- The final agreed price
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Escrow Payments
CREATE TABLE public.escrow_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  momo_number TEXT,
  network_provider TEXT,
  status payment_status DEFAULT 'pending',
  paystack_reference TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS (Row Level Security) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Note: We will configure specific RLS policies once the backend is hooked up securely.
