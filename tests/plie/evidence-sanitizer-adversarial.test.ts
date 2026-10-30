import { describe, it, expect } from 'vitest'
import { sanitizeEvidenceArtifact } from '@/lib/plie/types'

describe('Task 004 / Phase 1: Adversarial Credential Sanitization Testing', () => {
  it('1. Redacts sensitive keys in deeply nested JSON objects', () => {
    const sensitivePayload = {
      orderId: 'NT-ORD-2026-999',
      customer: {
        name: 'Arshid Wani',
        email: 'customer@nutytales.com',
        auth: {
          token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.super_secret_payload',
          refreshToken: 'refresh_secret_12345',
          apiKey: 'key_live_abcdef123456789',
        },
      },
      payment: {
        method: 'razorpay',
        razorpay_secret: 'shhh_razorpay_super_secret',
        serviceRoleKey: 'supabase_service_role_secret_key_12345',
      },
    }

    const sanitized = sanitizeEvidenceArtifact(sensitivePayload)

    expect(sanitized.customer.auth.token).toBe('[REDACTED_BY_PLIE_SANITIZER]')
    expect(sanitized.customer.auth.refreshToken).toBe('[REDACTED_BY_PLIE_SANITIZER]')
    expect(sanitized.customer.auth.apiKey).toBe('[REDACTED_BY_PLIE_SANITIZER]')
    expect(sanitized.payment.razorpay_secret).toBe('[REDACTED_BY_PLIE_SANITIZER]')
    expect(sanitized.payment.serviceRoleKey).toBe('[REDACTED_BY_PLIE_SANITIZER]')
    expect(sanitized.orderId).toBe('NT-ORD-2026-999')
  })

  it('2. Redacts embedded credentials and query parameters in URLs', () => {
    const rawUrl =
      'https://admin:my_secret_password@nutytales-git-staging-arshidwani.vercel.app/api/webhook?token=eyJh_secret_token_123&secret=xyz987&key=rzp_test_5544&ref=storefront'

    const sanitized = sanitizeEvidenceArtifact(rawUrl)

    expect(sanitized).not.toContain('my_secret_password')
    expect(sanitized).not.toContain('eyJh_secret_token_123')
    expect(sanitized).not.toContain('xyz987')
    expect(sanitized).toContain('[REDACTED_USER_PASS]@')
    expect(sanitized).toContain('token=[REDACTED_PARAM]')
    expect(sanitized).toContain('secret=[REDACTED_PARAM]')
    expect(sanitized).toContain('ref=storefront')
  })

  it('3. Sanitizes HAR network entry traces with headers and cookies', () => {
    const harEntry = {
      request: {
        method: 'POST',
        url: 'https://nutytales-git-staging-arshidwani.vercel.app/api/orders',
        headers: [
          { name: 'Authorization', value: 'Bearer eyJhbGciOiJSUzI1NiJ9.fake_raw_token' },
          { name: 'Cookie', value: 'nt_uid=cust_secret_cookie_token; session=session_cookie_123' },
          { name: 'Content-Type', value: 'application/json' },
        ],
        postData: {
          mimeType: 'application/json',
          text: JSON.stringify({
            card: '4111 1111 1111 1111',
            account: '50200088910412',
            secret: 'secret_in_json_text',
          }),
        },
      },
    }

    const sanitized = sanitizeEvidenceArtifact(harEntry)

    const authHeader = sanitized.request.headers.find((h) => h.name === 'Authorization')
    const cookieHeader = sanitized.request.headers.find((h) => h.name === 'Cookie')

    expect(authHeader?.value).toBe('Bearer [REDACTED_TOKEN]')
    expect(cookieHeader?.value).toContain('nt_uid=[REDACTED_COOKIE]')
    expect(cookieHeader?.value).toContain('session=[REDACTED_COOKIE]')

    // Inspect stringified postData
    expect(sanitized.request.postData.text).not.toContain('50200088910412')
    expect(sanitized.request.postData.text).toContain('[REDACTED_ACCOUNT]')
  })

  it('4. Redacts Razorpay live and test keys in arbitrary text', () => {
    const text = 'Init Razorpay with key rzp_test_99887766AABB and live rzp_live_00112233CCDDEE'
    const sanitized = sanitizeEvidenceArtifact(text)
    expect(sanitized).not.toContain('rzp_test_99887766AABB')
    expect(sanitized).not.toContain('rzp_live_00112233CCDDEE')
    expect(sanitized).toContain('[REDACTED_RAZORPAY_KEY]')
  })
})
