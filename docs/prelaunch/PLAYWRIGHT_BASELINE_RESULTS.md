# NUTY TALES — PLAYWRIGHT BASELINE RESULTS
## Phase 0 Pre-Launch Browser & Security Test Execution

> **Test Runner:** `@playwright/test` 1.64.1  
> **Browser Engine:** Chromium Headless (Desktop Chrome viewport 1280x720)  
> **Server Configuration:** Next.js Production Build (`next start` on `http://localhost:3000`)  
> **Execution Date:** 2026-10-30  
> **Total Test Suites:** 6  
> **Total Specs:** 15  
> **Passed:** 15  
> **Failed:** 0  
> **Duration:** 17.6s  

---

## Suite Summary

| Suite Name | File | Specs | Passed | Failed | Status |
|---|---|---|---|---|---|
| **Smoke Suite** | `tests/playwright/smoke/homepage.spec.ts` | 2 | 2 | 0 | ✅ PASSED |
| **Catalog Suite** | `tests/playwright/catalog/catalog.spec.ts` | 2 | 2 | 0 | ✅ PASSED |
| **Cart Suite** | `tests/playwright/cart/cart.spec.ts` | 2 | 2 | 0 | ✅ PASSED |
| **Checkout Suite** | `tests/playwright/checkout/checkout.spec.ts` | 2 | 2 | 0 | ✅ PASSED |
| **B2B RFQ Suite** | `tests/playwright/b2b/rfq.spec.ts` | 2 | 2 | 0 | ✅ PASSED |
| **Security Suite** | `tests/playwright/security/security.spec.ts` | 5 | 5 | 0 | ✅ PASSED |
| **TOTAL** | | **15** | **15** | **0** | **100% PASS** |

---

## Detailed Test Spec Execution Log

### 1. Security Suite (`tests/playwright/security/security.spec.ts`)
```
✓ SEC-001: Razorpay order creation validates amount and receipt (379ms)
  - Asserted: POST /api/razorpay/create-order with negative amount returns 400
  - Asserted: Response body { success: false }

✓ SEC-001: Razorpay verify endpoint rejects forged signature (374ms)
  - Asserted: POST /api/razorpay/verify with forged signature returns error status
  - Asserted: Response body { success: false }

✓ SEC-002: Client bundle contains no hardcoded bank account numbers (3.1s)
  - Asserted: Loaded /checkout page content
  - Asserted: string '50200088910412' not found in DOM
  - Asserted: string 'HDFC0001234' not found in DOM

✓ SEC-003: Order tracking returns proper Not-Found state and does NOT fabricate customer details or AWBs (2.5s)
  - Asserted: Loaded /orders/track?id=NT-ORD-FAKE-999999
  - Asserted: DOM does NOT contain 'Valued Customer'
  - Asserted: DOM does NOT contain 'BD-AIR-88910412IN'
  - Asserted: DOM does NOT contain '+91 98110XXXXX'
  - Asserted: [data-testid="order-not-found-card"] is visible with 'Order Not Found'

✓ SEC-005: Admin route redirects to login when dummy/malformed cookie is provided (2.4s)
  - Asserted: Injected raw cookie nt_uid='attacker_fake_user_id_12345'
  - Asserted: Navigated to /admin
  - Asserted: Redirected to /login
```

### 2. Smoke Suite (`tests/playwright/smoke/homepage.spec.ts`)
```
✓ homepage loads and renders brand headings and key navigation (3.6s)
  - HTTP 200 OK
  - Title matches /Nuty\s*Tales/i
  - Shop anchor link verified

✓ robots.txt returns valid policy (1.0s)
  - HTTP 200 OK
  - Contains User-agent rules for search and AI crawlers
```

### 3. Catalog Suite (`tests/playwright/catalog/catalog.spec.ts`)
```
✓ shop page renders product grid (10.4s)
  - HTTP 200 OK
  - Multiple product card links (/shop/[slug]) rendered

✓ product detail page renders with pricing and add-to-cart option (8.6s)
  - Navigated from shop grid to first product PDP
  - Add to cart button element confirmed visible
```

### 4. Cart Suite (`tests/playwright/cart/cart.spec.ts`)
```
✓ cart page renders empty state when no items in storage (2.6s)
  - Cleared localStorage
  - Empty state UI verified

✓ cart hydrates accurately from injected test cart (2.7s)
  - Injected synthetic item: 'Synthetic Test Makhana', Qty 2, Price ₹598
  - Navigated to /cart
  - Product title and total ₹598 verified in DOM
```

### 5. Checkout Suite (`tests/playwright/checkout/checkout.spec.ts`)
```
✓ checkout form renders shipping inputs and COD payment option (4.5s)
  - Synthetic cart item injected
  - Shipping fields and payment selection rendered

✓ bank transfer details do NOT contain hardcoded secret account numbers (3.9s)
  - Zero hardcoded account credentials leaked in checkout view
```

### 6. B2B Wholesale Suite (`tests/playwright/b2b/rfq.spec.ts`)
```
✓ B2B landing page or wholesale quote page loads (8.7s)
  - Subdomain rewrite/route returns 200 OK
  - B2B commercial heading rendered

✓ wholesale inquiry endpoint accepts structured RFQ payload (221ms)
  - POST /api/leads with synthetic buyer payload
  - Returns 200/201 with { success: true }
```

---

## Vitest Unit & Integration Regression

In addition to the Playwright browser test suite, the existing Vitest test suite was executed:
- `tests/seller/auth-rbac.test.ts` (4 tests) — **PASSED**
- `tests/seller/tenant-isolation.test.ts` (3 tests) — **PASSED**
- `tests/seller/order-sync.test.ts` (1 test) — **PASSED**
- `tests/seller/ledger-finance.test.ts` (4 tests) — **PASSED**
- `tests/seller/persistence-restart.test.ts` (1 test) — **PASSED**

**Vitest Status:** 5 test files, 13 tests passed, 0 failed.
