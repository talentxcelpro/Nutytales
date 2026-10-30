import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import {
  acquireIdempotencyLock,
  completeIdempotency,
  failIdempotency,
} from '@/lib/payments/idempotency'
import * as supabaseModule from '@/lib/supabase'

describe('Phase C / Task 004: Durable Payment Idempotency Engine', () => {
  const testKey = 'test_order_idempotency_key_9999'
  const testEventKey = 'webhook_evt_test_event_12345'

  beforeEach(() => {
    vi.restoreAllMocks()
    // Clear test files if existing
    const dir = path.resolve(process.cwd(), '.data', 'payment-idempotency')
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
      for (const f of files) {
        if (f.endsWith('.json')) {
          fs.unlinkSync(path.join(dir, f))
        }
      }
    }
  })

  it('1. Grants lock for new idempotency key', async () => {
    const lock = await acquireIdempotencyLock(testKey, { ttlSeconds: 60 })
    expect(lock.acquired).toBe(true)
    expect(lock.state).toBe('NEW')
    expect(lock.record?.attemptCount).toBe(1)
  })

  it('2. Blocks concurrent duplicate request when state is PROCESSING', async () => {
    // First call acquires
    const lock1 = await acquireIdempotencyLock(testKey, { ttlSeconds: 60 })
    expect(lock1.acquired).toBe(true)

    // Immediate second call with same key is rejected as concurrent duplicate
    const lock2 = await acquireIdempotencyLock(testKey, { ttlSeconds: 60 })
    expect(lock2.acquired).toBe(false)
    expect(lock2.state).toBe('PROCESSING')
    expect(lock2.message).toContain('Concurrent duplicate')
  })

  it('3. Returns cached response for COMPLETED idempotency key without re-execution', async () => {
    // Acquire and complete
    await acquireIdempotencyLock(testKey, { ttlSeconds: 60 })
    const mockResponse = { success: true, orderId: 'order_rzp_mock_12345', amount: 99900 }
    await completeIdempotency(testKey, mockResponse)

    // Subsequent call returns cached completed record
    const lock = await acquireIdempotencyLock(testKey, { ttlSeconds: 60 })
    expect(lock.acquired).toBe(false)
    expect(lock.state).toBe('COMPLETED')
    expect(lock.cachedResponse).toEqual(mockResponse)
  })

  it('4. Allows retry if prior attempt FAILED', async () => {
    // Acquire and fail
    await acquireIdempotencyLock(testKey, { ttlSeconds: 60 })
    await failIdempotency(testKey, 'Network timeout from payment gateway')

    // Subsequent retry is granted
    const lockRetry = await acquireIdempotencyLock(testKey, { ttlSeconds: 60 })
    expect(lockRetry.acquired).toBe(true)
    expect(lockRetry.record?.attemptCount).toBe(2)
  })

  it('5. Handles webhook event identifiers and prevents duplicate fulfillment', async () => {
    // Acquire webhook lock
    const lock = await acquireIdempotencyLock(testEventKey, {
      ttlSeconds: 60,
      eventId: 'evt_captured_998877',
    })
    expect(lock.acquired).toBe(true)

    // Complete fulfillment
    await completeIdempotency(testEventKey, { status: 'ok', eventId: 'evt_captured_998877' })

    // Duplicate webhook delivery from Razorpay retry
    const duplicateDelivery = await acquireIdempotencyLock(testEventKey, {
      ttlSeconds: 60,
      eventId: 'evt_captured_998877',
    })
    expect(duplicateDelivery.acquired).toBe(false)
    expect(duplicateDelivery.state).toBe('COMPLETED')
  })

  it('6. Operates seamlessly with distributed database backend when Supabase admin is available', async () => {
    const mockDbStore: Record<string, any> = {}

    const mockAdminClient: any = {
      from: vi.fn().mockImplementation((table: string) => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockImplementation((field: string, val: string) => ({
            maybeSingle: vi.fn().mockImplementation(async () => {
              const row = mockDbStore[val]
              return { data: row || null, error: null }
            }),
          })),
        }),
        insert: vi.fn().mockImplementation((data: any) => {
          if (mockDbStore[data.key]) {
            return Promise.resolve({ error: { code: '23505', message: 'duplicate key' } })
          }
          mockDbStore[data.key] = data
          return Promise.resolve({ error: null })
        }),
        update: vi.fn().mockImplementation((data: any) => ({
          eq: vi.fn().mockImplementation(async (field: string, val: string) => {
            if (mockDbStore[val]) {
              mockDbStore[val] = { ...mockDbStore[val], ...data }
            }
            return { error: null }
          }),
        })),
      })),
    }

    vi.spyOn(supabaseModule, 'getSupabaseAdmin').mockReturnValue(mockAdminClient)

    const dbKey = 'db_order_tx_7777'
    const lock = await acquireIdempotencyLock(dbKey, { ttlSeconds: 120 })
    expect(lock.acquired).toBe(true)
    expect(lock.storageBackend).toBe('database')

    // Concurrent call hits database lock
    const concurrentLock = await acquireIdempotencyLock(dbKey, { ttlSeconds: 120 })
    expect(concurrentLock.acquired).toBe(false)
    expect(concurrentLock.state).toBe('PROCESSING')
    expect(concurrentLock.storageBackend).toBe('database')

    // Complete operation in database
    await completeIdempotency(dbKey, { status: 'PAID', razorpay_payment_id: 'pay_991122' })

    // Subsequent retrieval pulls completed cached data from database
    const completedLock = await acquireIdempotencyLock(dbKey, { ttlSeconds: 120 })
    expect(completedLock.acquired).toBe(false)
    expect(completedLock.state).toBe('COMPLETED')
    expect(completedLock.cachedResponse).toEqual({ status: 'PAID', razorpay_payment_id: 'pay_991122' })
    expect(completedLock.storageBackend).toBe('database')
  })
})
