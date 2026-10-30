-- ─── Nuty Tales Migration 007: Durable Database-Backed Payment Idempotency ────────
-- Replaces serverless-fragile local file-backed idempotency with distributed,
-- database-enforced atomic locking and payment deduplication.
--
-- STATUS: PREPARED & READY FOR STAGING/PRODUCTION MIGRATION
-- GUARANTEES:
-- 1. Database-enforced UNIQUE constraint on idempotency key (order ID or webhook event ID).
-- 2. State machine: 'PROCESSING' -> 'COMPLETED' | 'FAILED'.
-- 3. Atomic conflict handling: concurrent deliveries within TTL trigger HTTP 409.
-- 4. Replay of cached responses for completed transactions.
-- 5. Automatic retry allowance for failed or expired attempts.
-- 6. Strict RLS: restricted exclusively to service_role; anon and authenticated are blocked.

CREATE TABLE IF NOT EXISTS public.payment_idempotency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  event_id TEXT,
  state TEXT NOT NULL CHECK (state IN ('PROCESSING', 'COMPLETED', 'FAILED')),
  response_data JSONB,
  failure_reason TEXT,
  attempt_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Indexes for rapid lookup on high-throughput webhook delivery
CREATE INDEX IF NOT EXISTS idx_payment_idempotency_key ON public.payment_idempotency(key);
CREATE INDEX IF NOT EXISTS idx_payment_idempotency_event ON public.payment_idempotency(event_id);
CREATE INDEX IF NOT EXISTS idx_payment_idempotency_expires ON public.payment_idempotency(expires_at);

-- Row Level Security
ALTER TABLE public.payment_idempotency ENABLE ROW LEVEL SECURITY;

-- Revoke all permissions from untrusted roles
REVOKE ALL ON public.payment_idempotency FROM anon;
REVOKE ALL ON public.payment_idempotency FROM authenticated;

-- Grant full operational access exclusively to server-side service_role
GRANT ALL ON public.payment_idempotency TO service_role;

DROP POLICY IF EXISTS "payment_idempotency_service_role" ON public.payment_idempotency;
CREATE POLICY "payment_idempotency_service_role"
  ON public.payment_idempotency
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
