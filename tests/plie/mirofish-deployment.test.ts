import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MiroFishSidecarAdapter } from '@/lib/plie/adapters/mirofish.adapter'

describe('Task 005 / Acceptance #8: MiroFish Deployment Boundary & Environment Connectivity Proof', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    delete process.env.MIROFISH_SIDECAR_URL
  })

  it('1. Accurately identifies default loopback URL as LOCAL_DEVELOPMENT_ONLY', async () => {
    const adapter = new MiroFishSidecarAdapter('http://127.0.0.1:8000')
    const status = await adapter.getDeploymentStatus()

    expect(status.isHosted).toBe(false)
    expect(status.sidecarUrl).toBe('http://127.0.0.1:8000')
    // When offline in CI/test runner, accurately reports STANDBY_LOCAL_ONLY
    expect(['LOCAL_DEVELOPMENT_ONLY', 'STANDBY_LOCAL_ONLY']).toContain(status.deploymentMode)
  })

  it('2. Identifies remote hosted staging URL as HOSTED_STAGING_SERVICE when configured', async () => {
    const adapter = new MiroFishSidecarAdapter('https://mirofish-staging.nutytales.com')
    // Mock health check returning online
    vi.spyOn(adapter, 'healthCheck').mockResolvedValue(true)

    const status = await adapter.getDeploymentStatus()
    expect(status.isHosted).toBe(true)
    expect(status.deploymentMode).toBe('HOSTED_STAGING_SERVICE')
    expect(status.sidecarUrl).toBe('https://mirofish-staging.nutytales.com')
  })

  it('3. Explicitly attaches mandatory disclaimer to all simulation outputs', async () => {
    const adapter = new MiroFishSidecarAdapter()
    const status = await adapter.getDeploymentStatus()

    expect(status.legalNotice).toBe('ALGORITHMIC_SYNTHETIC_SIMULATION (NOT EMPIRICAL CUSTOMER RESEARCH)')
  })

  it('4. Refuses to initialize against production targets', async () => {
    const adapter = new MiroFishSidecarAdapter()
    const initResult = await adapter.initialize({
      targetBaseUrl: 'https://nutytales.com',
      isProduction: true,
      razorpayTestModeOnly: true,
    })

    expect(initResult.ready).toBe(false)
    expect(initResult.error).toContain('refuses to run against production')
  })
})
