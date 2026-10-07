-- ==============================================================================
-- NUTTY TALES — PRODUCTION FIREBASE AUTH + SUPABASE PROFILES MIGRATION (IDEMPOTENT)
-- Project: nutty-tales-1c667 | Supabase: qezkjbzmtfjjmqgzgili
-- ==============================================================================

-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles table (Firebase UID as stable external primary key)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,                           -- Stable Firebase UID
  name TEXT,                                     -- Display name
  email TEXT,                                    -- Verified email address
  phone TEXT,                                    -- Verified phone (+91...)
  avatar_url TEXT,                               -- Profile photo / avatar
  auth_provider TEXT NOT NULL DEFAULT 'google',  -- 'google' | 'phone'
  role TEXT NOT NULL DEFAULT 'customer',         -- 'customer' | 'vendor' | 'business_admin' | 'staff'
  is_active BOOLEAN NOT NULL DEFAULT TRUE,       -- Account status
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Enable Row Level Security (Mandatory)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to guarantee idempotent re-runs
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_service_role_all" ON public.profiles;

-- 6. Policy: Authenticated users can SELECT ONLY their own profile
-- Restricts claims strictly to project: nutty-tales-1c667
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    id = COALESCE(
      auth.jwt()->>'sub',
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb)->>'sub'
    )
    AND (
      COALESCE(auth.jwt()->>'aud', (nullif(current_setting('request.jwt.claims', true), '')::jsonb)->>'aud') = 'nutty-tales-1c667'
      OR COALESCE(auth.jwt()->>'iss', (nullif(current_setting('request.jwt.claims', true), '')::jsonb)->>'iss') = 'https://securetoken.google.com/nutty-tales-1c667'
    )
  );

-- 7. Policy: Authenticated users can UPDATE ONLY their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    id = COALESCE(
      auth.jwt()->>'sub',
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb)->>'sub'
    )
    AND (
      COALESCE(auth.jwt()->>'aud', (nullif(current_setting('request.jwt.claims', true), '')::jsonb)->>'aud') = 'nutty-tales-1c667'
      OR COALESCE(auth.jwt()->>'iss', (nullif(current_setting('request.jwt.claims', true), '')::jsonb)->>'iss') = 'https://securetoken.google.com/nutty-tales-1c667'
    )
  )
  WITH CHECK (
    id = COALESCE(
      auth.jwt()->>'sub',
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb)->>'sub'
    )
  );

-- 8. Policy: Privileged Service Role has full access for server-side operations
CREATE POLICY "profiles_service_role_all"
  ON public.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 9. Trigger: Column-Level Protection on UPDATE
-- Strictly prevents users from self-escalating role, toggling is_active, or changing identity fields
CREATE OR REPLACE FUNCTION public.protect_profiles_sensitive_columns()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  caller_role TEXT;
BEGIN
  -- Extract caller JWT role safely
  BEGIN
    caller_role := COALESCE(
      auth.jwt()->>'role',
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb)->>'role',
      ''
    );
  EXCEPTION WHEN OTHERS THEN
    caller_role := '';
  END;

  -- If caller is not service_role, block tampering with protected columns
  IF caller_role != 'service_role' THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Forbidden: Application role cannot be modified by user.';
    END IF;
    IF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
      RAISE EXCEPTION 'Forbidden: User active status cannot be modified by user.';
    END IF;
    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Forbidden: Profile identity UID cannot be altered.';
    END IF;
    IF NEW.auth_provider IS DISTINCT FROM OLD.auth_provider THEN
      RAISE EXCEPTION 'Forbidden: Auth provider cannot be altered.';
    END IF;
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      RAISE EXCEPTION 'Forbidden: Email identity must be verified via server synchronization.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profiles_columns ON public.profiles;
CREATE TRIGGER trg_protect_profiles_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profiles_sensitive_columns();
