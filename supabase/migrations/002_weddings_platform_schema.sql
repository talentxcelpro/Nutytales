-- ==============================================================================
-- NUTY TALES WEDDINGS — GLOBAL OPERATING PLATFORM DATABASE SCHEMA (IDEMPOTENT)
-- Supabase Project: qezkjbzmtfjjmqgzgili
-- Lifecycle: DISCOVER → PLAN → BUDGET → BOOK → COORDINATE → EXECUTE → RECONCILE
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Wedding Projects (The persistent root entity)
CREATE TABLE IF NOT EXISTS public.wedding_projects (
  id TEXT PRIMARY KEY DEFAULT ('WED-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')),
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  couple_name TEXT NOT NULL,
  partner_one_name TEXT,
  partner_two_name TEXT,
  destination TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 150,
  total_budget NUMERIC(14, 2) NOT NULL DEFAULT 5000000.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  wedding_style TEXT DEFAULT 'Modern Royal Heritage',
  status TEXT NOT NULL DEFAULT 'planning', -- 'planning' | 'booked' | 'executing' | 'completed' | 'archived'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Multi-Event Wedding Timelines
CREATE TABLE IF NOT EXISTS public.wedding_events (
  id TEXT PRIMARY KEY DEFAULT ('EVT-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  project_id TEXT NOT NULL REFERENCES public.wedding_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'roka', 'mehendi', 'haldi', 'sangeet', 'ceremony', 'reception', 'brunch', 'custom'
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  time_zone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  venue_name TEXT,
  venue_id TEXT,
  expected_guests INTEGER NOT NULL DEFAULT 150,
  budget_allocated NUMERIC(12, 2) DEFAULT 0.00,
  dress_code TEXT,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Wedding Venues Directory & Inventory
CREATE TABLE IF NOT EXISTS public.wedding_venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  destination TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  venue_type TEXT NOT NULL, -- 'palace', 'resort', 'orchard', 'beachfront', 'villa', 'mountain', 'ballroom'
  capacity_min INTEGER NOT NULL DEFAULT 50,
  capacity_max INTEGER NOT NULL DEFAULT 1000,
  accommodation_rooms INTEGER DEFAULT 0,
  indoor_outdoor TEXT NOT NULL DEFAULT 'both', -- 'indoor', 'outdoor', 'both'
  price_starting NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  catering_policy TEXT DEFAULT 'In-house or Empanelled Wazwan & Multi-Cuisine',
  rating NUMERIC(3, 2) DEFAULT 4.9,
  reviews_count INTEGER DEFAULT 18,
  verified BOOLEAN DEFAULT TRUE,
  images JSONB NOT NULL DEFAULT '[]'::JSONB,
  amenities JSONB NOT NULL DEFAULT '[]'::JSONB,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Wedding Vendors Directory (Caterers, Decorators, Photographers, Planners, etc.)
CREATE TABLE IF NOT EXISTS public.wedding_vendors (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'planner', 'catering', 'photography', 'decor', 'makeup', 'music', 'transport', 'favors'
  destination TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  starting_price NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  rating NUMERIC(3, 2) DEFAULT 4.9,
  reviews_count INTEGER DEFAULT 24,
  verified BOOLEAN DEFAULT TRUE,
  portfolio JSONB NOT NULL DEFAULT '[]'::JSONB,
  packages JSONB NOT NULL DEFAULT '[]'::JSONB,
  contact_phone TEXT,
  contact_email TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Vendor Enquiries & Quotations Lifecycle
CREATE TABLE IF NOT EXISTS public.wedding_enquiries (
  id TEXT PRIMARY KEY DEFAULT ('ENQ-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  project_id TEXT NOT NULL REFERENCES public.wedding_projects(id) ON DELETE CASCADE,
  vendor_id TEXT REFERENCES public.wedding_vendors(id) ON DELETE SET NULL,
  venue_id TEXT REFERENCES public.wedding_venues(id) ON DELETE SET NULL,
  event_id TEXT REFERENCES public.wedding_events(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  target_date DATE,
  guest_count INTEGER,
  requirements TEXT,
  quote_amount NUMERIC(12, 2),
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'under_review', -- 'draft', 'submitted', 'received', 'under_review', 'accepted', 'declined', 'confirmed', 'cancelled'
  contract_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Budget & Financial Control Line Items
CREATE TABLE IF NOT EXISTS public.wedding_budget_items (
  id TEXT PRIMARY KEY DEFAULT ('BGT-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  project_id TEXT NOT NULL REFERENCES public.wedding_projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'venue', 'catering', 'decor', 'photography', 'trousseau_favors', 'music', 'transport', 'attire', 'contingency', 'other'
  title TEXT NOT NULL,
  planned_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  quoted_amount NUMERIC(12, 2) DEFAULT 0.00,
  contracted_amount NUMERIC(12, 2) DEFAULT 0.00,
  paid_amount NUMERIC(12, 2) DEFAULT 0.00,
  due_date DATE,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'partial', 'paid', 'overdue'
  vendor_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Guest List & RSVP Management
CREATE TABLE IF NOT EXISTS public.wedding_guests (
  id TEXT PRIMARY KEY DEFAULT ('GST-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  project_id TEXT NOT NULL REFERENCES public.wedding_projects(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  household TEXT,
  email TEXT,
  phone TEXT,
  rsvp_status TEXT NOT NULL DEFAULT 'pending', -- 'attending', 'declined', 'pending'
  attending_count INTEGER NOT NULL DEFAULT 1,
  events_attending JSONB NOT NULL DEFAULT '["ceremony", "reception"]'::JSONB,
  meal_preference TEXT DEFAULT 'Wazwan & Multi-Cuisine',
  dietary_restrictions TEXT,
  accommodation_needed BOOLEAN DEFAULT FALSE,
  transport_needed BOOLEAN DEFAULT FALSE,
  table_id TEXT,
  seat_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Seating Tables
CREATE TABLE IF NOT EXISTS public.wedding_tables (
  id TEXT PRIMARY KEY DEFAULT ('TBL-' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0')),
  project_id TEXT NOT NULL REFERENCES public.wedding_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  shape TEXT NOT NULL DEFAULT 'round', -- 'round', 'long', 'head_table', 'lounge'
  capacity INTEGER NOT NULL DEFAULT 8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Task Management & Collaboration Checklist
CREATE TABLE IF NOT EXISTS public.wedding_tasks (
  id TEXT PRIMARY KEY DEFAULT ('TSK-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  project_id TEXT NOT NULL REFERENCES public.wedding_projects(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES public.wedding_events(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  phase TEXT DEFAULT '1_month_out', -- '12_months', '6_months', '3_months', '1_month', 'week_of', 'day_of'
  deadline DATE,
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  assignee_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Project Activity & Audit Timeline
CREATE TABLE IF NOT EXISTS public.wedding_activity_logs (
  id TEXT PRIMARY KEY DEFAULT ('ACT-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')),
  project_id TEXT NOT NULL REFERENCES public.wedding_projects(id) ON DELETE CASCADE,
  actor_name TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'project_created', 'event_updated', 'quote_accepted', 'payment_logged', 'guest_imported', 'conflict_resolved'
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Enable Row-Level Security on all Wedding tables
ALTER TABLE public.wedding_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_activity_logs ENABLE ROW LEVEL SECURITY;

-- 12. Public Directory Read Policies for Venues & Vendors
DROP POLICY IF EXISTS "wedding_venues_public_select" ON public.wedding_venues;
CREATE POLICY "wedding_venues_public_select" ON public.wedding_venues FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "wedding_vendors_public_select" ON public.wedding_vendors;
CREATE POLICY "wedding_vendors_public_select" ON public.wedding_vendors FOR SELECT TO public USING (true);

-- 13. Service Role full bypass policy for backend APIs
DROP POLICY IF EXISTS "wedding_projects_service_role_all" ON public.wedding_projects;
CREATE POLICY "wedding_projects_service_role_all" ON public.wedding_projects FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "wedding_events_service_role_all" ON public.wedding_events;
CREATE POLICY "wedding_events_service_role_all" ON public.wedding_events FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "wedding_enquiries_service_role_all" ON public.wedding_enquiries;
CREATE POLICY "wedding_enquiries_service_role_all" ON public.wedding_enquiries FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "wedding_budget_service_role_all" ON public.wedding_budget_items;
CREATE POLICY "wedding_budget_service_role_all" ON public.wedding_budget_items FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "wedding_guests_service_role_all" ON public.wedding_guests;
CREATE POLICY "wedding_guests_service_role_all" ON public.wedding_guests FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "wedding_tasks_service_role_all" ON public.wedding_tasks;
CREATE POLICY "wedding_tasks_service_role_all" ON public.wedding_tasks FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "wedding_activity_service_role_all" ON public.wedding_activity_logs;
CREATE POLICY "wedding_activity_service_role_all" ON public.wedding_activity_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
