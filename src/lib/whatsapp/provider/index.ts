// ─── Nuty Tales — WhatsApp Provider Factory ───────────────────────────────────
import { WhatsAppProviderAdapter } from './adapter'
import { MetaCloudApiAdapter } from './meta-cloud-api'
import { MockWhatsAppProvider } from './mock-provider'

let activeProvider: WhatsAppProviderAdapter | null = null
let mockProviderInstance: MockWhatsAppProvider | null = null

/**
 * Returns the active WhatsApp Provider Adapter based on environment configuration.
 * Gracefully falls back to MockWhatsAppProvider if Meta credentials are not configured.
 */
export function getWhatsAppProvider(): WhatsAppProviderAdapter {
  if (activeProvider) return activeProvider

  const hasMetaCredentials = Boolean(
    process.env.META_WHATSAPP_PHONE_NUMBER_ID &&
    process.env.META_WHATSAPP_ACCESS_TOKEN
  )

  const isExplicitMock =
    process.env.WHATSAPP_MOCK_MODE === 'true' ||
    process.env.NODE_ENV === 'test'

  if (hasMetaCredentials && !isExplicitMock) {
    activeProvider = new MetaCloudApiAdapter()
  } else {
    if (!mockProviderInstance) {
      mockProviderInstance = new MockWhatsAppProvider()
    }
    activeProvider = mockProviderInstance
  }

  return activeProvider
}

/**
 * Test helper to inject a mock or custom provider instance.
 */
export function setWhatsAppProviderForTesting(
  provider: WhatsAppProviderAdapter | null
) {
  activeProvider = provider
}

/**
 * Helper to retrieve the mock provider instance directly during tests.
 */
export function getMockWhatsAppProvider(): MockWhatsAppProvider {
  if (!mockProviderInstance) {
    mockProviderInstance = new MockWhatsAppProvider()
  }
  return mockProviderInstance
}

export * from './adapter'
export * from './meta-cloud-api'
export * from './mock-provider'
