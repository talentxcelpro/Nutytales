# NUTY TALES — CUSTOMER JOURNEY INVENTORY
**Date:** 2026-10-30  
**Scope:** nutytales.com primary shopping platform (dry fruits B2C and B2B)  
**Methodology:** Code inspection — implementation status is based on verified source reading, not assumptions from route existence.

---

## JOURNEY 1: HOMEPAGE

**URL:** `https://nutytales.com/`  
**File:** `src/app/page.tsx`  
**Rendering:** RSC (Server Component) — ISR with cache headers

### Components (VERIFIED by file listing)
- `Hero.tsx` / `HeroBannerSuite.tsx` / `IntelligentDiscoveryHero.tsx`
- `HomepageHero3D.tsx` (Three.js 3D product viewer)
- `CategoryTiles.tsx`
- `PopularProducts.tsx`
- `ShopBestsellersSection.tsx`
- `BrandStorySection.tsx`
- `KashmirSection.tsx`
- `WinterCraftsSpotlight.tsx`
- `GiftsForEveryStory.tsx`
- `WholesaleEditorialSection.tsx`
- `CorporateEditorialSection.tsx`
- `BusinessSupplyBanner.tsx`
- `GlobalMarketplaceSections.tsx`
- `GroupPortfolioShowcase.tsx`
- `DiscoverSection.tsx`
- `MakhanaPromoSpotlight.tsx`
- `SocialProofToast.tsx`
- `DynamicCouponStrip.tsx`
- `SIFloatingAssistant.tsx` (AI concierge overlay)

### APIs
- None at homepage load (product data from static `PRODUCTS` constant)
- Revenue telemetry: `POST /api/revenue-os/telemetry` (client-side on search)

### Database Dependencies
- None (static product data)

### Expected Result
- Hero banner loads, product tiles render, 3D viewer loads if device capable
- Promotional makhana spotlight visible

### Current Implementation Status
✅ **IMPLEMENTED** — All component files exist. Static data-driven.

### Missing Dependencies
- None identified for homepage render
- `HomepageHero3D.tsx` requires device capability check (`DeviceCapability.ts`) — confirmed present

---

## JOURNEY 2: PRODUCT DISCOVERY (SHOP)

**URL:** `https://nutytales.com/shop`  
**File:** `src/app/shop/page.tsx` + `src/components/shop/ShopCatalogClient.tsx`  
**Rendering:** ISR with `revalidate = 3600`

### Components
- `ShopCatalogClient.tsx` — main catalogue with filtering
- `ShopHomeHero.tsx`
- `ShopCategoriesGrid.tsx`
- `ShopProductCard.tsx`
- `ShopFeaturedCollections.tsx`
- `ShopBestsellersSection.tsx`
- `QuickViewModal.tsx`
- `BestsellerBundles.tsx`
- `HealthGoalFilter.tsx`
- `PrecisionHarvestCommandBar.tsx`
- `KernelRadarCompareModal.tsx`
- `BioRationSynthesizerModal.tsx`
- `ShopProvenanceStory.tsx`
- `ShopTrustAndGuarantee.tsx`
- `ExitIntentModal.tsx`

### APIs
- None for catalogue listing (static data)
- Cart additions write to localStorage

### Database Dependencies
- None for product listing (static `PRODUCTS` array)

### Expected Result
- 25 products rendered with category filters, price display, add-to-cart
- Quick view modal with variant selection

### Current Implementation Status
✅ **IMPLEMENTED** — Fully static, no database dependency

### Missing Dependencies
- Real-time inventory status not connected (stock status is hardcoded in `products-data.ts`)
- No server-side search (client-side filter only)

---

## JOURNEY 3: CATEGORY NAVIGATION

**URL:** `https://nutytales.com/shop?category={slug}` (query param filtering)  
**Also:** Individual category landing pages exist for key products: `/makhana`, `/pashmina-shawls`

### Implementation
- Category filtering handled client-side in `ShopCatalogClient.tsx` via URL query params
- No separate `/category/[slug]` route for dry fruits (unlike crafts which has `/crafts/[category]`)

### Current Implementation Status
✅ **IMPLEMENTED** (client-side filtering)  
⚠️ **PARTIAL** — No SEO-optimized individual category pages for each dry fruit category (e.g., no `/shop/almonds`, `/shop/cashews` routes)

---

## JOURNEY 4: PRODUCT DETAIL

**URL:** `https://nutytales.com/shop/{slug}`  
**File:** `src/app/shop/[slug]/page.tsx` + `src/components/products/ProductDetailClient.tsx`  
**Rendering:** Static generation (`generateStaticParams`) + ISR

### Components
- `ProductDetailClient.tsx` — variant selector, add-to-cart, B2B toggle
- `TransparentProductImage.tsx`
- `ProductViewer3D.tsx` (Three.js 3D viewer)
- Breadcrumb navigation
- Related products grid
- Schema.org Product structured data (JSON-LD)

### Features (VERIFIED)
- Slug aliasing system (60+ alias mappings) — `/almonds` → `/california-almonds-premium`
- 250g, 500g, 1kg retail variant selection
- B2B bulk tier display (5kg, 10kg, 25kg, 50kg)
- Add-to-cart writes to localStorage
- Nutrition information display
- Origin, grade, shelf life display
- FSSAI license number displayed

### APIs
- None for product data (static)
- Cart: localStorage write

### Database Dependencies
- None for product display

### Expected Result
- Product page loads with variant picker, price display, nutrition table, related products
- Add to cart creates localStorage entry

### Current Implementation Status
✅ **IMPLEMENTED** — Fully functional for all 25 products

### Missing Dependencies
- No live review display (reviews table exists in Prisma but not fetched on product page)
- No real-time inventory/stock check

---

## JOURNEY 5: SEARCH

**URL:** `https://nutytales.com/search?q={query}`  
**File:** `src/app/search/page.tsx`  
**Rendering:** Client component with Suspense

### Components
- Cross-vertical marketplace search
- NLP intent detection via `parseCustomerIntent()` in `src/lib/marketplace-graph.ts`
- Vertical filter (all, dry fruits, gifting, crafts, stays, travel, etc.)
- Currency selector for international pricing
- Max price filter

### APIs
- Revenue telemetry: `POST /api/revenue-os/telemetry` (debounced 800ms)

### Database Dependencies
- None (in-memory marketplace graph from static data libraries)

### Expected Result
- Query returns filtered results across all platform verticals
- Natural language intent parsed (e.g. "cashews for Diwali" → gifting category highlighted)

### Current Implementation Status
✅ **IMPLEMENTED** — Cross-vertical search with intent detection

### Missing Dependencies
- No full-text search (Supabase/Postgres FTS or Algolia) — relies on client-side filtering of static data
- No search analytics stored per query

---

## JOURNEY 6: CART

**URL:** `https://nutytales.com/cart`  
**File:** `src/app/cart/page.tsx` (430 lines)  
**Rendering:** Client component

### Components
- Cart item list with quantity controls
- Coupon input + apply/remove
- Order summary with subtotal, discount, shipping
- Free shipping progress bar
- WhatsApp quick order alternative

### Features (VERIFIED)
- Quantity update (±1 buttons)
- Remove individual items
- Clear all items
- Coupon validation against `DYNAMIC_COUPONS` (hardcoded)
- Free shipping threshold at ₹999
- Wholesale mode badge display

### APIs
- None (pure localStorage)

### Database Dependencies
- None

### Expected Result
- Cart renders items from localStorage, coupon applied/removed, totals calculated

### Current Implementation Status
✅ **IMPLEMENTED** — Fully functional client-side cart

### Missing Dependencies
- No server-side cart persistence for logged-in users (Prisma `Cart` table exists but is not used by the consumer cart)
- No cart recovery across devices
- No guest → member cart migration flow

---

## JOURNEY 7: CHECKOUT

**URL:** `https://nutytales.com/checkout`  
**File:** `src/app/checkout/page.tsx` (789 lines)  
**Rendering:** Client component

### Components
- Customer details form (name, phone, email, address, city, state, pincode)
- B2B mode toggle (company name, GSTIN)
- Payment method selector (UPI/Razorpay, NEFT, WhatsApp, COD)
- Firebase Google quick sign-in
- Order summary panel (sticky)
- Order confirmation screen post-submit

### APIs
- `POST /api/orders` — records order and splits to sellers
- Firebase Google sign-in (client-side)

### Database Dependencies
- Supabase `leads` table (order recorded as lead)
- `.data/seller-central/` JSON files (seller order split)

### Expected Result
- Form submitted → order ID generated → confirmation screen shown → cart cleared

### Current Implementation Status
⚠️ **PARTIAL** — Form, confirmation, and lead capture work. Payment is NOT implemented.

### Functional Gaps (VERIFIED)
1. **Razorpay payment not wired** — selecting "UPI / Razorpay" and confirming produces an order without any payment capture. `window.Razorpay` is never called.
2. **NEFT bank details hardcoded** — account number `50200088910412`, IFSC `HDFC0001234` are visible in client source
3. **COD** — no serviceable pin code validation
4. **No payment status tracking** — order is confirmed before payment is received
5. **No duplicate order prevention** — no idempotency key or dedup check
6. **Address not saved to Prisma** — address is saved to localStorage only

---

## JOURNEY 8: ADDRESS MANAGEMENT

**URL:** No dedicated address management page found  
**Current approach:** Addresses saved to `localStorage` key `nt_saved_address` during checkout

### Current Implementation Status
❌ **NOT IMPLEMENTED** as a dedicated feature  
- Prisma `Address` model exists
- No `/account/addresses` route
- No address CRUD API

---

## JOURNEY 9: PAYMENT

### Declared Payment Methods (from checkout UI)
| Method | Backend Status |
|---|---|
| UPI / Razorpay | ❌ No Razorpay order creation or verification |
| NEFT bank transfer | ⚠️ Manual (customer transfers, no automated confirmation) |
| WhatsApp | ⚠️ Redirect to WhatsApp only |
| COD | ⚠️ No pin code validation or COD order flagging |

### Current Implementation Status
❌ **NOT IMPLEMENTED** — No payment gateway is wired. All payment methods result in an order confirmation without any financial transaction.

### Missing Components
- Razorpay order creation API (`/api/razorpay/create-order`)
- Razorpay signature verification API (`/api/razorpay/verify-payment`)
- Razorpay webhook handler (`/api/razorpay/webhook`)
- Payment status → order status update logic
- Duplicate payment prevention
- Refund initiation

---

## JOURNEY 10: ORDER CONFIRMATION

**URL:** Inline on `/checkout` page (submitted state)  
**File:** `src/app/checkout/page.tsx` (lines 214–306)

### Features (VERIFIED)
- Order ID displayed
- Estimated delivery date (+3 days)
- Delivery address summary
- NEFT bank details displayed (when NEFT method selected)
- WhatsApp order update link
- "Track Live Delivery" link → `/orders/track?id={orderId}`
- "Continue Shopping" link

### Current Implementation Status
✅ **IMPLEMENTED** (UI) — but confirmation is displayed regardless of payment

---

## JOURNEY 11: ORDER TRACKING

**URL:** `https://nutytales.com/orders/track?id={orderId}`  
**File:** `src/app/orders/track/page.tsx` (374 lines)

### Features (VERIFIED)
- Order ID search input
- Reads from `nt_last_order` and `nt_order_history` localStorage
- 5-step delivery timeline (visual UI — static states, not real carrier data)
- Hardcoded carrier info: "Blue Dart / Delhivery", AWB "BD-AIR-88910412IN"
- For any valid format ID not in localStorage: shows MOCK order data

### Current Implementation Status
⚠️ **MOCK** — No real carrier tracking integration. Timeline is a static display with hardcoded "In Transit" as step 3. Fallback for unknown IDs shows fabricated order data.

### Missing Dependencies
- Real shipping partner API (Blue Dart / Delhivery webhook)
- Carrier AWB number stored per order
- Shipment status stored in Prisma `Shipment` model (schema exists, not used)

---

## JOURNEY 12: CUSTOMER ACCOUNT

**URL:** No dedicated account dashboard found  
**Login:** `src/app/login/page.tsx` — Firebase Auth modal

### What Exists
- Firebase auth context manages user session
- Supabase `profiles` table for profile data
- Prisma `User` model for B2B accounts

### What is Missing
- No `/account/profile` page
- No `/account/orders` page
- No `/account/addresses` page
- No order history page accessible to consumer

### Current Implementation Status
❌ **NOT IMPLEMENTED** for consumer accounts  
✅ B2B account page exists at `/b2b/account`

---

## JOURNEY 13: WHOLESALE ENQUIRY

**URL:** `https://nutytales.com/bulk-quote`  
**URL:** `https://nutytales.com/wholesale-dry-fruits`  
**API:** `POST /api/business/rfq`

### Features
- Bulk quote form at `/bulk-quote`
- Wholesale SEO landing pages by product and city
- B2B RFQ via `/api/business/rfq`
- Enquiries stored in Supabase `leads` table

### Current Implementation Status
✅ **IMPLEMENTED** — Lead capture and enquiry form functional

---

## JOURNEY 14: GIFTING ENQUIRY

**URL:** `https://nutytales.com/corporate-gifting` (root domain)  
**URL:** `https://gifting.nutytales.com` (gifting vertical)  
**API:** `POST /api/gifting/campaign`

### Features
- Corporate gifting landing page
- `CorporateQuoteForm.tsx` component
- `CorporateQuoteModal.tsx` component
- `ExecutiveSampleHamperDesk.tsx`
- Gifting platform: explore, product detail, cart, checkout, designer
- Gift designer: `SIGiftDesigner.tsx` (AI gift designer component)
- Personalization modal

### Current Implementation Status
✅ **IMPLEMENTED** for enquiry capture and gifting browse  
⚠️ **PARTIAL** for gifting cart/checkout (same localStorage pattern — payment not wired)

---

## SUMMARY TABLE

| Journey | Status | Critical Gap |
|---|---|---|
| 1. Homepage | ✅ Implemented | — |
| 2. Product Discovery | ✅ Implemented | Static data only |
| 3. Category Navigation | ✅ Client-side | No SEO category pages |
| 4. Product Detail | ✅ Implemented | No live reviews |
| 5. Search | ✅ Implemented | Client-side only |
| 6. Cart | ✅ Implemented | No server persistence |
| 7. Checkout | ⚠️ Partial | **Razorpay not wired** |
| 8. Address Management | ❌ Missing | No account/address page |
| 9. Payment | ❌ Not Implemented | **No payment captured** |
| 10. Order Confirmation | ✅ UI Only | Shown without payment |
| 11. Order Tracking | ⚠️ Mock | Static, fabricated data |
| 12. Customer Account | ❌ Missing | No account dashboard |
| 13. Wholesale Enquiry | ✅ Implemented | — |
| 14. Gifting Enquiry | ✅ Implemented | Payment partial |
