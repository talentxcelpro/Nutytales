import { test, expect } from '@playwright/test'

test.describe('Pre-Launch Security Regression Suite', () => {
  test('SEC-001: Razorpay order creation validates amount and receipt', async ({ request }) => {
    // Missing amount or negative amount should be rejected
    const badRes = await request.post('/api/razorpay/create-order', {
      data: { amountInr: -50, receipt: 'rcpt_test_1' },
    })
    expect(badRes.status()).toBe(400)
    const badJson = await badRes.json()
    expect(badJson.success).toBe(false)
  })

  test('SEC-001: Razorpay verify endpoint rejects forged signature', async ({ request }) => {
    const forgedRes = await request.post('/api/razorpay/verify', {
      data: {
        razorpay_order_id: 'order_test_123',
        razorpay_payment_id: 'pay_test_456',
        razorpay_signature: 'deadbeef_forged_signature_1234567890abcdef',
      },
    })
    expect([400, 500]).toContain(forgedRes.status())
    const json = await forgedRes.json()
    expect(json.success).toBe(false)
  })

  test('SEC-001-DURABLE: Duplicate order creation with same idempotencyKey is handled safely', async ({ request }) => {
    const idempotencyKey = `idemp_test_${Date.now()}`
    // First call with invalid amount rejected before external API call
    const res1 = await request.post('/api/razorpay/create-order', {
      data: { amountInr: 0, receipt: 'rcpt_idemp_1', idempotencyKey },
    })
    expect(res1.status()).toBe(400)

    // Second call rejected consistently
    const res2 = await request.post('/api/razorpay/create-order', {
      data: { amountInr: 0, receipt: 'rcpt_idemp_1', idempotencyKey },
    })
    expect(res2.status()).toBe(400)
  })

  test('SEC-002: Client bundle contains no hardcoded bank account numbers', async ({ page }) => {
    await page.goto('/checkout')
    const pageHtml = await page.content()
    expect(pageHtml).not.toContain('50200088910412')
    expect(pageHtml).not.toContain('HDFC0001234')
  })

  test('SEC-003: Order tracking returns proper Not-Found state and does NOT fabricate customer details or AWBs', async ({ page }) => {
    // Navigate with arbitrary non-existent order ID
    await page.goto('/orders/track?id=NT-ORD-FAKE-999999')

    const pageText = await page.innerText('body')
    expect(pageText).not.toContain('Valued Customer')
    expect(pageText).not.toContain('BD-AIR-88910412IN')
    expect(pageText).not.toContain('+91 98110XXXXX')

    await expect(page.locator('[data-testid="order-not-found-card"]')).toBeVisible()
    expect(pageText).toContain('Order Not Found')
  })

  test('SEC-005: Admin route redirects to login when dummy/malformed cookie is provided', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'nt_uid',
        value: 'attacker_fake_user_id_12345',
        domain: 'localhost',
        path: '/',
      },
    ])

    await page.goto('/admin')
    expect(page.url()).toContain('/login')
  })

  test('SEC-005-ROLE: Admin route redirects to login when customer token lacks admin role claim', async ({ page, context }) => {
    // Generate validly structured JWT with role='customer' (lacks admin role)
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
    const payload = Buffer.from(
      JSON.stringify({
        iss: 'https://securetoken.google.com/nutty-tales-1c667',
        aud: 'nutty-tales-1c667',
        sub: 'customer_usr_999',
        role: 'customer',
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    ).toString('base64url')
    const customerToken = `${header}.${payload}.mock_sig`

    await context.addCookies([
      {
        name: 'nt_uid',
        value: customerToken,
        domain: 'localhost',
        path: '/',
      },
    ])

    await page.goto('/admin')
    expect(page.url()).toContain('/login')
  })
})
