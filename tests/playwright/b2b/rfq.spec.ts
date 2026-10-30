import { test, expect } from '@playwright/test'

test.describe('B2B Wholesale Discovery & RFQ Suite', () => {
  test('B2B landing page or wholesale quote page loads', async ({ page }) => {
    const response = await page.goto('/b2b')
    // Either /b2b or /wholesale redirect
    expect([200, 301, 302, 307, 308]).toContain(response?.status())
    await expect(page.locator('text=Wholesale').or(page.locator('text=Business')).or(page.locator('text=B2B')).first()).toBeVisible()
  })

  test('wholesale inquiry endpoint accepts structured RFQ payload', async ({ request }) => {
    const rfqPayload = {
      name: 'Synthetic QA Procurement Agent',
      phone: '+919999988888',
      email: 'qa.agent@nutytales-synthetic.local',
      city: 'Delhi NCR',
      businessName: 'Synthetic QA Test Corp',
      source: 'playwright/b2b-suite',
      message: 'Autonomous synthetic buyer requesting standard wholesale pricing tier.',
    }

    const response = await request.post('/api/leads', {
      data: rfqPayload,
    })

    // Expect either 200/201 or handled lead response
    expect([200, 201]).toContain(response.status())
    const json = await response.json()
    expect(json).toHaveProperty('success', true)
  })
})
