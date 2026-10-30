import { describe, it, expect, beforeAll } from 'vitest'
import crypto from 'crypto'
import {
  verifyAdminToken,
  validateJwtClaims,
  verifyRs256Signature,
  DEFAULT_FIREBASE_PROJECT_ID,
  DEFAULT_FIREBASE_ISSUER,
  FirebaseJwtPayload,
} from '@/lib/auth/jwt-verifier'

describe('Phase A: Firebase Admin Cryptographic Authentication & Role Enforcement', () => {
  let validPrivateKey: string
  let validPublicKey: string
  let attackerPrivateKey: string
  let attackerPublicKey: string

  beforeAll(() => {
    // Generate valid RSA keypair simulating trusted authority
    const validPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    })
    validPrivateKey = validPair.privateKey
    validPublicKey = validPair.publicKey

    // Generate attacker RSA keypair for forged signature testing
    const attackerPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    })
    attackerPrivateKey = attackerPair.privateKey
    attackerPublicKey = attackerPair.publicKey
  })

  // Helper to create an RS256 token
  function mintToken(
    payload: Partial<FirebaseJwtPayload>,
    privateKeyPem: string,
    headerOverride?: Record<string, any>
  ): string {
    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: 'test-key-id-01',
      ...(headerOverride || {}),
    }

    const defaultPayload: FirebaseJwtPayload = {
      iss: DEFAULT_FIREBASE_ISSUER,
      aud: DEFAULT_FIREBASE_PROJECT_ID,
      sub: 'usr_admin_test_101',
      role: 'admin',
      iat: Math.floor(Date.now() / 1000) - 60,
      exp: Math.floor(Date.now() / 1000) + 3600,
    }

    const mergedPayload = { ...defaultPayload, ...payload }

    const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url')
    const payloadEncoded = Buffer.from(JSON.stringify(mergedPayload)).toString('base64url')
    const dataToSign = `${headerEncoded}.${payloadEncoded}`

    const signer = crypto.createSign('RSA-SHA256')
    signer.update(dataToSign)
    const signature = signer.sign(privateKeyPem, 'base64url')

    return `${dataToSign}.${signature}`
  }

  it('1. Rejects missing token with error missing_token', async () => {
    const res1 = await verifyAdminToken(undefined)
    expect(res1.valid).toBe(false)
    expect(res1.error).toBe('missing_token')

    const res2 = await verifyAdminToken('')
    expect(res2.valid).toBe(false)
    expect(res2.error).toBe('missing_token')
  })

  it('2. Rejects arbitrary cookie (e.g. nt_uid=admin or random string)', async () => {
    const res = await verifyAdminToken('arbitrary_spoofed_admin_cookie_12345')
    expect(res.valid).toBe(false)
    expect(res.error).toBe('malformed_token')
  })

  it('3. Rejects forged JWT with invalid segment encoding', async () => {
    const res = await verifyAdminToken('header.payload.signature_that_is_not_json')
    expect(res.valid).toBe(false)
    expect(res.error).toBe('malformed_token')
  })

  it('4. Rejects token with invalid cryptographic signature (signed by attacker key)', async () => {
    // Mint token signed with attacker private key
    const forgedToken = mintToken({ role: 'admin' }, attackerPrivateKey)

    // Verify against legitimate public key
    const res = await verifyAdminToken(forgedToken, { publicKey: validPublicKey })
    expect(res.valid).toBe(false)
    expect(res.error).toBe('invalid_signature')
  })

  it('5. Rejects expired token', async () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600
    const expiredToken = mintToken({ exp: pastExp }, validPrivateKey)

    const res = await verifyAdminToken(expiredToken, { publicKey: validPublicKey })
    expect(res.valid).toBe(false)
    expect(res.error).toBe('expired_token')
  })

  it('6. Rejects token with wrong audience', async () => {
    const wrongAudToken = mintToken({ aud: 'different-firebase-project' }, validPrivateKey)

    const res = await verifyAdminToken(wrongAudToken, { publicKey: validPublicKey })
    expect(res.valid).toBe(false)
    expect(res.error).toBe('invalid_audience')
  })

  it('7. Rejects token with wrong issuer', async () => {
    const wrongIssToken = mintToken(
      { iss: 'https://securetoken.google.com/malicious-project' },
      validPrivateKey
    )

    const res = await verifyAdminToken(wrongIssToken, { publicKey: validPublicKey })
    expect(res.valid).toBe(false)
    expect(res.error).toBe('invalid_issuer')
  })

  it('8. Rejects valid customer token without admin role (forbidden_insufficient_role)', async () => {
    // Valid signature, valid issuer, valid audience, but role is 'customer'
    const customerToken = mintToken({ role: 'customer' }, validPrivateKey)

    const res = await verifyAdminToken(customerToken, { publicKey: validPublicKey })
    expect(res.valid).toBe(false)
    expect(res.error).toBe('forbidden_insufficient_role')
  })

  it('9. Authorizes valid cryptographically signed admin token with role=admin', async () => {
    const adminToken = mintToken({ role: 'admin' }, validPrivateKey)

    const res = await verifyAdminToken(adminToken, { publicKey: validPublicKey })
    expect(res.valid).toBe(true)
    expect(res.error).toBeUndefined()
    expect(res.payload?.sub).toBe('usr_admin_test_101')
    expect(res.payload?.role).toBe('admin')
  })

  it('10. Authorizes valid cryptographically signed admin token with role=SUPER_ADMIN', async () => {
    const superAdminToken = mintToken({ role: 'SUPER_ADMIN', isSuperAdmin: true }, validPrivateKey)

    const res = await verifyAdminToken(superAdminToken, { publicKey: validPublicKey })
    expect(res.valid).toBe(true)
    expect(res.payload?.isSuperAdmin).toBe(true)
  })
})
