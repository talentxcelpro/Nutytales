# NUTY TALES — QA ARCHITECTURE
## Pre-Launch Browser Testing Strategy

> **Audit Status:** Inspection-only. No tests have been executed. All statements below are based on code-reading and tool inventory.  
> **Date:** 2025-10  
> **Prepared for:** Pre-launch autonomous synthetic customer integration

---

## 1. Current Test Infrastructure

| Aspect | Verified State |
|---|---|
| Test runner | Vitest 3.x (`package.json` devDependencies) |
| Existing tests | 5 files in `tests/seller/` (seller-portal unit/integration tests) |
| E2E framework | **None installed** — Playwright is not in `package.json` |
| Coverage | Vitest Coverage v8 configured |
| CI | Not detected (no `.github/workflows/`, `.gitlab-ci.yml` found) |
| Test environment | `jsdom` (Vitest config in `package.json`) |

### Existing Vitest Tests (Seller Portal Only)
```
tests/seller/
  seller-auth.test.ts
  seller-profile.test.ts
  seller-products.test.ts
  seller-orders.test.ts
  seller-analytics.test.ts
```
These test the `src/app/api/seller/` route handlers via mock HTTP calls. They do **not** cover any B2C customer journeys.

---

## 2. Staging Environment

### Current State
No dedicated staging domain was found in code or configuration. Verified sources:
- `vercel.json` — no explicit environment assignments
- `next.config.ts` — no staging URL constants
- `.env.example` — references `NEXT_PUBLIC_APP_URL=https://nutytales.com` (production only)

### Recommended Staging Strategy

| Strategy | Implementation |
|---|---|
| **Vercel Preview Deployments** | Every branch push auto-generates `nutytales-git-{branch}-{team}.vercel.app` |
| Branch naming | `staging/playwright-qa` → predictable preview URL |
| Environment variables | Create a **Preview** environment in Vercel dashboard with `RAZORPAY_KEY_ID=rzp_test_*` |
| Firebase project | Use a separate Firebase **test project** (e.g., `nutty-tales-test`) to isolate test accounts |
| Supabase | Use Supabase **branching** (if on Pro plan) or a dedicated `_test` schema |

> **⚠ ASSUMPTION:** Vercel team slug is `arshidwani`. Adjust the preview URL pattern after confirming.

---

## 3. Playwright Installation

Playwright is not yet installed. To add it:

```bash
# Install Playwright + Chromium
pnpm add -D @playwright/test
pnpm exec playwright install chromium

# Optional: Firefox + WebKit for cross-browser coverage
pnpm exec playwright install
```

### `playwright.config.ts` (recommended baseline)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'https://nutytales-git-staging-arshidwani.vercel.app',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Add firefox / webkit when E2E suite is stable
  ],
});
```

Add to `package.json` scripts:
```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed"
}
```

---

## 4. Authentication Requirements

### 4.1 B2C Authentication — Firebase

| Method | Implementation | Test Strategy |
|---|---|---|
| Google OAuth | Firebase `signInWithPopup` | Cannot be automated via Playwright (OAuth popup); use **programmatic token injection** |
| Phone OTP | Firebase `signInWithPhoneNumber` | Firebase **test phone numbers** (`+91 99999 99999` → OTP `123456`) |
| Anonymous | Not implemented | N/A |

**Programmatic Firebase Auth Bypass for E2E:**
```typescript
// In a Playwright fixture, use Firebase Admin SDK to mint a custom token
// then sign in on the client using signInWithCustomToken(auth, token)
// This requires FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY in test environment
```

**Session detection in app:** The app reads `nt_uid` from `localStorage` (set by `AuthContext.tsx`). For fast test setup, inject directly:
```typescript
await page.addInitScript(() => {
  localStorage.setItem('nt_uid', 'test-uid-playwright-001');
  localStorage.setItem('nt_user', JSON.stringify({
    uid: 'test-uid-playwright-001',
    email: 'test+playwright@nutytales.com',
    displayName: 'Playwright Test User'
  }));
});
```
> **⚠ WARNING:** This bypasses actual Firebase token verification. Only valid for UI flow tests. Any API route that calls `getAuth().verifyIdToken()` will reject this fake token. For API-touching flows, a real Firebase custom token is required.

### 4.2 B2B / Seller Authentication — NextAuth

| Method | Implementation |
|---|---|
| Credentials (email/password) | NextAuth `CredentialsProvider`, bcrypt-hashed passwords in `.data/seller-central/sellers.json` |
| Session cookie | `next-auth.session-token` HttpOnly cookie |

Playwright can handle this flow natively (form submit, no OAuth popup):
```typescript
await page.goto('/seller/login');
await page.fill('[name="email"]', 'test-seller@nutytales.com');
await page.fill('[name="password"]', 'TestSeller2026!');
await page.click('button[type="submit"]');
await page.waitForURL('/seller/dashboard');
```

### 4.3 Admin Routes

Admin routes under `/admin/*` are protected by `nt_uid` cookie presence check in `middleware.ts`.  
> **⚠ SECURITY NOTE (see Security Review):** The middleware does NOT verify JWT signature — only cookie presence. For test injection: set `nt_uid` cookie to any non-empty value in Playwright context.

```typescript
await context.addCookies([{
  name: 'nt_uid',
  value: 'test-admin-playwright',
  domain: 'nutytales-git-staging-arshidwani.vercel.app',
  path: '/',
}]);
```

---

## 5. Test Account Strategy

### Pre-Provisioned Accounts Required

| Role | Account | Provisioning Method |
|---|---|---|
| B2C Customer | `test+b2c@nutytales.com` | Firebase console → create user → note UID |
| Wholesale Buyer | `test+b2b@nutytales.com` | Firebase console → create user |
| Seller (verified) | `test-seller@nutytales.com` | Add to `.data/seller-central/sellers.json` with `status: "approved"` |
| Admin | Cookie injection (see §4.3) | No persistent account needed |
| Playwright synthetic | `playwright+synthetic@nutytales.com` | Firebase console |

### Firebase Test Phone Number
In Firebase console → Authentication → Sign-in method → Phone → Test phone numbers:
```
+91 99999 99999  →  OTP: 123456
+91 88888 88888  →  OTP: 654321
```
These numbers do not incur SMS costs and work in test/production Firebase projects.

### Test Account Environment Variables
Add to Vercel Preview environment (never commit to repo):
```env
TEST_B2C_EMAIL=test+b2c@nutytales.com
TEST_B2C_UID=<firebase-uid>
TEST_SELLER_EMAIL=test-seller@nutytales.com
TEST_SELLER_PASSWORD=<hashed-in-sellers.json>
FIREBASE_ADMIN_KEY=<base64-encoded-service-account-json>
```

---

## 6. Product Test Data

The product catalog is a **static TypeScript constant** in `src/lib/products-data.ts` (25 products, ~1,745 lines). No database seeding is required for shop tests.

### Verified Test Product Slugs
```
makhana-grade-a-fox-nuts       ← Primary Makhana product
california-almonds-premium     ← Dry fruit example
kashmiri-walnuts-kernels       ← Category: Dry Fruits
```
> **⚠ NOTE:** Slugs above are inferred from product names in `products-data.ts`. Confirm exact slug format by reading `products-data.ts` line 1–50.

### Test Fixtures Pattern
```typescript
// tests/playwright/fixtures/products.ts
export const TEST_PRODUCTS = {
  makhana: { slug: 'makhana-grade-a-fox-nuts', name: 'Grade A Fox Nuts' },
  almonds: { slug: 'california-almonds-premium', name: 'California Almonds' },
};
```

---

## 7. Cart Test Data

### Cart Storage Mechanism
Cart is stored in `localStorage` under key `nt_cart`.  
Source: `src/app/cart/page.tsx` (verified — `CartItem` interface and localStorage read).

### `CartItem` Interface (from `cart/page.tsx`)
```typescript
interface CartItem {
  id: string;           // Product slug or product ID
  name: string;
  price: number;        // In INR (e.g., 299)
  quantity: number;
  image: string;        // URL or relative path
  weight?: string;      // e.g., "500g"
  variant?: string;     // e.g., "Grade A"
}
```
> **⚠ ASSUMPTION:** Interface shape inferred from reading `cart/page.tsx`. Verify exact field names before writing fixtures.

### Pre-filling Cart via `addInitScript`
```typescript
await page.addInitScript(() => {
  const cart = [
    {
      id: 'makhana-grade-a-fox-nuts',
      name: 'Grade A Fox Nuts (Makhana)',
      price: 299,
      quantity: 2,
      image: '/images/makhana-grade-a.jpg',
      weight: '250g',
      variant: 'Grade A'
    }
  ];
  localStorage.setItem('nt_cart', JSON.stringify(cart));
});
await page.goto('/cart');
```
This skips product-browse navigation and directly loads a pre-filled cart, reducing test flakiness.

---

## 8. Checkout Test Data

### Checkout Form Fields (from `checkout/page.tsx`)
```typescript
// Verified field IDs from checkout/page.tsx form inspection
{
  fullName: 'Test Playwright User',
  email: 'test+playwright@nutytales.com',
  phone: '9999999999',
  addressLine1: '123 Test Lane',
  addressLine2: 'Suite 4B',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  paymentMethod: 'cod' // or 'razorpay' (gateway not wired — see §9)
}
```

### Order Confirmation (Verified Behavior)
- Checkout submits POST to `/api/orders` → inserts into Supabase `leads` table
- On success, sets `nt_last_order` in localStorage
- Redirects to `/order-confirmation` or shows inline confirmation

### Checkout Test Assertion
```typescript
// After form submit with COD
await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
// OR check localStorage
const lastOrder = await page.evaluate(() => localStorage.getItem('nt_last_order'));
expect(JSON.parse(lastOrder!)).toHaveProperty('orderId');
```

---

## 9. Payment Sandbox

### Current State
| Item | Status |
|---|---|
| Razorpay keys in `.env.example` | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` declared |
| Razorpay SDK | Listed in `package.json` dependencies |
| Checkout UI | Shows Razorpay payment option |
| Order creation API | `/api/razorpay/create-order` — **route EXISTS** (unverified if implemented) |
| Signature verification | Not confirmed in code inspection |
| Webhook handler | Not found in `src/app/api/` |

> **⚠ CRITICAL:** The Razorpay payment gateway is declared but not confirmed as wired end-to-end. Orders can be placed via COD without any payment. Playwright tests should **not** trigger live Razorpay transactions.

### Safe Sandbox Strategy
1. **COD-only tests** — use `paymentMethod: 'cod'` for all pre-launch QA
2. **Razorpay test mode** — once wired, use `RAZORPAY_KEY_ID=rzp_test_*` in Preview environment
3. **Mock Razorpay** — intercept `api.razorpay.com` calls in Playwright:
   ```typescript
   await page.route('**/api.razorpay.com/**', route => route.fulfill({
     status: 200,
     body: JSON.stringify({ razorpay_payment_id: 'pay_test_123', razorpay_signature: 'mock_sig' })
   }));
   ```
4. **Never use production Razorpay keys** in any automated test

---

## 10. Proposed Test Suite Structure

```
tests/
  seller/                          ← Existing Vitest tests (DO NOT MODIFY)
    seller-auth.test.ts
    seller-profile.test.ts
    seller-products.test.ts
    seller-orders.test.ts
    seller-analytics.test.ts
  playwright/                      ← New E2E tests (to be created)
    fixtures/
      auth.fixture.ts              ← Firebase token injection helpers
      cart.fixture.ts              ← localStorage cart pre-fill helpers
      products.ts                  ← Test product slugs/data
    auth/
      google-signin.spec.ts        ← Tests OAuth redirect (cannot automate popup — verify redirect URL only)
      phone-otp.spec.ts            ← Uses Firebase test phone numbers
    shop/
      catalog.spec.ts              ← Homepage → category → product list navigation
      product-detail.spec.ts       ← PDP render, variant selection, add-to-cart
      cart.spec.ts                 ← Cart add/remove/update quantity
      checkout.spec.ts             ← COD checkout end-to-end (no payment)
      checkout-razorpay.spec.ts    ← Razorpay flow (mocked gateway) — BLOCKED until wired
    search/
      search.spec.ts               ← Search bar, results display, no-results state
    account/
      profile.spec.ts              ← BLOCKED: no customer account pages exist yet
      address.spec.ts              ← BLOCKED: no address management pages exist yet
      orders.spec.ts               ← BLOCKED: order history not implemented
    b2b/
      rfq.spec.ts                  ← Wholesale enquiry form submission
      gifting-enquiry.spec.ts      ← Gifting enquiry form
    seller/
      register.spec.ts             ← Seller registration flow
      login.spec.ts                ← Seller login (NextAuth credentials)
      dashboard.spec.ts            ← Dashboard renders after login
    synthetic/
      customer-journey.spec.ts     ← Full browse → add-to-cart → checkout journey (MiroFish target)
```

---

## 11. Screenshots, Logs, and Reporting

### Playwright Configuration
```typescript
use: {
  screenshot: 'only-on-failure',   // Saves to test-results/
  video: 'retain-on-failure',      // MP4 of failing test run
  trace: 'on-first-retry',         // Playwright trace viewer (.zip)
}
```

### Recommended Reporters
```typescript
reporter: [
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['json', { outputFile: 'playwright-report/results.json' }],
  process.env.CI ? ['github'] : ['list'],
]
```

### Log Capture
```typescript
// Capture console errors in each test
page.on('console', msg => {
  if (msg.type() === 'error') console.error(`[Browser Error] ${msg.text()}`);
});
page.on('pageerror', err => {
  console.error(`[Page Error] ${err.message}`);
});
```

---

## 12. Test Isolation

| Concern | Strategy |
|---|---|
| localStorage bleed-between-tests | `beforeEach`: `await page.evaluate(() => localStorage.clear())` |
| Cart state | Pre-fill via `addInitScript` or `localStorage.setItem` in each test that needs a cart |
| Firebase session | Use `page.evaluate(() => { /* firebase.auth().signOut() */ })` or use a fresh browser context per test file |
| Database state | Use a dedicated test Supabase schema or table-prefix; rollback via DB transaction if possible |
| Seller portal state | Use dedicated test seller account; do not modify production `.data/seller-central/sellers.json` |
| Order creation | Pre-launch: orders write to `leads` table only — delete test records after suite run |

### Playwright Context Isolation Pattern
```typescript
// playwright.config.ts
use: {
  storageState: undefined,  // Do NOT share storage state between tests by default
}

// Per-test: create isolated context
test.use({ storageState: undefined });
```

---

## 13. MiroFish / Synthetic Customer Integration Point

Once the core Playwright suite is stable, the synthetic customer (MiroFish or equivalent) will:

1. Receive a **task prompt** (e.g., "Buy 500g Grade A Makhana as a first-time customer")
2. Drive Playwright via the [MCP Playwright server](https://github.com/microsoft/playwright-mcp) or direct CDP control
3. Assert outcomes against expected state (cart total, order confirmation, DB lead record)
4. Report findings to orchestrator

**Prerequisites before MiroFish integration:**
- [ ] Playwright installed and baseline tests passing
- [ ] Staging URL stable (Vercel Preview branch)
- [ ] Firebase test accounts provisioned
- [ ] COD checkout verified end-to-end
- [ ] Python host provisioned for MiroFish (cannot run on Vercel serverless)

---

## 14. Blocked / Not Yet Testable

| Feature | Reason Blocked |
|---|---|
| Razorpay payment flow | Gateway not confirmed as wired; no webhook handler found |
| Customer account dashboard | Pages do not exist |
| Address management | Pages do not exist |
| Order history | Pages do not exist |
| Real shipment tracking | Mock data returned for all order IDs |
| Wedding hampers submission | `wedding_hampers` table missing from migrations |
| MiroFish synthetic tests | Python host not provisioned; Playwright not installed |

---

*Document version: 1.0 — Inspection-only audit. No tests executed. Update after implementation phases.*
