import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock NextAuth to avoid next-auth ESM resolution in node test environment
vi.mock('@/lib/auth', () => ({
  auth: vi.fn().mockResolvedValue(null),
}))

import {
  getVerifiedSellerSession,
  requireSellerAuth,
  requireAdminAuth,
} from '@/lib/seller-portal/auth-server'

describe('Phase 1: Security & RBAC Enforcement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects unauthenticated requests without credentials (no cookie fallback)', async () => {
    const req = new NextRequest('http://localhost:3000/api/seller/orders', {
      headers: new Headers({
        cookie: 'nt_seller_id=SLR-GLOBAL-001', // Attacker provides cookie
      }),
    })

    const auth = await requireSellerAuth(req)
    expect('errorResponse' in auth).toBe(true)
    if ('errorResponse' in auth) {
      expect(auth.errorResponse.status).toBe(401)
      const data = await auth.errorResponse.json()
      expect(data.error).toBe('Unauthorized')
    }
  })

  it('rejects query-parameter identity hijacking (?sellerId=...)', async () => {
    const req = new NextRequest('http://localhost:3000/api/seller/orders?sellerId=SLR-GLOBAL-002')

    const session = await getVerifiedSellerSession(req)
    expect(session).toBeNull()

    const auth = await requireSellerAuth(req)
    expect('errorResponse' in auth).toBe(true)
  })

  it('authorizes admin access only when ADMIN_SECRET header is present', async () => {
    const validReq = new NextRequest('http://localhost:3000/api/seller/admin', {
      headers: new Headers({
        'x-admin-secret': 'nuttytales_admin_super_secret_2026',
      }),
    })

    const auth = await requireAdminAuth(validReq)
    expect('session' in auth).toBe(true)
    if ('session' in auth) {
      expect(auth.session.isSuperAdmin).toBe(true)
      expect(auth.session.role).toBe('SUPER_ADMIN')
    }
  })

  it('rejects invalid or missing admin secrets on admin endpoints', async () => {
    const invalidReq = new NextRequest('http://localhost:3000/api/seller/admin', {
      headers: new Headers({
        'x-admin-secret': 'wrong-password',
      }),
    })

    const auth = await requireAdminAuth(invalidReq)
    expect('errorResponse' in auth).toBe(true)
    if ('errorResponse' in auth) {
      expect(auth.errorResponse.status).toBe(401)
    }
  })
})
