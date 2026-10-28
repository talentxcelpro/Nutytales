import { describe, it, expect } from 'vitest'
import {
  upsertDurableSeller,
  getDurableSellerById,
  readCollection,
} from '@/lib/seller-portal/persistence'
import { SellerProfile } from '@/lib/seller-portal/types'

describe('Phase 2: Durable Persistence Across Restarts & Zero Mock Data', () => {
  it('persists newly registered seller to durable disk storage', async () => {
    const testId = `SLR-DURABLE-${Date.now()}`
    const sellerPayload: SellerProfile = {
      id: testId,
      storeName: 'Durable Artisans Hub',
      slug: `durable-artisans-${Date.now()}`,
      legalName: 'Durable Artisans Guild',
      businessType: 'artisan',
      email: 'guild@durable.com',
      phone: '+14155552671',
      country: 'United States',
      countryCode: 'US',
      pickupAddress: '100 Mission St',
      city: 'San Francisco',
      state: 'CA',
      pincode: '94105',
      preferredCurrency: 'USD',
      supportedMarkets: ['Domestic', 'Global'],
      taxIdentifiers: { countryCode: 'US', einOrSsn: 'XX-XXXXXXX' },
      bankDetails: {
        bankName: 'Silicon Valley Bank',
        accountNumberMasked: '****5678',
        routingCode: '121000358',
        beneficiaryName: 'Durable Artisans Guild',
        countryCode: 'US',
        currency: 'USD',
      },
      storefront: {
        displayName: 'Durable Artisans Hub',
        tagline: 'Handmade crafts',
        bio: 'Artisan guild',
        ratingAverage: 5.0,
        totalReviews: 0,
        shipsInternationally: true,
        returnPolicyDays: 30,
      },
      status: 'submitted',
      approvedCategories: ['crafts-handicrafts'],
      approvedStorefronts: ['crafts.nutytales.com'],
      defaultCommissionRate: 12.0,
      settlementHoldDays: 14,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Write to disk
    await upsertDurableSeller(sellerPayload)

    // Read back via independent disk read (simulating serverless cold start / process reboot)
    const readBack = await getDurableSellerById(testId)
    expect(readBack).not.toBeNull()
    expect(readBack?.id).toBe(testId)
    expect(readBack?.storeName).toBe('Durable Artisans Hub')
    expect(readBack?.status).toBe('submitted')

    // Confirm collection is actually on disk
    const diskItems = await readCollection<SellerProfile>('sellers')
    const foundOnDisk = diskItems.some((s) => s.id === testId)
    expect(foundOnDisk).toBe(true)
  })
})
