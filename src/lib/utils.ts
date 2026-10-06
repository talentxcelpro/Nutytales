import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  B2B_QUANTITY_THRESHOLD_G,
  LOCATIONS,
  type Location,
} from '@/lib/constants'

// ─── Class Merging ─────────────────────────────────────────────────────────────

/**
 * Merge Tailwind CSS class names safely, resolving conflicts with tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─── Formatting ────────────────────────────────────────────────────────────────

/**
 * Format a number (paise or rupees) as an Indian Rupee string.
 * @example formatPrice(1234.56) → "₹1,234.56"
 * @example formatPrice(1234)    → "₹1,234.00"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a weight in grams to a human-readable string.
 * @example formatWeight(250)    → "250g"
 * @example formatWeight(1000)   → "1kg"
 * @example formatWeight(25000)  → "25kg"
 */
export function formatWeight(grams: number): string {
  if (grams < 1000) return `${grams}g`
  const kg = grams / 1000
  // Show decimal only when it's not a whole number
  const formatted = kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(1)
  return `${formatted}kg`
}

/**
 * Truncate text to maxLength characters, appending an ellipsis when needed.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 1).trimEnd() + '…'
}

// ─── Slug ─────────────────────────────────────────────────────────────────────

/**
 * Convert any string to a URL-safe slug.
 * @example slugify("Kashmiri Almonds (500g)") → "kashmiri-almonds-500g"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // remove non-alphanumeric (except space & dash)
    .trim()
    .replace(/\s+/g, '-')            // spaces → dashes
    .replace(/-+/g, '-')             // collapse consecutive dashes
}

// ─── ID / Number Generators (client-safe, non-DB versions) ───────────────────
//
// These are deterministic helpers used for display / preview purposes.
// For guaranteed-unique sequential IDs backed by the database, use
// src/lib/order-id.ts instead.

function randomPad6(): string {
  return Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0')
}

function currentYear(): number {
  return new Date().getFullYear()
}

/**
 * Generate a client-side order number preview (not DB-sequenced).
 * Format: NT-YYYY-XXXXXX
 */
export function generateOrderNumber(): string {
  return `NT-${currentYear()}-${randomPad6()}`
}

/**
 * Generate a client-side quote number preview (not DB-sequenced).
 * Format: NTQT-YYYY-XXXXXX
 */
export function generateQuoteNumber(): string {
  return `NTQT-${currentYear()}-${randomPad6()}`
}

/**
 * Generate a client-side invoice number preview (not DB-sequenced).
 * Format: NTINV-YYYY-XXXXXX
 */
export function generateInvoiceNumber(): string {
  return `NTINV-${currentYear()}-${randomPad6()}`
}

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

/**
 * Build a WhatsApp click-to-chat URL.
 * @param phone   - Phone number in E.164 format without '+' (e.g. '919876543210')
 * @param message - Pre-filled message (will be URI-encoded)
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const sanitized = phone.replace(/\D/g, '')
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`
}

// ─── GST Calculation ──────────────────────────────────────────────────────────

export interface GSTBreakdown {
  /** Amount before tax */
  base: number
  /** GST amount */
  gst: number
  /** Total inclusive of GST */
  total: number
}

/**
 * Calculate GST breakdown from an amount that is exclusive of tax.
 * @param amount     - Base (pre-tax) amount in ₹
 * @param gstPercent - GST rate as a percentage (e.g. 5 for 5%)
 */
export function calculateGST(
  amount: number,
  gstPercent: number,
): GSTBreakdown {
  const gst = parseFloat(((amount * gstPercent) / 100).toFixed(2))
  const total = parseFloat((amount + gst).toFixed(2))
  return { base: amount, gst, total }
}

// ─── Business Logic ───────────────────────────────────────────────────────────

/**
 * Return true when a quantity qualifies as a B2B / wholesale order.
 * Threshold: 5,000 g (5 kg).
 */
export function isB2BQuantity(grams: number): boolean {
  return grams >= B2B_QUANTITY_THRESHOLD_G
}

/**
 * Retrieve a Location object by its location code.
 * Returns undefined when the code is not recognised.
 */
export function getLocationFromCode(code: string): Location | undefined {
  return LOCATIONS[code.toUpperCase()]
}

// ─── Date / Time ──────────────────────────────────────────────────────────────

/**
 * Format a Date (or ISO string) as a human-readable Indian date.
 * @example formatDate(new Date()) → "6 Oct 2026"
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Format a Date (or ISO string) as a human-readable Indian date + time.
 * @example formatDateTime(new Date()) → "6 Oct 2026, 3:05 PM"
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}
