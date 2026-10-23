-- ==============================================================================
-- NUTY TALES STAYS — GLOBAL HOSPITALITY PLATFORM DATABASE SCHEMA (IDEMPOTENT)
-- Supabase Project: qezkjbzmtfjjmqgzgili
-- Lifecycle: DISCOVER → SEARCH → CONCIERGE → BOOK → HOST → SERVICE → RECONCILE
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Hosts Profile & Verification Records
CREATE TABLE IF NOT EXISTS public.stay_hosts (
  id TEXT PRIMARY KEY DEFAULT ('HOST-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  legal_name TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  identity_verified BOOLEAN NOT NULL DEFAULT FALSE,
  property_deed_verified BOOLEAN NOT NULL DEFAULT FALSE,
  superhost_status BOOLEAN NOT NULL DEFAULT FALSE,
  response_rate_percent INTEGER NOT NULL DEFAULT 98,
  response_time_minutes INTEGER NOT NULL DEFAULT 15,
  payout_bank_account TEXT,
  payout_ifsc TEXT,
  payout_pan TEXT,
  payout_gstin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Properties / Residences Inventory
CREATE TABLE IF NOT EXISTS public.stay_listings (
  id TEXT PRIMARY KEY DEFAULT ('PROP-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  host_id TEXT REFERENCES public.stay_hosts(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL, -- 'villa', 'estate', 'chalet', 'houseboat', 'penthouse', 'cottage', 'heritage_manor'
  category TEXT NOT NULL,      -- 'orchards', 'corporate_suites', 'ski_chalets', 'houseboats', 'heritage', 'buyouts', 'global'
  secondary_categories JSONB NOT NULL DEFAULT '[]'::JSONB,
  destination TEXT NOT NULL,   -- 'Kashmir', 'Srinagar', 'Gulmarg', 'Pahalgam', 'Delhi-NCR', 'Patna', 'Dubai', 'London'
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  hub_zone TEXT NOT NULL,      -- 'Kashmir' | 'Delhi-NCR' | 'Patna' | 'Global'
  address_line TEXT NOT NULL,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  map_url TEXT,
  
  -- Accommodations & Capacity
  bedrooms INTEGER NOT NULL DEFAULT 1,
  beds INTEGER NOT NULL DEFAULT 1,
  bathrooms NUMERIC(3, 1) NOT NULL DEFAULT 1.0,
  max_guests INTEGER NOT NULL DEFAULT 2,
  square_feet INTEGER,
  wifi_speed_mbps INTEGER NOT NULL DEFAULT 100,
  work_friendly BOOLEAN NOT NULL DEFAULT TRUE,
  curated_collection BOOLEAN NOT NULL DEFAULT TRUE,
  instant_book BOOLEAN NOT NULL DEFAULT TRUE,
  cancellation_policy TEXT NOT NULL DEFAULT 'Flexible', -- 'Flexible', 'Moderate', 'Strict'
  
  -- Pricing & Currency (INR base)
  currency TEXT NOT NULL DEFAULT 'INR',
  base_nightly_price NUMERIC(12, 2) NOT NULL,
  weekend_price NUMERIC(12, 2),
  cleaning_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  estate_buyout_price NUMERIC(12, 2),
  weekly_discount_percent NUMERIC(4, 2) DEFAULT 10.00,
  monthly_discount_percent NUMERIC(4, 2) DEFAULT 25.00,
  
  -- Media & Amenities
  featured_image TEXT NOT NULL,
  gallery_images JSONB NOT NULL DEFAULT '[]'::JSONB,
  amenities JSONB NOT NULL DEFAULT '[]'::JSONB,
  accessibility_features JSONB NOT NULL DEFAULT '[]'::JSONB,
  house_rules JSONB NOT NULL DEFAULT '[]'::JSONB,
  check_in_time TEXT NOT NULL DEFAULT '14:00',
  check_out_time TEXT NOT NULL DEFAULT '11:00',
  
  -- Status & Moderation
  status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'pending_approval', 'suspended'
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Individual Suites / Rooms within Properties
CREATE TABLE IF NOT EXISTS public.stay_rooms (
  id TEXT PRIMARY KEY DEFAULT ('RM-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  listing_id TEXT NOT NULL REFERENCES public.stay_listings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  base_price_per_night NUMERIC(12, 2) NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 2,
  bed_config TEXT NOT NULL,
  size_sq_ft INTEGER,
  amenities JSONB NOT NULL DEFAULT '[]'::JSONB,
  images JSONB NOT NULL DEFAULT '[]'::JSONB,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Reservations & Booking Ledger (Transactional)
CREATE TABLE IF NOT EXISTS public.stay_reservations (
  id TEXT PRIMARY KEY DEFAULT ('RES-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  booking_ref TEXT UNIQUE NOT NULL, -- e.g. NT-STAY-2026-0842
  listing_id TEXT NOT NULL REFERENCES public.stay_listings(id) ON DELETE RESTRICT,
  room_id TEXT REFERENCES public.stay_rooms(id) ON DELETE SET NULL,
  host_id TEXT REFERENCES public.stay_hosts(id) ON DELETE SET NULL,
  guest_user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Guest Details
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  company_name TEXT,
  gstin TEXT,
  special_requests TEXT,
  
  -- Reservation Dates & Guests
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INTEGER NOT NULL,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  infants INTEGER NOT NULL DEFAULT 0,
  total_guests INTEGER NOT NULL,
  is_buyout BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Financial Ledger & Calculation (Anti-Tamper Server Valued)
  currency TEXT NOT NULL DEFAULT 'INR',
  nightly_rate NUMERIC(12, 2) NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL,
  cleaning_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  service_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  gst_tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  add_ons_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_tariff NUMERIC(12, 2) NOT NULL,
  
  -- Payment Status
  payment_mode TEXT NOT NULL DEFAULT 'advance-token', -- 'advance-token', 'full-prepay', 'corporate-po'
  advance_amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  balance_due NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  payment_status TEXT NOT NULL DEFAULT 'PENDING',    -- 'PENDING', 'PAID', 'PARTIALLY_PAID', 'REFUNDED'
  payment_gateway_order_id TEXT,
  payment_gateway_payment_id TEXT,
  
  -- Reservation Status
  status TEXT NOT NULL DEFAULT 'CONFIRMED', -- 'PENDING_HOST', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'COMPLETED'
  cancellation_policy TEXT NOT NULL DEFAULT 'Flexible',
  cancelled_at TIMESTAMPTZ,
  cancellation_refund_amount NUMERIC(12, 2),
  
  selected_add_ons JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for anti-double booking validation
CREATE INDEX IF NOT EXISTS idx_stay_reservations_dates
  ON public.stay_reservations (listing_id, check_in, check_out, status);

-- 5. Verified Guest Reviews & Ratings
CREATE TABLE IF NOT EXISTS public.stay_reviews (
  id TEXT PRIMARY KEY DEFAULT ('REV-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  listing_id TEXT NOT NULL REFERENCES public.stay_listings(id) ON DELETE CASCADE,
  reservation_id TEXT REFERENCES public.stay_reservations(id) ON DELETE SET NULL,
  guest_user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_city TEXT,
  stay_date DATE,
  rating_overall NUMERIC(2, 1) NOT NULL,
  cleanliness NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
  accuracy NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
  communication NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
  location_rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
  checkin_rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
  value_rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
  review_title TEXT,
  review_text TEXT NOT NULL,
  host_response TEXT,
  is_verified_stay BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Collaborative Trip Plans & Shared Wishlists
CREATE TABLE IF NOT EXISTS public.stay_trips (
  id TEXT PRIMARY KEY DEFAULT ('TRIP-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  creator_user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  invited_emails JSONB NOT NULL DEFAULT '[]'::JSONB,
  shortlisted_listing_ids JSONB NOT NULL DEFAULT '[]'::JSONB,
  property_votes JSONB NOT NULL DEFAULT '{}'::JSONB,
  itinerary_days JSONB NOT NULL DEFAULT '[]'::JSONB,
  collaborative_notes JSONB NOT NULL DEFAULT '[]'::JSONB,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Bookable Travel Services Catalogue & Reservations
CREATE TABLE IF NOT EXISTS public.stay_services (
  id TEXT PRIMARY KEY DEFAULT ('SRV-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'transfer', 'culinary', 'excursion', 'wellness', 'gear'
  destination TEXT NOT NULL,
  description TEXT,
  price_per_unit NUMERIC(10, 2) NOT NULL,
  unit_type TEXT NOT NULL DEFAULT 'per_person', -- 'per_person', 'per_vehicle', 'per_day'
  image_url TEXT,
  provider_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.stay_hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stay_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stay_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stay_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stay_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stay_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stay_services ENABLE ROW LEVEL SECURITY;

-- 9. Idempotent RLS Policies
DROP POLICY IF EXISTS "stay_listings_public_select" ON public.stay_listings;
CREATE POLICY "stay_listings_public_select" ON public.stay_listings FOR SELECT USING (true);

DROP POLICY IF EXISTS "stay_rooms_public_select" ON public.stay_rooms;
CREATE POLICY "stay_rooms_public_select" ON public.stay_rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "stay_reviews_public_select" ON public.stay_reviews;
CREATE POLICY "stay_reviews_public_select" ON public.stay_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "stay_services_public_select" ON public.stay_services;
CREATE POLICY "stay_services_public_select" ON public.stay_services FOR SELECT USING (true);

DROP POLICY IF EXISTS "stay_hosts_public_select" ON public.stay_hosts;
CREATE POLICY "stay_hosts_public_select" ON public.stay_hosts FOR SELECT USING (true);

DROP POLICY IF EXISTS "stay_reservations_service_role" ON public.stay_reservations;
CREATE POLICY "stay_reservations_service_role" ON public.stay_reservations FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "stay_reservations_guest_select" ON public.stay_reservations;
CREATE POLICY "stay_reservations_guest_select" ON public.stay_reservations FOR SELECT TO authenticated
  USING (guest_user_id = auth.jwt()->>'sub' OR guest_email = auth.jwt()->>'email');
