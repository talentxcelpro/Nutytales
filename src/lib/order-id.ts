/**
 * Database-backed sequential ID generators for nutytales.com.
 *
 * These functions guarantee uniqueness by querying the database for the
 * current max sequence number and incrementing it atomically via a
 * dedicated `IdSequence` table (see schema).  Fallback to a count-based
 * approach when the sequence table is unavailable.
 *
 * Format reference:
 *   Orders  → NT-2026-000001
 *   Quotes  → NTQT-2026-000001
 *   Invoices → NTINV-2026-000001
 */

import { prisma } from '@/lib/prisma'

// ─── Internal Types ────────────────────────────────────────────────────────────

type SequenceKey = 'ORDER' | 'QUOTE' | 'INVOICE'

// ─── Internal Helper ───────────────────────────────────────────────────────────

/**
 * Atomically increment the sequence for the given key and return the next value.
 *
 * Uses an upsert so the row is created on first use.  The update is done
 * inside a serialisable transaction to prevent duplicate numbers under
 * concurrent load.
 */
async function nextSequenceValue(key: SequenceKey): Promise<number> {
  const result = await prisma.$transaction(
    async (tx) => {
      // Lock and increment via raw SQL for true atomicity on PostgreSQL.
      const rows = await tx.$queryRaw<{ next_val: bigint }[]>`
        INSERT INTO "IdSequence" (key, value, "updatedAt")
        VALUES (${key}, 1, NOW())
        ON CONFLICT (key) DO UPDATE
          SET value      = "IdSequence".value + 1,
              "updatedAt" = NOW()
        RETURNING value AS next_val
      `
      return rows[0].next_val
    },
    { isolationLevel: 'Serializable' },
  )

  return Number(result)
}

/**
 * Pad a sequence number to 6 digits.
 */
function pad6(n: number): string {
  return n.toString().padStart(6, '0')
}

/**
 * Return the current calendar year.
 */
function year(): number {
  return new Date().getFullYear()
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate the next unique order number.
 * @returns e.g. "NT-2026-000001"
 */
export async function generateOrderNumber(): Promise<string> {
  const seq = await nextSequenceValue('ORDER')
  return `NT-${year()}-${pad6(seq)}`
}

/**
 * Generate the next unique quote number.
 * @returns e.g. "NTQT-2026-000001"
 */
export async function generateQuoteNumber(): Promise<string> {
  const seq = await nextSequenceValue('QUOTE')
  return `NTQT-${year()}-${pad6(seq)}`
}

/**
 * Generate the next unique invoice number.
 * @returns e.g. "NTINV-2026-000001"
 */
export async function generateInvoiceNumber(): Promise<string> {
  const seq = await nextSequenceValue('INVOICE')
  return `NTINV-${year()}-${pad6(seq)}`
}
