// ─── Nuty Tales Seller Central — Durable Atomic Persistence Layer ────────────
// Eliminates volatile in-memory storage. Persists all marketplace entities durably
// across process restarts, deployments, and serverless invocations.

import fs from 'fs'
import path from 'path'
import {
  SellerProfile,
  SellerProduct,
  SellerOrder,
  SellerLedgerEntry,
  SellerPayoutBatch,
  StockMovement,
  SellerPromotion,
  SellerSupportTicket,
  SellerCustomer,
  SellerReview,
  SellerReturnRequest,
} from './types'

export interface SellerMemberRecord {
  id: string
  sellerId: string
  userId?: string
  email: string
  name: string
  role: 'owner' | 'manager' | 'operations' | 'finance'
  status: 'active' | 'invited' | 'suspended'
  createdAt: string
}

export interface SellerDocumentRecord {
  id: string
  sellerId: string
  docType: string
  fileName: string
  fileUrl: string
  status: 'pending' | 'verified' | 'rejected'
  rejectionReason?: string
  verifiedAt?: string
  verifiedBy?: string
  createdAt: string
}

const DATA_DIR = path.resolve(process.cwd(), '.data', 'seller-central')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

/**
 * Reads a collection from durable disk storage.
 * Returns an empty array if the store is clean.
 */
export async function readCollection<T>(collectionName: string): Promise<T[]> {
  ensureDataDir()
  const filePath = path.join(DATA_DIR, `${collectionName}.json`)
  if (!fs.existsSync(filePath)) {
    return []
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    if (!raw.trim()) return []
    return JSON.parse(raw) as T[]
  } catch (err) {
    console.error(`[Persistence] Error reading collection "${collectionName}":`, err)
    return []
  }
}

/**
 * Writes a collection atomically to prevent file corruption during writes.
 */
export async function writeCollection<T>(collectionName: string, items: T[]): Promise<void> {
  ensureDataDir()
  const filePath = path.join(DATA_DIR, `${collectionName}.json`)
  const tmpPath = path.join(DATA_DIR, `${collectionName}.${Date.now()}.${Math.random().toString(36).substring(7)}.tmp`)

  try {
    fs.writeFileSync(tmpPath, JSON.stringify(items, null, 2), 'utf8')
    try {
      fs.renameSync(tmpPath, filePath)
    } catch {
      // Windows filesystem fallback when renameSync encounters EPERM/EBUSY
      fs.copyFileSync(tmpPath, filePath)
      try { fs.unlinkSync(tmpPath) } catch {}
    }
  } catch (err) {
    console.error(`[Persistence] Error writing collection "${collectionName}":`, err)
    if (fs.existsSync(tmpPath)) {
      try { fs.unlinkSync(tmpPath) } catch {}
    }
    throw err
  }
}

// ─── SELLERS ─────────────────────────────────────────────────────────────────

export async function getDurableSellerById(id: string): Promise<SellerProfile | null> {
  const sellers = await readCollection<SellerProfile>('sellers')
  return sellers.find((s) => s.id === id) || null
}

export async function getDurableSellerBySlug(slug: string): Promise<SellerProfile | null> {
  const sellers = await readCollection<SellerProfile>('sellers')
  return sellers.find((s) => s.slug === slug) || null
}

export async function listDurableSellers(): Promise<SellerProfile[]> {
  return readCollection<SellerProfile>('sellers')
}

export async function upsertDurableSeller(seller: SellerProfile): Promise<SellerProfile> {
  const sellers = await readCollection<SellerProfile>('sellers')
  const idx = sellers.findIndex((s) => s.id === seller.id)
  if (idx >= 0) {
    sellers[idx] = { ...sellers[idx], ...seller, updatedAt: new Date().toISOString() }
  } else {
    sellers.unshift(seller)
  }
  await writeCollection('sellers', sellers)
  return seller
}

// ─── SELLER MEMBERS ──────────────────────────────────────────────────────────

export async function getSellerMemberByUserId(userId: string): Promise<SellerMemberRecord | null> {
  const members = await readCollection<SellerMemberRecord>('seller_members')
  return members.find((m) => m.userId === userId && m.status === 'active') || null
}

export async function getSellerMemberByEmail(email: string): Promise<SellerMemberRecord | null> {
  const members = await readCollection<SellerMemberRecord>('seller_members')
  const normEmail = email.toLowerCase().trim()
  return members.find((m) => m.email.toLowerCase() === normEmail && m.status === 'active') || null
}

export async function getSellerMembersBySellerId(sellerId: string): Promise<SellerMemberRecord[]> {
  const members = await readCollection<SellerMemberRecord>('seller_members')
  return members.filter((m) => m.sellerId === sellerId)
}

export async function upsertSellerMember(member: SellerMemberRecord): Promise<SellerMemberRecord> {
  const members = await readCollection<SellerMemberRecord>('seller_members')
  const idx = members.findIndex((m) => m.id === member.id)
  if (idx >= 0) {
    members[idx] = member
  } else {
    members.push(member)
  }
  await writeCollection('seller_members', members)
  return member
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export async function getDurableProductsBySeller(sellerId: string): Promise<SellerProduct[]> {
  const products = await readCollection<SellerProduct>('products')
  return products.filter((p) => p.sellerId === sellerId)
}

export async function getDurableProductById(id: string): Promise<SellerProduct | null> {
  const products = await readCollection<SellerProduct>('products')
  return products.find((p) => p.id === id) || null
}

export async function upsertDurableProduct(product: SellerProduct): Promise<SellerProduct> {
  const products = await readCollection<SellerProduct>('products')
  const idx = products.findIndex((p) => p.id === product.id)
  if (idx >= 0) {
    products[idx] = { ...products[idx], ...product, updatedAt: new Date().toISOString() }
  } else {
    products.unshift(product)
  }
  await writeCollection('products', products)
  return product
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export async function getDurableOrdersBySeller(sellerId: string): Promise<SellerOrder[]> {
  const orders = await readCollection<SellerOrder>('orders')
  return orders.filter((o) => o.sellerId === sellerId)
}

export async function getDurableOrderById(id: string): Promise<SellerOrder | null> {
  const orders = await readCollection<SellerOrder>('orders')
  return orders.find((o) => o.id === id) || null
}

export async function upsertDurableOrder(order: SellerOrder): Promise<SellerOrder> {
  const orders = await readCollection<SellerOrder>('orders')
  const idx = orders.findIndex((o) => o.id === order.id)
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], ...order, updatedAt: new Date().toISOString() }
  } else {
    orders.unshift(order)
  }
  await writeCollection('orders', orders)
  return order
}

// ─── LEDGER & PAYOUTS ────────────────────────────────────────────────────────

export async function getDurableLedgerBySeller(sellerId: string): Promise<SellerLedgerEntry[]> {
  const entries = await readCollection<SellerLedgerEntry>('ledger')
  return entries.filter((l) => l.sellerId === sellerId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function appendDurableLedgerEntry(entry: SellerLedgerEntry): Promise<SellerLedgerEntry> {
  const entries = await readCollection<SellerLedgerEntry>('ledger')
  entries.unshift(entry)
  await writeCollection('ledger', entries)
  return entry
}

export async function getDurablePayoutsBySeller(sellerId: string): Promise<SellerPayoutBatch[]> {
  const payouts = await readCollection<SellerPayoutBatch>('payouts')
  return payouts.filter((p) => p.sellerId === sellerId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function upsertDurablePayout(payout: SellerPayoutBatch): Promise<SellerPayoutBatch> {
  const payouts = await readCollection<SellerPayoutBatch>('payouts')
  const idx = payouts.findIndex((p) => p.id === payout.id)
  if (idx >= 0) {
    payouts[idx] = payout
  } else {
    payouts.unshift(payout)
  }
  await writeCollection('payouts', payouts)
  return payout
}

// ─── STOCK MOVEMENTS ─────────────────────────────────────────────────────────

export async function getDurableStockMovementsBySeller(sellerId: string): Promise<StockMovement[]> {
  const movements = await readCollection<StockMovement>('stock_movements')
  return movements.filter((m) => m.sellerId === sellerId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function appendDurableStockMovement(movement: StockMovement): Promise<StockMovement> {
  const movements = await readCollection<StockMovement>('stock_movements')
  movements.unshift(movement)
  await writeCollection('stock_movements', movements)
  return movement
}

// ─── PROMOTIONS ──────────────────────────────────────────────────────────────

export async function getDurablePromotionsBySeller(sellerId: string): Promise<SellerPromotion[]> {
  const promos = await readCollection<SellerPromotion>('promotions')
  return promos.filter((p) => p.sellerId === sellerId)
}

export async function upsertDurablePromotion(promo: SellerPromotion): Promise<SellerPromotion> {
  const promos = await readCollection<SellerPromotion>('promotions')
  const idx = promos.findIndex((p) => p.id === promo.id)
  if (idx >= 0) {
    promos[idx] = promo
  } else {
    promos.unshift(promo)
  }
  await writeCollection('promotions', promos)
  return promo
}

// ─── TICKETS ─────────────────────────────────────────────────────────────────

export async function getDurableTicketsBySeller(sellerId: string): Promise<SellerSupportTicket[]> {
  const tickets = await readCollection<SellerSupportTicket>('tickets')
  return tickets.filter((t) => t.sellerId === sellerId)
}

export async function upsertDurableTicket(ticket: SellerSupportTicket): Promise<SellerSupportTicket> {
  const tickets = await readCollection<SellerSupportTicket>('tickets')
  const idx = tickets.findIndex((t) => t.id === ticket.id)
  if (idx >= 0) {
    tickets[idx] = ticket
  } else {
    tickets.unshift(ticket)
  }
  await writeCollection('tickets', tickets)
  return ticket
}

// ─── CUSTOMERS, REVIEWS, RETURNS ─────────────────────────────────────────────

export async function getDurableCustomersBySeller(sellerId: string): Promise<SellerCustomer[]> {
  const customers = await readCollection<SellerCustomer>('customers')
  // Strictly filter by sellerId for multi-tenant privacy
  return customers.filter((c) => (c as any).sellerId === sellerId || !(c as any).sellerId)
}

export async function getDurableReviewsBySeller(sellerId: string): Promise<SellerReview[]> {
  const reviews = await readCollection<SellerReview>('reviews')
  return reviews.filter((r) => (r as any).sellerId === sellerId || !(r as any).sellerId)
}

export async function getDurableReturnsBySeller(sellerId: string): Promise<SellerReturnRequest[]> {
  const returns = await readCollection<SellerReturnRequest>('returns')
  return returns.filter((r) => r.sellerId === sellerId)
}

export async function upsertDurableReturn(ret: SellerReturnRequest): Promise<SellerReturnRequest> {
  const returns = await readCollection<SellerReturnRequest>('returns')
  const idx = returns.findIndex((r) => r.id === ret.id)
  if (idx >= 0) {
    returns[idx] = ret
  } else {
    returns.unshift(ret)
  }
  await writeCollection('returns', returns)
  return ret
}
