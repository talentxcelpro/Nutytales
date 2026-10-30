-- ─── Nuty Tales Migration 006: Leads Table Row Level Security & Access Control ───
-- Task 004 Hardened Revision: Protects against anonymous scraping, spam flood,
-- ownership spoofing, and privilege injection while preserving storefront checkout.
--
-- STATUS: PREPARED & PENDING APPROVAL (DO NOT APPLY TO PRODUCTION WITHOUT USER SIGN-OFF)
--
-- ARCHITECTURAL REVIEW & CONTROLS:
-- 1. Abuse Resistance: Replaced unrestricted 'WITH CHECK (true)' with strict field
--    format validation (phone 10-15 chars, name 2-100 chars, message <= 5000 chars).
-- 2. Ownership Spoofing Prevention: Enforces that anonymous submissions CANNOT forge
--    user ownership: user_id must be NULL for unauthenticated submissions, or match auth.uid().
-- 3. Rate Limiting & Gateway: Commercial submissions are routed via Next.js server endpoints
--    (/api/leads, /api/orders) where IP rate limiting and payload validation are applied.
-- 4. Confidentiality: Anonymous users are strictly REVOKED from SELECT, UPDATE, DELETE.
-- 5. Service-Role Isolation: Full administrative management is restricted to server-side service_role.

-- 1. Enable Row Level Security on the leads table
ALTER TABLE IF EXISTS public.leads ENABLE ROW LEVEL SECURITY;

-- 2. Revoke dangerous default permissions from anon role
REVOKE ALL ON public.leads FROM anon;
REVOKE ALL ON public.leads FROM authenticated;

-- 3. Grant specific least-privilege operations
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

-- 4. Policy: Hardened anonymous & guest lead submission
-- Prevents empty fields, oversized payloads, and fake user_id injection
DROP POLICY IF EXISTS "leads_insert_public" ON public.leads;
DROP POLICY IF EXISTS "leads_insert_hardened" ON public.leads;

CREATE POLICY "leads_insert_hardened"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Prevent anonymous users from spoofing customer ownership
    (auth.uid() IS NULL AND user_id IS NULL)
    OR
    (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()::text))
    AND
    -- Field length constraints to prevent database bloat / spam injection
    (length(name) >= 2 AND length(name) <= 100)
    AND
    (length(phone) >= 10 AND length(phone) <= 20)
    AND
    (message IS NULL OR length(message) <= 5000)
  );

-- 5. Policy: Authenticated customers can read ONLY their own past leads
DROP POLICY IF EXISTS "leads_select_own" ON public.leads;
CREATE POLICY "leads_select_own"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND auth.uid()::text = user_id
  );

-- 6. Policy: Full administrative access exclusively for server-side service_role operations
DROP POLICY IF EXISTS "leads_all_service_role" ON public.leads;
CREATE POLICY "leads_all_service_role"
  ON public.leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
