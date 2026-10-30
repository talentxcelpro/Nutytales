import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  acquireIdempotencyLock,
  completeIdempotency,
  failIdempotency,
} from '@/lib/payments/idempotency'
import * as supabaseModule from '@/lib/supabase'

describe('Task 005 / Acceptance #3 & #4: Concurrent Webhook Burst & Stale Lock Recovery', () => {
  const burstEventKey = 'razorpay_event_concurrent_burst_001'
  const staleKey = 'razorpay_order_stale_lock_002'
  const failedRetryKey = 'razorpay_order_failed_retry_003'

  let mockDbRecords: Record<string, any> = {}

  beforeEach(() => {
    vi.restoreAllMocks()
    mockDbRecords = {}

    // Mock atomic Supabase Postgres engine with table locking behavior
    const mockAdmin: any = {
      from: vi.fn().mockImplementation((table: string) => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockImplementation((col: string, val: string) => ({
            maybeSingle: vi.fn().mockImplementation(async () => {
              const rec = mockDbRecords[val]
              return { data: rec ? { ...rec } : null, error: null }
            }),
          })),
        }),
        insert: vi.fn().mockImplementation(async (row: any) => {
          // Simulate Postgres UNIQUE constraint violation (23505)
          if (mockDbRecords[row.key]) {
            return { error: { code: '23505', message: 'duplicate key value violates unique constraint' } }
          }
          mockDbRecords[row.key] = { ...row }
          return { error: null }
        }),
        update: vi.fn().mockImplementation((updates: any) => ({
          eq: vi.fn().mockImplementation(async (col: string, val: string) => {
            if (mockDbRecords[val]) {
              mockDbRecords[val] = { ...mockDbRecords[val], ...updates }
              return { error: null }
            }
            return { error: { message: 'Row not found' } }
          }),
        })),
      })),
    }

    vi.spyOn(supabaseModule, 'getSupabaseAdmin').mockReturnValue(mockAdmin)
  })

  it('1. Concurrently fires 10 independent requests for same Razorpay event ID and guarantees single-processing', async () => {
    // Dispatch 10 simultaneous promises simulating concurrent webhook delivery to 10 Vercel lambdas
    const attempts = Array.from({ length: 10 }, (_, i) =>
      acquireIdempotencyLock(burstEventKey, {
        ttlSeconds: 60,
        eventId: 'evt_pay_captured_998877',
      })
    )

    const results = await Promise.all(attempts)

    // Verify EXACTLY one request acquired the lock
    const acquiredList = results.filter((r) => r.acquired === true)
    const blockedList = results.filter((r) => r.acquired === false)

    expect(acquiredList.length).toBe(1)
    expect(acquiredList[0].state).toBe('NEW')
    expect(acquiredList[0].storageBackend).toBe('database')

    expect(blockedList.length).toBe(9)
    blockedList.forEach((blocked) => {
      expect(blocked.state).toBe('PROCESSING')
      expect(blocked.message).toContain('Concurrent duplicate')
      expect(blocked.storageBackend).toBe('database')
    })
  })

  it('2. Replays cached response for completed webhook deliveries to all subsequent callers', async () => {
    // Acquire lock and simulate order fulfillment
    await acquireIdempotencyLock(burstEventKey, { eventId: 'evt_pay_captured_998877' })
    const fulfillmentPayload = {
      status: 'FULFILLED',
      orderId: 'NT-ORD-2026-990011',
      razorpayPaymentId: 'pay_ABC123456789',
    }

    await completeIdempotency(burstEventKey, fulfillmentPayload)

    // Send 5 subsequent retries from payment gateway
    const retryAttempts = await Promise.all(
      Array.from({ length: 5 }, () =>
        acquireIdempotencyLock(burstEventKey, { eventId: 'evt_pay_captured_998877' })
      )
    )

    retryAttempts.forEach((retry) => {
      expect(retry.acquired).toBe(false)
      expect(retry.state).toBe('COMPLETED')
      expect(retry.cachedResponse).toEqual(fulfillmentPayload)
    })
  })

  it('3. Safely recovers from stale/crashed function locks after TTL expires without deadlock', async () => {
    const shortTtlSeconds = 1 // 1 second lock
    const lock1 = await acquireIdempotencyLock(staleKey, { ttlSeconds: shortTtlSeconds })
    expect(lock1.acquired).toBe(true)
    expect(lock1.record?.attemptCount).toBe(1)

    // Simulate function crash: state remains PROCESSING in database
    // Fast-forward database expires_at into the past (stale lock)
    mockDbRecords[staleKey].expires_at = new Date(Date.now() - 5000).toISOString()

    // Next request arrives: detects expired stale lock, atomically reclaims it, increments attempt counter
    const lock2 = await acquireIdempotencyLock(staleKey, { ttlSeconds: 60 })
    expect(lock2.acquired).toBe(true)
    expect(lock2.state).toBe('PROCESSING')
    expect(lock2.record?.attemptCount).toBe(2)
  })

  it('4. Preserves retryability after failure without duplicating order creation', async () => {
    // Acquire lock
    await acquireIdempotencyLock(failedRetryKey, { ttlSeconds: 60 })

    // Simulate transient network failure during fulfillment
    await failIdempotency(failedRetryKey, 'Downstream courier API timeout')

    // Confirm that subsequent retry can acquire the lock
    const retryLock = await acquireIdempotencyLock(failedRetryKey, { ttlSeconds: 60 })
    expect(retryLock.acquired).toBe(true)
    expect(retryLock.record?.attemptCount).toBe(2)

    // Complete fulfillment on retry
    await completeIdempotency(failedRetryKey, { status: 'FULFILLED', orderId: 'NT-ORD-RETRY-001' })

    // Verify terminal state
    const terminalCheck = await acquireIdempotencyLock(failedRetryKey)
    expect(terminalCheck.acquired).toBe(false)
    expect(terminalCheck.state).toBe('COMPLETED')
    expect(terminalCheck.cachedResponse.orderId).toBe('NT-ORD-RETRY-001')
  })
})
