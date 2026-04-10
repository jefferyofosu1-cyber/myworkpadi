-- TaskGH PostGIS & Schema Alignment Migration
-- Run this in your Supabase SQL Editor

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

-- 2. Update Booking Status Enum to support all 12 stages
-- Note: You may need to drop and recreate or use a transaction if the enum is reused.
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'requested';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'assessment';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'quoted';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'deposit_paid';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'assigned';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'arrived';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'in_progress';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'completed';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'confirmed';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'disputed';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'resolved';
ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'refunded';

-- 3. Add Geo-location Columns (PostGIS Geography)
-- We store coordinates as geography(POINT, 4326) for easy distance calc in meters

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location_coords extensions.geography(POINT, 4326);

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS location_coords extensions.geography(POINT, 4326);

ALTER TABLE public.tasker_profiles 
ADD COLUMN IF NOT EXISTS service_radius_meters INT DEFAULT 10000; -- Default 10km

-- 4. RPC for High-Performance Geo-Matching
-- This replaces the manual Haversine math in the backend service
CREATE OR REPLACE FUNCTION public.find_nearby_taskers(
  cust_lat FLOAT, 
  cust_lng FLOAT, 
  category_id UUID
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
    category_id = ANY(tp.skills) 
    AND tp.is_verified = TRUE
    -- Check if within Tasker's specific service radius
    AND ST_DWithin(
      p.location_coords,
      ST_SetSRID(ST_MakePoint(cust_lng, cust_lat), 4326)::extensions.geography,
      tp.service_radius_meters
    )
  ORDER BY 3 DESC, 5 ASC; -- Order by Rating then Distance
END;
$$;

-- 5. Disputes Table (Process 5)
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  raised_by UUID REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  evidence_urls TEXT[], -- Cloudinary URLs
  status TEXT DEFAULT 'open', -- open, under_review, resolved, rejected
  admin_decision TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
