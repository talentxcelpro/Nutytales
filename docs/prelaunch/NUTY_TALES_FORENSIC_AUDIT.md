# NUTY TALES — FORENSIC DISCOVERY AND ENVIRONMENT AUDIT
**Date:** 2026-10-30  
**Auditor:** Antigravity Pre-launch Intelligence System  
**Status:** VERIFIED FACTS ONLY — no assumptions extrapolated from route presence

---

## 1. REPOSITORY OVERVIEW

| Property | Value |
|---|---|
| **Framework** | Next.js 16.3.8 (App Router) |
| **Runtime** | React 19.2.8 |
| **Language** | TypeScript 5 |
| **Package Manager** | npm (package-lock.json present) |
| **ORM** | Prisma 5.19.1 (PostgreSQL via Supabase) |
| **Auth** | Firebase Auth (primary, client-side) + NextAuth 5 beta (Credentials / B2B) |
| **Database** | Supabase PostgreSQL (`qezkjbzmtfjjmqgzgili.supabase.co`) |
| **CSS** | Tailwind CSS v4 + PostCSS |
| **Test Runner** | Vitest 4.1.12 |
| **Deployment** | Vercel (vercel.json confirmed) |
| **CDN** | Cloudflare (cache directives in next.config.ts) |
| **Repo Root** | `C:\Users\Arshid.Wani\Nutytales` |

---

## 2. FRONTEND ARCHITECTURE

### Technology Stack (VERIFIED)
- **Next.js App Router** — all pages live in `src/app/`
- **React Server Components + Client Components** — pages use RSC for SSG/ISR; interactive components use `'use client'` directive
- **Static Product Catalog** — `src/lib/products-data.ts` contains 25+ products as a TypeScript constant (NOT database-driven for the main shop)
- **Cart** — client-side `localStorage` (`nt_cart` key); no server-side cart persistence for anonymous users
- **Authentication Context** — `src/context/AuthContext.tsx` wraps the entire application via Firebase Auth
- **3D components** — `three` / `@types/three` (Three.js) used in `src/components/3d/`
- **Forms** — `react-hook-form` + `zod` validation
- **Image Optimization** — Next.js `<Image>` with AVIF/WebP, 1-year cache TTL

### Build Pipeline
```
prisma generate && next build
```
- `postinstall`: `prisma generate` (runs on every `npm install`)
- `build`: generates Prisma client first, then Next.js production build

---

## 3. VERCEL CONFIGURATION (`vercel.json`)

```json
{
  "framework": "nextjs",
  "crons": [{ "path": "/api/cron/indexnow", "schedule": "0 2 * * *" }]
}
```

- Framework: nextjs  
- One Vercel Cron: IndexNow submission at 02:00 UTC daily  
- No custom routing overrides in vercel.json (all routing handled in Next.js)

---

## 4. NEXT.JS CONFIGURATION HIGHLIGHTS (`next.config.ts`)

| Feature | Configuration |
|---|---|
| Image CDN | Supabase `*.supabase.co` and `*.supabase.in` storage URLs allowed |
| Image formats | AVIF + WebP |
| Console removal | `console.log` stripped in production (warn/error kept) |
| Powered-By header | Removed (`poweredByHeader: false`) |
| React strict mode | Enabled |

### Redirects (VERIFIED)
- `www.nuttytales.com` → `www.nutytales.com` (301)
- `/journal` → `/gastronomy-journal` (301)
- `/gastronomy` → `/gastronomy-journal` (301)
- `/shop/afghani-anjeer-dried-figs` → `/shop/afghan-anjeer-wild-figs` (301)

### Rewrites (VERIFIED)
- Firebase Auth custom domain proxied: `/__/auth/*` → `nutty-tales-1c667.firebaseapp.com`
- Wholesale SEO aliases: `/almonds-wholesale`, `/cashews-wholesale`, `/makhana-wholesale`
- Crafts aliases: `/kashmir-crafts`, `/kani-shawls`, `/sozni-shawls`
- Stays aliases: `/hotels/srinagar`, `/hotels/gulmarg`, `/boutique-stays/kashmir`
- Wedding aliases: `/wedding-planners/kashmir`, `/wedding-venues/kashmir`

---

## 5. SUPABASE PROJECT INTEGRATION

**Project URL:** `https://qezkjbzmtfjjmqgzgili.supabase.co`  
**Project ID:** `qezkjbzmtfjjmqgzgili`  
**Firebase Project:** `nutty-tales-1c667`

### Client Architecture (`src/lib/supabase.ts`)
- `getSupabaseClient()` — browser singleton with session persistence
- `getAuthenticatedSupabaseClient(idToken)` — pass Firebase ID token as Bearer for RLS
- `getSupabaseAdmin()` — server-side with service role key; falls back to anon key if service role unavailable

### Supabase Migrations (VERIFIED — 4 files)
| Migration | Tables Created |
|---|---|
| `001_firebase_auth_profiles.sql` | `public.profiles` |
| `002_weddings_platform_schema.sql` | `wedding_projects`, `wedding_events`, `wedding_venues`, `wedding_vendors`, `wedding_enquiries`, `wedding_budget_items`, `wedding_guests`, `wedding_tables`, `wedding_tasks`, `wedding_activity_logs` |
| `003_stays_platform_schema.sql` | (stays tables — confirmed filename exists) |
| `004_seller_central_platform.sql` | `sellers`, seller commerce tables |

### Row-Level Security
- `profiles`: users see only own row; service_role bypass; email/role cannot be self-modified
- `wedding_venues` / `wedding_vendors`: public SELECT allowed; mutations service_role only
- `wedding_projects` and related: service_role full bypass; user isolation enforced

---

## 6. AUTHENTICATION IMPLEMENTATION (DUAL-STACK)

### Stack A: Firebase Auth (Primary — Customer-Facing)
**Location:** `src/lib/firebase/client.ts`, `src/context/AuthContext.tsx`

| Method | Status |
|---|---|
| Google OAuth Sign-In | IMPLEMENTED |
| Google One Tap | Component exists (`GoogleOneTap.tsx`) |
| Email + Password | IMPLEMENTED |
| Phone OTP (Firebase reCAPTCHA) | IMPLEMENTED |
| Password Reset | IMPLEMENTED |

**Token Flow:**
1. Firebase issues ID token (JWT)
2. `AuthContext` calls `POST /api/auth/sync-profile` with Bearer token
3. Server verifies token via Firebase Admin SDK
4. Supabase `profiles` row is created/updated
5. `idToken` passed to `getAuthenticatedSupabaseClient` for RLS

**Cookie used for middleware:** `nt_uid` (set after auth sync)  
**Token refresh interval:** 15 minutes

### Stack B: NextAuth 5 (B2B / Seller Portal)
**Location:** `src/lib/auth.ts`

- Strategy: JWT (stateless)
- Provider: Credentials (email + bcrypt password)
- User source: Prisma `users` table
- Role field: `Role` enum (`SUPER_ADMIN`, `ADMIN`, `CUSTOMER`, `SUPPLIER`, etc.)
- B2B approval flag: `isB2BApproved` from `businessAccount.isApproved`

---

## 7. PRISMA SCHEMA — DATABASE TABLES (ALL VERIFIED)

**Database:** Supabase PostgreSQL (via `DATABASE_URL` + `DIRECT_URL`)

### Core Tables
| Model | Table Name | Purpose |
|---|---|---|
| User | `users` | Customers, staff, B2B buyers |
| Account | `accounts` | OAuth provider links |
| Session | `sessions` | NextAuth sessions |
| VerificationToken | `verification_tokens` | Email verification |
| BusinessAccount | `business_accounts` | B2B buyer profiles with credit |
| Address | `addresses` | Delivery/billing addresses |
| Location | `locations` | Noida / Srinagar / Patna warehouses |
| Warehouse | `warehouses` | Physical storage facilities |
| Category | `categories` | Product taxonomy |
| Product | `products` | Master product catalogue |
| ProductVariant | `product_variants` | SKU/weight variants (250g, 500g, 1kg…) |
| ProductImage | `product_images` | Product photos |
| B2bPriceTier | `b2b_price_tiers` | Quantity-break pricing |
| CustomerPrice | `customer_prices` | Negotiated per-buyer pricing |
| Inventory | `inventory` | Stock levels per warehouse |
| InventoryMovement | `inventory_movements` | Stock audit log |
| Supplier | `suppliers` | Procurement suppliers |
| SupplierProduct | `supplier_products` | Supplier pricing |
| Cart | `carts` | Server-side cart (B2B / logged in) |
| CartItem | `cart_items` | Cart line items |
| Order | `orders` | Customer orders |
| OrderItem | `order_items` | Order line items |
| Payment | `payments` | Payment records (Razorpay fields present) |
| Shipment | `shipments` | Dispatch/carrier records |
| Quote | `quotes` | B2B RFQ quotes |
| QuoteItem | `quote_items` | Quote line items |
| Invoice | `invoices` | GST invoices |
| Review | `reviews` | Product reviews |
| Lead | `leads` | CRM leads |
| BlogPost | `blog_posts` | Content |
| SeoMetadata | `seo_metadata` | CMS SEO overrides |
| FssaiRecord | `fssai_records` | FSSAI licence records |
| ComplianceDocument | `compliance_documents` | Regulatory docs |
| SampleRequest | `sample_requests` | B2B sample requests |
| SupportTicket | `support_tickets` | Customer support |
| Notification | `notifications` | Push/in-app notifications |
| AuditLog | `audit_logs` | Action audit trail |
| SeoPageCandidate | `seo_page_candidates` | SEO demand pipeline |
| SeoPageRecord | `seo_pages` | Published SEO pages |
| SeoEntity | `seo_entities` | Geographic/product entities |
| SeoEntityRelation | `seo_entity_relations` | Entity graph |
| SeoDemandSignalRecord | `seo_demand_signals` | Search intent signals |
| SeoSupplyGapRecord | `seo_supply_gaps` | Content gap tracking |
| SeoConversionRecord | `seo_conversions` | Attribution tracking |
| SeoGscTelemetryRecord | `seo_gsc_telemetry` | Google Search Console data |
| GscOptimizationLog | `gsc_optimization_logs` | SEO agent audit (14-day freeze) |
| StayHost | `stay_hosts` | Hospitality hosts |
| StayListing | `stay_listings` | Property listings |
| StayRoom | `stay_rooms` | Rooms within listings |
| StayReservation | `stay_reservations` | Booking records |
| StayReview | `stay_reviews` | Property reviews |
| StayTrip | `stay_trips` | Group trip planning |
| StayService | `stay_services` | Add-on services |

**IMPORTANT NOTE:** The Prisma schema (Prisma ORM tables) and the Supabase migrations (Supabase-native SQL) are **two separate data stores.** Prisma connects via `DATABASE_URL` to Supabase PostgreSQL, but many Supabase tables (profiles, wedding tables, stay Prisma models) are managed differently. Migration sync status is **UNVERIFIED** (no `prisma db pull` or `supabase status` output available without network access).

---

## 8. PRODUCT CATALOGUE (VERIFIED — STATIC FILE)

**Source:** `src/lib/products-data.ts` (1,745 lines — TypeScript constant)  
**Count:** 25 products (inferred from file size and `PRODUCTS` array)  
**Pricing:** Dual-mode — retail variants (250g, 500g, 1kg) + B2B tiers (5–100+ kg)

### Product Categories (VERIFIED from source)
- Makhana (Fox Nuts) — Bihar/Mithila origin
- California Almonds
- Kashmiri Mamra Badam
- Kashmiri Walnuts (in-shell)
- W240 Premium Cashews / King Jumbo W180 Cashews
- Kashmiri Mongra Saffron / Iranian Super Negin Saffron
- Pure Kashmiri Acacia Honey
- Iranian Pistachios
- Turkish Anjeer (Figs) / Afghan Kandahari Mala Anjeer
- Kishmish (Green Afghan Raisins)
- Jumbo Black Munakka
- Ladakh Halman Wild Apricots
- Royal Ajwa Dates
- Gurbandi Badam (Afghan Almonds)

### Pricing Model
- Retail pricing: per-variant (250g, 500g, 1kg)
- B2B tiers: 5kg (−5%), 10kg (−8%), 25kg (−12%), 50kg (−15%), 100kg+ (contact for quote)
- MRP strikethrough shown on retail

**⚠️ CRITICAL GAP:** The shop catalogue is a static file. It is NOT connected to the Prisma `products` database. Cart items created from the shop page carry `productId` from the static file but cannot be joined to Prisma `product_variants` for real-time inventory checks.

---

## 9. CART IMPLEMENTATION (VERIFIED)

**Storage:** `localStorage` key `nt_cart` (client-side only)  
**Cart data structure:** Array of `CartItem` objects with fields: `productId`, `name`, `slug`, `sizeLabel`, `unitPrice`, `quantity`, `totalPrice`, `image`, `mode` (retail|wholesale)  
**Coupon storage:** `localStorage` key `nt_applied_coupon`  
**Address persistence:** `localStorage` key `nt_saved_address`

**Verified coupons (hardcoded in `src/lib/coupons.ts`):**
| Code | Type | Value | Min Order |
|---|---|---|---|
| `NUTY10` | percentage | 10% | ₹999 |
| `KASHMIR200` | fixed | ₹200 | ₹1,499 |
| `FREESHIP` | shipping | free | ₹499 |
| `FESTIVE15` | percentage | 15% | ₹2,499 |

**Free shipping threshold:** ₹999

---

## 10. CHECKOUT IMPLEMENTATION (VERIFIED)

**Page:** `src/app/checkout/page.tsx` (789 lines, `'use client'`)

### Implemented
- Cart loaded from localStorage
- Coupon discount applied
- Shipping calculated (free above ₹999)
- Customer form: name, phone, email, address, city, state, pincode
- B2B mode: company name + GSTIN
- Google quick sign-in on checkout page
- Order ID generated client-side: `NT-ORD-{year}-{random6}`
- `POST /api/orders` called with payload
- Order saved to localStorage (`nt_last_order`, `nt_order_history`)
- Cart cleared on success
- Confirmation screen with order ID, delivery estimate, WhatsApp link

### Payment Methods Displayed (UI ONLY)
| Method | Label | Backend Status |
|---|---|---|
| `upi` | UPI / Credit Card / Debit Card (Razorpay Instant) | **UI ONLY** — No Razorpay order creation call wired |
| `neft` | B2B Bank Transfer (NEFT/RTGS/IMPS) | Bank details shown in confirmation (HARDCODED — see security note) |
| `whatsapp` | WhatsApp Concierge | Redirect to WhatsApp |
| `cod` | Cash on Delivery | No COD verification |

**⚠️ CRITICAL FINDING — RAZORPAY NOT WIRED:**  
The checkout page shows "UPI / Credit Card / Debit Card (Razorpay Instant)" as a payment option, but the `handleSubmit` function does **not** call Razorpay's `window.Razorpay` script, create a Razorpay order via API, or verify any payment signature. Selecting `upi` and submitting produces a confirmed order without any payment capture.

**⚠️ SECURITY — HARDCODED BANK DETAILS IN SOURCE:**  
The NEFT confirmation panel in `checkout/page.tsx` (lines 270–276) contains hardcoded bank account number `50200088910412` and IFSC `HDFC0001234`. These appear to be placeholder/test values but are exposed in client-side source code.

---

## 11. ORDER MANAGEMENT (VERIFIED)

**API Route:** `POST /api/orders/route.ts`

Flow:
1. Generates order ID (uses `referenceId` from body or generates new)
2. Calls `syncConsumerOrderToSellers()` — splits multi-vendor order into seller sub-orders
3. Inserts lead record into Supabase `leads` table
4. Returns `{ success, orderId, amount, paymentMethod, sellerOrdersCount }`

**No Prisma `Order` record is created** — the `/api/orders` endpoint writes to Supabase `leads` table only (not the full order schema). The Prisma orders table appears unused in the current checkout flow.

**Order tracking:** `src/app/orders/track/page.tsx` — reads from localStorage; falls back to a HARDCODED mock order display for any valid-format ID.

---

## 12. PAYMENT INTEGRATION — RAZORPAY STATUS

**Environment variables declared in `.env.example`:**
- `RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx`
- `RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx`

**Razorpay `rzp_test_` prefix** — indicating test mode keys in the example.

### What Is NOT Implemented (VERIFIED by code inspection)
- ❌ No `/api/razorpay/create-order` route
- ❌ No `/api/razorpay/verify-payment` route (signature verification)
- ❌ No `/api/razorpay/webhook` route
- ❌ No Razorpay checkout script loaded on checkout page
- ❌ No duplicate payment prevention logic
- ❌ No refund handling

### What IS Present (Schema Level)
- ✅ Prisma `Payment` model has `gatewayOrderId`, `gatewayPaymentId`, `gatewaySignature` fields
- ✅ Prisma `StayReservation` model has `paymentGatewayOrderId`, `paymentGatewayPaymentId`
- ✅ `.env.example` shows correct Razorpay key structure

**VERDICT:** Razorpay is configured at schema and environment level but **not implemented in the checkout flow**. The database schema is ready for it. The UI mentions it. No actual payment processing occurs.

---

## 13. SELLER PORTAL (VERIFIED — PRODUCTION-READY PER INTERNAL AUDIT)

**Domain:** `seller.nutytales.com` (middleware handles subdomain routing to `/seller/*`)  
**Routing:** Middleware rewrites `seller.nutytales.com/*` → `/seller/*`  
**Auth:** Firebase ID token + NextAuth JWT via `src/lib/seller-portal/auth-server.ts`

### Test Results (as documented in `SELLER_PORTAL_IMPLEMENTATION_STATUS.md`)
```
5/5 test suites passed (12/13 tests per status doc; 12 per test output)
auth-rbac.test.ts: 4 tests ✓
tenant-isolation.test.ts: 3 tests ✓  
persistence-restart.test.ts: 1 test ✓
order-sync.test.ts: 1 test ✓
ledger-finance.test.ts: 3 tests ✓
```

**CAVEAT:** Test results are sourced from the `SELLER_PORTAL_IMPLEMENTATION_STATUS.md` file. Actual live test execution was not performed during this audit.

### Key Architecture
- **Persistence:** File-backed JSON in `.data/seller-central/` (13 JSON collections)
- **Atomic writes:** Temp file + replace pattern with cross-platform fallback
- **Commission rate:** 0% (introductory) — configurable per seller
- **Order split:** Multi-vendor cart items partitioned by seller at checkout

---

## 14. SEO IMPLEMENTATION (VERIFIED)

### Sitemap Architecture
- `src/app/sitemap.ts` — root sitemap generator
- `src/app/sitemaps/[shard]/route.ts` — programmatic shard delivery
- Per-vertical sitemaps: `business/sitemap.ts`, `crafts/sitemap.ts`, `gifting/sitemap.ts`, `me/sitemap.ts`, `eu/sitemap.ts`, `nri/sitemap.ts`, `stays/sitemap.ts`, `travel/sitemap.ts`, `us/sitemap.ts`, `weddings/sitemap.ts`
- `sitemap_index.xml` served as static file with CDN bypass

### SEO Infrastructure Libraries (`src/lib/seo/`)
- `engine.ts` — SEO demand scoring engine
- `governor.ts` — page publication governance
- `demand.ts` — demand signal processing
- `geo.ts` — geographic entity data
- `commercial-hubs.ts` — B2B commercial hub data
- `metadata.ts` — metadata generation helpers
- `sitemap.ts` — sitemap generation
- `revenue.ts` — conversion attribution
- `links.ts` — internal linking
- `pincodes.ts` — India pincode data for local SEO

### GSC Agent (`src/app/api/gsc-agent/`)
- `update-meta` — rewrites title/description
- `inject-faq` — injects FAQ blocks
- `create-page` — creates new SEO pages
- `freeze-check` — enforces 14-day freeze between optimizations (Prisma `GscOptimizationLog`)
- `log` — audit logging

### IndexNow
- `src/app/api/seo/indexnow/route.ts` — manual trigger
- `src/app/api/cron/indexnow/route.ts` — Vercel cron at 02:00 UTC daily

### Robots.txt
- Generated dynamically in middleware (per vertical)
- Seller portal: `Disallow: /` (fully blocked)
- Main site: blocks `/cart`, `/checkout`, `/api/`, `/admin`, `/seller`, `/login`, `/search`
- AI crawlers (GPTBot, ClaudeBot, Google-Extended, OAI-SearchBot): explicitly `Allow: /`

### Schema.org / Structured Data
- Product pages: `Product` schema with `AggregateOffer` (verified in `/shop/[slug]/page.tsx`)
- `llms.txt` and `llms-full.txt` routes present for AI discovery

---

## 15. MULTI-SUBDOMAIN ARCHITECTURE

### Middleware Routing (VERIFIED — `src/middleware.ts`, 543 lines)

| Subdomain | Vertical Key | Routes Served |
|---|---|---|
| `nutytales.com` | (root) | `/`, `/shop`, `/cart`, `/checkout`, etc. |
| `seller.nutytales.com` | `seller` | `/seller/*` |
| `business.nutytales.com` | `business` | `/b2b/*` |
| `gifting.nutytales.com` | `gifting` | `/gifting/*` |
| `weddings.nutytales.com` | `weddings` | `/weddings/*` |
| `crafts.nutytales.com` | `crafts` | `/crafts/*` |
| `stays.nutytales.com` | `stays` | `/stays/*` |
| `travel.nutytales.com` | `travel` | `/travel/*` |
| `nri.nutytales.com` | `nri` | `/nri/*` |
| `middleeast.nutytales.com` | `middleeast/me` | `/me/*` |
| `europe.nutytales.com` | `europe/eu` | `/eu/*` |
| `america.nutytales.com` | `america/us` | `/us/*` |

All routing is single-application — one Next.js deployment serves all subdomains via middleware rewrites.

### Regional Storefronts
| Path Prefix | Region | Status |
|---|---|---|
| `/me/*` | Middle East | Pages exist: `page.tsx`, `cart`, `checkout`, `store`, `store/[slug]` |
| `/eu/*` | Europe/UK | Pages exist: same structure as `/me` |
| `/us/*` | North America | Pages exist: same structure as `/me` |

---

## 16. LEADS SYSTEM (VERIFIED)

**API:** `POST /api/leads/route.ts`  
**Database:** Supabase `leads` table (via `insertLead()` in `src/lib/supabase.ts`)  
**Lead fields:** name, phone, email, city, businessName, source, message, metadata

**Lead sources verified in code:**
- Checkout flow (every order creates a lead)
- `/api/business/rfq` (B2B RFQ form)
- `/api/gifting/campaign` (gifting enquiries)
- `/api/partners` (partner applications)
- `/api/opportunities` (business opportunities)

---

## 17. WEDDING HAMPERS (VERIFIED)

**Database function:** `insertWeddingHamper()` in `src/lib/supabase.ts`  
**Supabase table:** `wedding_hampers`  
**Fields:** coupleNames, weddingDate, boxType, items[], budgetPerBox, quantity, clientPhone, clientEmail

**NOTE:** `wedding_hampers` is referenced in `supabase.ts` but is NOT in the `002_weddings_platform_schema.sql` migration. This table may not yet exist in the database or may be managed separately.

---

## 18. GIFTING AND WHOLESALE (VERIFIED ROUTES)

### Gifting
- **Vertical:** `gifting.nutytales.com` / `/gifting/*`
- Pages: home, explore, product detail, cart, checkout, dashboard, designer, recipients, track
- API: `/api/gifting/campaign/route.ts`
- Library: `src/lib/gifting-marketplace-data.ts`
- Components: `GiftingShell.tsx`, `GiftingMarketplaceShell.tsx`, `SIGiftDesigner.tsx`, `PersonalizationModal.tsx`

### Corporate Gifting
- `/corporate-gifting/page.tsx` — separate landing page
- `/corporate-gifts/[...slug]/page.tsx` — dynamic corporate gift pages
- Component: `CorporateQuoteForm.tsx`

### Wholesale / B2B
- `/wholesale-dry-fruits/[slug]/[city]/page.tsx` — SEO pages for wholesale by city
- `/wholesale-dry-fruits/pincode/[pincode]/page.tsx` — pincode-level SEO
- `/b2b/*` — full B2B portal
- `/bulk-quote/page.tsx` — bulk enquiry form

---

## 19. STORAGE BUCKETS (DECLARED — NOT VERIFIED LIVE)

From `.env.example`:
- Bucket: `nuttytales-assets`
- CDN URL: `https://qezkjbzmtfjjmqgzgili.supabase.co/storage/v1/object/public/nuttytales-assets`

Seller portal upload (`/api/seller/upload`) uploads to this bucket with local filesystem fallback (`public/uploads/seller-central/`).

No other buckets declared in code. Wedding media, stay listing images, and crafts images appear to use external URLs (Unsplash or Supabase storage paths).

---

## 20. ENVIRONMENT VARIABLES (FROM `.env.example`)

| Variable | Purpose | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Hardcoded fallback in supabase.ts |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Required for RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase admin | Never expose to browser |
| `DATABASE_URL` | Prisma DB connection (pgbouncer) | Required |
| `DIRECT_URL` | Prisma direct connection | Required for migrations |
| `NEXTAUTH_SECRET` | NextAuth JWT signing | Required |
| `RAZORPAY_KEY_ID` | Razorpay gateway key | Test prefix in example |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | Server-only |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client-side Razorpay key | Exposed to browser |
| `RESEND_API_KEY` | Email via Resend | For transactional email |
| `FIREBASE_PROJECT_ID` | Firebase Admin | Server-only |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin | Server-only |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin | Server-only — never expose |
| `ADMIN_SECRET` | Admin route protection | Protect rigorously |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 | Client-side |
| `NEXT_PUBLIC_FSSAI_NUMBER` | FSSAI licence display | Public |

---

## AUDIT CONFIDENCE LEVELS

| Section | Confidence | Method |
|---|---|---|
| File structure | HIGH | Direct directory enumeration |
| Next.js config | HIGH | Full file read |
| Prisma schema | HIGH | Full schema read (1,537 lines) |
| Supabase migrations | HIGH | All 4 migration files read |
| Checkout flow | HIGH | Full page file read (789 lines) |
| Cart implementation | HIGH | Full page file read |
| Order API | HIGH | Full route file read |
| Auth implementation | HIGH | Full context and lib files read |
| Middleware routing | HIGH | Full file read (543 lines) |
| Product catalogue | HIGH | File header + structure confirmed |
| Razorpay status | HIGH | Absence verified by code inspection |
| Live DB state | NONE | No database connection during audit |
| Supabase bucket contents | NONE | No network access during audit |
| Vercel deployment | NONE | No Vercel CLI access |
| MiroFish assessment | MEDIUM | Web research (no repo clone) |
