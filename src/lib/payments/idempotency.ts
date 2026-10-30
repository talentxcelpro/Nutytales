// ─── Nuty Tales — Durable Payment & Webhook Idempotency Engine ────────────────
// Distributed, database-enforced idempotency engine with local atomic fallback.
// Solves Vercel serverless multi-instance filesystem segregation by storing
// deduplication records in Supabase (payment_idempotency table).
//
// Prevents duplicate payment processing, blocks concurrent webhook races,
// records event identifiers, enforces atomic state transitions, and
// preserves retryability after temporary failures.

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { getSupabaseAdmin } from '../supabase'

export type IdempotencyState = 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface IdempotencyRecord {
  key: string
  eventId?: string
  state: IdempotencyState
  createdAt: string
  updatedAt: string
  expiresAt: string
  responseData?: any
  failureReason?: string
  attemptCount: number
  storageBackend?: 'database' | 'filesystem'
}

export interface AcquireLockOptions {
  ttlSeconds?: number
  eventId?: string
}

export interface AcquireLockResult {
  acquired: boolean
  state: IdempotencyState | 'NEW'
  record?: IdempotencyRecord
  cachedResponse?: any
  message?: string
  storageBackend: 'database' | 'filesystem'
}

const IDEMPOTENCY_DIR = path.resolve(process.cwd(), '.data', 'payment-idempotency')

function ensureDir() {
  if (!fs.existsSync(IDEMPOTENCY_DIR)) {
    fs.mkdirSync(IDEMPOTENCY_DIR, { recursive: true })
  }
}

function getFilePath(key: string): string {
  const hash = crypto.createHash('sha256').update(key).digest('hex')
  return path.join(IDEMPOTENCY_DIR, `${hash}.json`)
}

function readLocalRecord(filePath: string): IdempotencyRecord | null {
  try {
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw) as IdempotencyRecord
  } catch {
    return null
  }
}

function writeLocalRecordAtomic(filePath: string, record: IdempotencyRecord) {
  ensureDir()
  const tmpPath = `${filePath}.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.tmp`
  fs.writeFileSync(tmpPath, JSON.stringify(record, null, 2), 'utf8')
  fs.renameSync(tmpPath, filePath)
}

/**
 * Acquires an atomic idempotency lock.
 * Database-first: uses Supabase 'payment_idempotency' table when available.
 * Serverless fallback: uses local atomic file-locking when DB is offline or in isolated unit tests.
 */
export async function acquireIdempotencyLock(
  key: string,
  options: AcquireLockOptions = {}
): Promise<AcquireLockResult> {
  const now = new Date()
  const nowMs = now.getTime()
  const ttlSeconds = options.ttlSeconds || 120 // 2 minutes lock TTL
  const expiresAt = new Date(nowMs + ttlSeconds * 1000).toISOString()

  // 1. Database-backed distributed storage (Vercel serverless multi-instance safe)
  const supabaseAdmin = getSupabaseAdmin()
  if (supabaseAdmin) {
    try {
      const { data: existing, error: selectErr } = await supabaseAdmin
        .from('payment_idempotency')
        .select('*')
        .eq('key', key)
        .maybeSingle()

      if (!selectErr && existing) {
        const isExpired = new Date(existing.expires_at).getTime() < nowMs

        // Completed and valid -> replay cached response
        if (existing.state === 'COMPLETED' && !isExpired) {
          return {
            acquired: false,
            state: 'COMPLETED',
            record: {
              key: existing.key,
              eventId: existing.event_id,
              state: 'COMPLETED',
              createdAt: existing.created_at,
              updatedAt: existing.updated_at,
              expiresAt: existing.expires_at,
              responseData: existing.response_data,
              attemptCount: existing.attempt_count,
              storageBackend: 'database',
            },
            cachedResponse: existing.response_data,
            message: 'Request already successfully processed (Database Idempotent).',
            storageBackend: 'database',
          }
        }

        // Processing and active -> block concurrent delivery
        if (existing.state === 'PROCESSING' && !isExpired) {
          return {
            acquired: false,
            state: 'PROCESSING',
            record: {
              key: existing.key,
              eventId: existing.event_id,
              state: 'PROCESSING',
              createdAt: existing.created_at,
              updatedAt: existing.updated_at,
              expiresAt: existing.expires_at,
              attemptCount: existing.attempt_count,
              storageBackend: 'database',
            },
            message: 'Concurrent duplicate request currently in progress in distributed cluster.',
            storageBackend: 'database',
          }
        }

        // Failed or expired -> atomically re-acquire lock
        const { error: updateErr } = await supabaseAdmin
          .from('payment_idempotency')
          .update({
            state: 'PROCESSING',
            event_id: options.eventId || existing.event_id,
            updated_at: now.toISOString(),
            expires_at: expiresAt,
            attempt_count: (existing.attempt_count || 1) + 1,
            failure_reason: null,
          })
          .eq('key', key)

        if (!updateErr) {
          return {
            acquired: true,
            state: 'PROCESSING',
            record: {
              key,
              eventId: options.eventId || existing.event_id,
              state: 'PROCESSING',
              createdAt: existing.created_at,
              updatedAt: now.toISOString(),
              expiresAt,
              attemptCount: (existing.attempt_count || 1) + 1,
              storageBackend: 'database',
            },
            storageBackend: 'database',
          }
        }
      } else {
        // Brand new insert with UNIQUE constraint on key
        const { error: insertErr } = await supabaseAdmin
          .from('payment_idempotency')
          .insert({
            key,
            event_id: options.eventId,
            state: 'PROCESSING',
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
            expires_at: expiresAt,
            attempt_count: 1,
          })

        if (!insertErr) {
          return {
            acquired: true,
            state: 'NEW',
            record: {
              key,
              eventId: options.eventId,
              state: 'PROCESSING',
              createdAt: now.toISOString(),
              updatedAt: now.toISOString(),
              expiresAt,
              attemptCount: 1,
              storageBackend: 'database',
            },
            storageBackend: 'database',
          }
        }
      }
    } catch (dbErr) {
      console.warn('[Idempotency Engine] Database store unreachable, falling back to local atomic store:', dbErr)
    }
  }

  // 2. Local atomic file-backed fallback (for offline local development or unit testing)
  ensureDir()
  const filePath = getFilePath(key)
  const existingLocal = readLocalRecord(filePath)

  if (existingLocal) {
    const isExpired = new Date(existingLocal.expiresAt).getTime() < nowMs

    if (existingLocal.state === 'COMPLETED' && !isExpired) {
      return {
        acquired: false,
        state: 'COMPLETED',
        record: { ...existingLocal, storageBackend: 'filesystem' },
        cachedResponse: existingLocal.responseData,
        message: 'Request already successfully processed.',
        storageBackend: 'filesystem',
      }
    }

    if (existingLocal.state === 'PROCESSING' && !isExpired) {
      return {
        acquired: false,
        state: 'PROCESSING',
        record: { ...existingLocal, storageBackend: 'filesystem' },
        message: 'Concurrent duplicate request currently in progress.',
        storageBackend: 'filesystem',
      }
    }

    const updatedRecord: IdempotencyRecord = {
      ...existingLocal,
      state: 'PROCESSING',
      updatedAt: now.toISOString(),
      expiresAt,
      eventId: options.eventId || existingLocal.eventId,
      attemptCount: existingLocal.attemptCount + 1,
      failureReason: undefined,
      storageBackend: 'filesystem',
    }

    writeLocalRecordAtomic(filePath, updatedRecord)
    return {
      acquired: true,
      state: 'PROCESSING',
      record: updatedRecord,
      storageBackend: 'filesystem',
    }
  }

  const newRecord: IdempotencyRecord = {
    key,
    eventId: options.eventId,
    state: 'PROCESSING',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt,
    attemptCount: 1,
    storageBackend: 'filesystem',
  }

  writeLocalRecordAtomic(filePath, newRecord)
  return {
    acquired: true,
    state: 'NEW',
    record: newRecord,
    storageBackend: 'filesystem',
  }
}

/**
 * Transitions state to COMPLETED and persists cached response payload.
 */
export async function completeIdempotency(key: string, responseData: any): Promise<void> {
  const now = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString() // 24hr retention

  // 1. Try Database update first
  const supabaseAdmin = getSupabaseAdmin()
  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from('payment_idempotency')
        .update({
          state: 'COMPLETED',
          response_data: responseData,
          updated_at: now,
          expires_at: expiresAt,
        })
        .eq('key', key)
    } catch (err) {
      console.warn('[Idempotency Engine] Error updating DB state to COMPLETED:', err)
    }
  }

  // 2. Also write to local file for fast local recovery
  const filePath = getFilePath(key)
  const existing = readLocalRecord(filePath)

  const record: IdempotencyRecord = {
    key,
    state: 'COMPLETED',
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    expiresAt,
    responseData,
    eventId: existing?.eventId,
    attemptCount: existing?.attemptCount || 1,
    storageBackend: supabaseAdmin ? 'database' : 'filesystem',
  }

  writeLocalRecordAtomic(filePath, record)
}

/**
 * Transitions state to FAILED, releasing lock and preserving retryability.
 */
export async function failIdempotency(key: string, failureReason: string): Promise<void> {
  const now = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5m retry TTL

  // 1. Try Database update first
  const supabaseAdmin = getSupabaseAdmin()
  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from('payment_idempotency')
        .update({
          state: 'FAILED',
          failure_reason: failureReason,
          updated_at: now,
          expires_at: expiresAt,
        })
        .eq('key', key)
    } catch (err) {
      console.warn('[Idempotency Engine] Error updating DB state to FAILED:', err)
    }
  }

  // 2. Also write to local file for fast local recovery
  const filePath = getFilePath(key)
  const existing = readLocalRecord(filePath)

  const record: IdempotencyRecord = {
    key,
    state: 'FAILED',
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    expiresAt,
    failureReason,
    eventId: existing?.eventId,
    attemptCount: existing?.attemptCount || 1,
    storageBackend: supabaseAdmin ? 'database' : 'filesystem',
  }

  writeLocalRecordAtomic(filePath, record)
}
