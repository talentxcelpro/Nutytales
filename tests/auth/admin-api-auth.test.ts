import { describe, it, expect, beforeEach, vi } from 'vitest'
import crypto from 'crypto'
import {
  setTestPublicCerts,
  DEFAULT_FIREBASE_ISSUER,
  DEFAULT_FIREBASE_PROJECT_ID,
} from '@/lib/auth/jwt-verifier'
import { GET as getOverview } from '@/app/api/admin/whatsapp/overview/route'
import { GET as getCampaigns, POST as postCampaigns } from '@/app/api/admin/whatsapp/campaigns/route'
import { GET as getConversations } from '@/app/api/admin/whatsapp/conversations/route'

// Generate RSA key pair for testing
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})

const testKid = 'test-key-api-001'

function createSignedJwt(payload: Record<string, any>, kid = testKid): string {
  const header = { alg: 'RS256', kid, typ: 'JWT' }
  const encHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
  const encPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const data = `${encHeader}.${encPayload}`

  const signer = crypto.createSign('RSA-SHA256')
  signer.update(data)
  const sig = signer.sign(privateKey).toString('base64url')

  return `${data}.${sig}`
}

describe('Task 004 / Phase 1: Direct Privileged Admin API Independent Authorization', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    setTestPublicCerts({ [testKid]: publicKey })
  })

  it('1. Blocks unauthenticated direct API call with HTTP 401', async () => {
    const req = new Request('http://localhost:3000/api/admin/whatsapp/overview', {
      method: 'GET',
    })

    const res = await getOverview(req)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.code).toBe('missing_token')
  })

  it('2. Blocks forged / invalid signature token on direct API call with HTTP 401', async () => {
    const fakeToken =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6InRlc3QifQ.eyJzdWIiOiIxMjM0NSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9udXR0eS10YWxlcy0xYzY2NyIsImF1ZCI6Im51dHR5LXRhbGVzLTFjNjY3Iiwicm9sZSI6ImFkbWluIn0.bad_signature'

    const req = new Request('http://localhost:3000/api/admin/whatsapp/overview', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${fakeToken}`,
      },
    })

    const res = await getOverview(req)
    expect(res.status).toBe(401)
  })

  it('3. Blocks valid customer token without administrative role on direct API call with HTTP 403', async () => {
    const now = Math.floor(Date.now() / 1000)
    const customerPayload = {
      iss: DEFAULT_FIREBASE_ISSUER,
      aud: DEFAULT_FIREBASE_PROJECT_ID,
      sub: 'cust_normal_user_123',
      email: 'customer@example.com',
      role: 'customer',
      iat: now - 10,
      exp: now + 3600,
    }

    const customerToken = createSignedJwt(customerPayload)

    const req = new Request('http://localhost:3000/api/admin/whatsapp/campaigns', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${customerToken}`,
      },
    })

    const res = await getCampaigns(req)
    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json.code).toBe('forbidden_insufficient_role')
  })

  it('4. Authorizes cryptographically signed admin token on direct API call with HTTP 200', async () => {
    const now = Math.floor(Date.now() / 1000)
    const adminPayload = {
      iss: DEFAULT_FIREBASE_ISSUER,
      aud: DEFAULT_FIREBASE_PROJECT_ID,
      sub: 'usr_legit_admin_777',
      email: 'founder@nutytales.com',
      role: 'admin',
      iat: now - 10,
      exp: now + 3600,
    }

    const adminToken = createSignedJwt(adminPayload)

    const req = new Request('http://localhost:3000/api/admin/whatsapp/overview', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })

    const res = await getOverview(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.overview).toBeDefined()
  })

  it('5. Supports direct API authorization via cookie nt_uid', async () => {
    const now = Math.floor(Date.now() / 1000)
    const adminPayload = {
      iss: DEFAULT_FIREBASE_ISSUER,
      aud: DEFAULT_FIREBASE_PROJECT_ID,
      sub: 'usr_cookie_admin_888',
      email: 'ops@nutytales.com',
      role: 'SUPER_ADMIN',
      iat: now - 10,
      exp: now + 3600,
    }

    const adminToken = createSignedJwt(adminPayload)

    const req = new Request('http://localhost:3000/api/admin/whatsapp/conversations', {
      method: 'GET',
      headers: {
        Cookie: `nt_uid=${encodeURIComponent(adminToken)}`,
      },
    })

    const res = await getConversations(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.conversations).toBeDefined()
  })
})
