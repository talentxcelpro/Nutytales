-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (Firebase UID as primary key)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,           -- Firebase UID
  name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  auth_provider TEXT NOT NULL DEFAULT 'google', -- 'google' | 'phone'
  role TEXT NOT NULL DEFAULT 'customer',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS 
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own profile (Firebase UID = JWT sub claim)
CREATE POLICY IF NOT EXISTS "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (
    id = COALESCE(
      (current_setting('request.jwt.claims', true)::jsonb->>'sub'),
      ''
    )
  );

-- Policy: service role can do everything (used by server-side API only)
CREATE POLICY IF NOT EXISTS "profiles_service_role_all"
  ON public.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: users can update their own profile
CREATE POLICY IF NOT EXISTS "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (
    id = COALESCE(
      (current_setting('request.jwt.claims', true)::jsonb->>'sub'),
      ''
    )
  );
