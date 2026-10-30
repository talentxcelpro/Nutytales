-- ─── Nuty Tales Migration 008: Durable Database-Backed PLIE Evidence Storage ───
-- Replaces serverless-ephemeral local file storage with durable, shared
-- database persistence across Vercel Preview serverless instances.
--
-- STATUS: PREPARED & READY FOR STAGING/PRODUCTION
-- GUARANTEES:
-- 1. Shared persistence across independent serverless lambdas.
-- 2. Immutable executionId uniqueness.
-- 3. Strict RLS: REVOKE ALL from anon and authenticated; access restricted exclusively to service_role.

CREATE TABLE IF NOT EXISTS public.plie_evidence_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  environment JSONB NOT NULL,
  results JSONB NOT NULL,
  findings JSONB NOT NULL DEFAULT '[]'::jsonb,
  approval_gates JSONB NOT NULL DEFAULT '[]'::jsonb,
  personas_count INTEGER NOT NULL DEFAULT 0,
  scenarios_count INTEGER NOT NULL DEFAULT 0,
  health_score INTEGER NOT NULL DEFAULT 100,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on execution_id for fast retrieval
CREATE INDEX IF NOT EXISTS idx_plie_evidence_execution_id ON public.plie_evidence_runs(execution_id);
CREATE INDEX IF NOT EXISTS idx_plie_evidence_created ON public.plie_evidence_runs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.plie_evidence_runs ENABLE ROW LEVEL SECURITY;

-- Revoke all permissions from untrusted roles (anon & authenticated)
REVOKE ALL ON public.plie_evidence_runs FROM anon;
REVOKE ALL ON public.plie_evidence_runs FROM authenticated;

-- Grant operational rights exclusively to server-side service_role
GRANT ALL ON public.plie_evidence_runs TO service_role;

DROP POLICY IF EXISTS "plie_evidence_service_role" ON public.plie_evidence_runs;
CREATE POLICY "plie_evidence_service_role"
  ON public.plie_evidence_runs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
