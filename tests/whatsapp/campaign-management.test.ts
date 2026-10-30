import { describe, it, expect, beforeEach } from 'vitest'
import { WhatsAppCampaignManager } from '@/lib/whatsapp/campaigns'
import { setWhatsAppProviderForTesting, MockWhatsAppProvider } from '@/lib/whatsapp/provider'

describe('WhatsApp Campaign Management & Cost Estimation', () => {
  let mockProvider: MockWhatsAppProvider

  beforeEach(() => {
    mockProvider = new MockWhatsAppProvider()
    setWhatsAppProviderForTesting(mockProvider)
  })

  it('correctly calculates audience preview and estimated Meta messaging costs', async () => {
    const preview = await WhatsAppCampaignManager.previewAudience('all_opted_in')

    expect(preview).toBeDefined()
    expect(typeof preview.eligibleOptedInCount).toBe('number')
    expect(typeof preview.estimatedCostInr).toBe('number')
    expect(Array.isArray(preview.sampleRecipients)).toBe(true)
  })

  it('creates a campaign in DRAFT or SCHEDULED status', async () => {
    const campaign = await WhatsAppCampaignManager.createCampaign({
      name: 'Diwali Dry Fruits Gifting Launch',
      category: 'wedding_hampers',
      targetSegment: 'all_opted_in',
      templateName: 'repeat_purchase_v1',
      notes: 'Test broadcast campaign',
    })

    expect(campaign.id).toContain('CMP-')
    expect(campaign.name).toBe('Diwali Dry Fruits Gifting Launch')
    expect(campaign.status).toBe('DRAFT')
    expect(campaign.estimatedCost).toBeGreaterThanOrEqual(0)
  })
})
