# NUTY TALES — COMPLETE ROUTE INVENTORY
**Date:** 2026-10-30  
**Source:** Direct enumeration of `src/app/` directory

> Routes listed here exist as files. Functional status is assessed separately in CUSTOMER_JOURNEYS.md.
> ✅ = Implemented | ⚠️ = Partial | ❌ = Shell/placeholder

---

## ROOT DOMAIN — nutytales.com

### Core Commerce Routes
| Route | File | Status | Notes |
|---|---|---|---|
| `/` | `src/app/page.tsx` | ✅ | Homepage |
| `/shop` | `src/app/shop/page.tsx` | ✅ | Product catalogue (static data) |
| `/shop/[slug]` | `src/app/shop/[slug]/page.tsx` | ✅ | Product detail + slug aliasing |
| `/cart` | `src/app/cart/page.tsx` | ✅ | localStorage cart |
| `/checkout` | `src/app/checkout/page.tsx` | ⚠️ | Form only — Razorpay NOT wired |
| `/orders/track` | `src/app/orders/track/page.tsx` | ⚠️ | localStorage + mock fallback |
| `/search` | `src/app/search/page.tsx` | ✅ | Cross-vertical marketplace search |

### Auth & Account
| Route | File | Status | Notes |
|---|---|---|---|
| `/login` | `src/app/login/page.tsx` | ✅ | Firebase Auth modal + NextAuth |
| `/__/auth/[...path]` | `src/app/__/auth/[...path]/route.ts` | ✅ | Firebase custom domain proxy |

### Content & Brand
| Route | File | Status | Notes |
|---|---|---|---|
| `/gastronomy-journal` | `src/app/gastronomy-journal/page.tsx` | ✅ | Blog/journal |
| `/founders` | `src/app/founders/page.tsx` | ✅ | Founders page |
| `/technology` | `src/app/technology/page.tsx` | ✅ | Technology page |
| `/about` | Not found | ❌ | No about page file exists |
| `/contact` | `src/app/contact/page.tsx` | ✅ | Contact page |
| `/privacy` | `src/app/privacy/page.tsx` | ✅ | Privacy policy |
| `/terms` | `src/app/terms/page.tsx` | ✅ | Terms of service |
| `/shipping` | `src/app/shipping/page.tsx` | ✅ | Shipping policy |
| `/pashmina-shawls` | `src/app/pashmina-shawls/page.tsx` | ✅ | Crafts landing |
| `/makhana` | `src/app/makhana/page.tsx` | ✅ | Makhana landing |

### Occasions & Collections
| Route | File | Status | Notes |
|---|---|---|---|
| `/occasions` | `src/app/occasions/page.tsx` | ✅ | Occasions index |
| `/occasions/[slug]` | `src/app/occasions/[slug]/page.tsx` | ✅ | Occasion detail |
| `/festivals` | `src/app/festivals/page.tsx` | ✅ | Festival index |
| `/festivals/[slug]` | `src/app/festivals/[slug]/page.tsx` | ✅ | Festival detail |
| `/seasons` | `src/app/seasons/page.tsx` | ✅ | Seasonal collections |
| `/seasons/[slug]` | `src/app/seasons/[slug]/page.tsx` | ✅ | Season detail |
| `/life-events` | `src/app/life-events/page.tsx` | ✅ | Life events |
| `/life-events/[slug]` | `src/app/life-events/[slug]/page.tsx` | ✅ | Life event detail |
| `/explore` | `src/app/explore/page.tsx` | ✅ | Discovery page |
| `/marketplace` | `src/app/marketplace/page.tsx` | ✅ | Marketplace hub |

### Wholesale & B2B SEO
| Route | File | Status | Notes |
|---|---|---|---|
| `/wholesale-dry-fruits` | `src/app/wholesale-dry-fruits/page.tsx` | ✅ | Wholesale hub |
| `/wholesale-dry-fruits/[slug]` | `src/app/wholesale-dry-fruits/[slug]/page.tsx` | ✅ | Product wholesale |
| `/wholesale-dry-fruits/[slug]/[city]` | `src/app/wholesale-dry-fruits/[slug]/[city]/page.tsx` | ✅ | City-level SEO |
| `/wholesale-dry-fruits/kashmir` | `src/app/wholesale-dry-fruits/kashmir/page.tsx` | ✅ | Kashmir wholesale |
| `/wholesale-dry-fruits/noida` | `src/app/wholesale-dry-fruits/noida/page.tsx` | ✅ | Noida wholesale |
| `/wholesale-dry-fruits/patna` | `src/app/wholesale-dry-fruits/patna/page.tsx` | ✅ | Patna wholesale |
| `/wholesale-dry-fruits/pincode/[pincode]` | `src/app/wholesale-dry-fruits/pincode/[pincode]/page.tsx` | ✅ | Pincode SEO |
| `/bulk-quote` | `src/app/bulk-quote/page.tsx` | ✅ | Bulk enquiry |
| `/business-supply` | `src/app/business-supply/page.tsx` | ✅ | B2B supply landing |
| `/partners` | `src/app/partners/page.tsx` | ✅ | Partner programme |
| `/corporate-gifting` | `src/app/corporate-gifting/page.tsx` | ✅ | Corporate gifting landing |
| `/corporate-gifts` | `src/app/corporate-gifts/page.tsx` | ✅ | Corporate gifts catalogue |
| `/corporate-gifts/[...slug]` | `src/app/corporate-gifts/[...slug]/page.tsx` | ✅ | Dynamic gift pages |

### Destination Weddings
| Route | File | Status | Notes |
|---|---|---|---|
| `/destination-weddings` | `src/app/destination-weddings/page.tsx` | ✅ | Wedding destinations hub |
| `/destination-weddings/[destination]` | `src/app/destination-weddings/[destination]/page.tsx` | ✅ | Destination detail |
| `/wedding-return-gifts` | `src/app/wedding-return-gifts/page.tsx` | ✅ | Return gifts |
| `/rsvp/[id]` | `src/app/rsvp/[id]/page.tsx` | ✅ | Public RSVP page |
| `/venues` | `src/app/venues/page.tsx` | ✅ | Venues index |
| `/venues/[slug]` | `src/app/venues/[slug]/page.tsx` | ✅ | Venue detail |
| `/vendors` | `src/app/vendors/page.tsx` | ✅ | Vendors index |
| `/vendors/[slug]` | `src/app/vendors/[slug]/page.tsx` | ✅ | Vendor detail |

### SEO Infrastructure
| Route | File | Status | Notes |
|---|---|---|---|
| `/sitemap` | `src/app/sitemap/page.tsx` | ✅ | HTML sitemap |
| `sitemap.ts` | `src/app/sitemap.ts` | ✅ | XML sitemap generator |
| `/sitemaps/[shard]` | `src/app/sitemaps/[shard]/route.ts` | ✅ | Programmatic shards |
| `/robots.txt` | Generated in middleware | ✅ | Per-vertical robots |
| `/llms.txt` | `src/app/llms.txt/route.ts` | ✅ | AI crawler discovery |
| `/llms-full.txt` | `src/app/llms-full.txt/route.ts` | ✅ | Extended AI discovery |
| `manifest.ts` | `src/app/manifest.ts` | ✅ | PWA manifest |

---

## ADMIN — /admin/*
| Route | File | Status | Notes |
|---|---|---|---|
| `/admin/command-center` | `src/app/admin/command-center/page.tsx` | ⚠️ | Protected by `nt_uid` cookie |
| `/admin/partners` | `src/app/admin/partners/page.tsx` | ⚠️ | Admin partners view |
| `/admin/revenue-os` | `src/app/admin/revenue-os/page.tsx` | ⚠️ | Revenue dashboard |
| `/admin/seo` | `src/app/admin/seo/page.tsx` | ⚠️ | SEO admin |

**Auth:** Middleware checks `nt_uid` cookie; redirects to `/login?redirect=admin` if absent. No verified role-check beyond cookie presence.

---

## API ROUTES — /api/*

### Auth
| Route | Method | Purpose |
|---|---|---|
| `/api/auth/sync-profile` | POST, DELETE | Firebase → Supabase profile sync |

### Commerce
| Route | Method | Purpose |
|---|---|---|
| `/api/orders` | POST | Create order + lead + seller split |

### Business / B2B
| Route | Method | Purpose |
|---|---|---|
| `/api/business/account` | GET, POST | B2B account management |
| `/api/business/rfq` | POST | Request for quotation |

### Leads
| Route | Method | Purpose |
|---|---|---|
| `/api/leads` | POST | Lead capture |

### Gifting
| Route | Method | Purpose |
|---|---|---|
| `/api/gifting/campaign` | POST | Gifting enquiry |

### Crafts
| Route | Method | Purpose |
|---|---|---|
| `/api/crafts/wholesale` | POST | Craft wholesale enquiry |

### Stays
| Route | Method | Purpose |
|---|---|---|
| `/api/stays/search` | GET | Property search |
| `/api/stays/availability` | GET | Date availability |
| `/api/stays/reservation` | POST | Create reservation |
| `/api/stays/cancel` | POST | Cancel reservation |
| `/api/stays/reviews` | GET, POST | Property reviews |
| `/api/stays/messages` | GET, POST | Host-guest messaging |
| `/api/stays/ai-concierge` | POST | AI concierge |
| `/api/stays/ical/export` | GET | iCal export |
| `/api/stays/ical/import` | POST | iCal import |

### Weddings
| Route | Method | Purpose |
|---|---|---|
| `/api/weddings/enquiries` | POST | Wedding enquiry |
| `/api/weddings/intelligence` | POST | AI wedding intelligence |
| `/api/weddings/projects` | GET, POST | Wedding project management |
| `/api/weddings/workspace` | GET, PUT | Workspace data |

### Travel
| Route | Method | Purpose |
|---|---|---|
| `/api/travel/itinerary` | POST | Itinerary creation |

### NRI
| Route | Method | Purpose |
|---|---|---|
| `/api/nri/request` | POST | NRI service request |
| `/api/nri/status` | GET | Request status |
| `/api/nri/emergency` | POST | Emergency request |

### Seller Portal
| Route | Method | Purpose |
|---|---|---|
| `/api/seller/register` | POST | Seller registration |
| `/api/seller/auth/me` | GET | Current seller session |
| `/api/seller/products` | GET, POST | Product catalogue |
| `/api/seller/products/[id]` | GET, PUT, DELETE | Product CRUD |
| `/api/seller/orders` | GET | Seller orders |
| `/api/seller/orders/[id]` | GET, PUT | Order fulfillment |
| `/api/seller/inventory` | GET, PUT | Inventory management |
| `/api/seller/finance` | GET | Ledger and payouts |
| `/api/seller/customers` | GET | Customer directory |
| `/api/seller/reviews` | GET | Product reviews |
| `/api/seller/returns` | GET, POST | Returns management |
| `/api/seller/promotions` | GET, POST | Discount campaigns |
| `/api/seller/support` | GET, POST | Helpdesk |
| `/api/seller/storefront` | GET, PUT | Storefront customization |
| `/api/seller/upload` | POST | File/image upload |
| `/api/seller/admin` | GET, PUT | Admin seller moderation |

### Opportunities & Partners
| Route | Method | Purpose |
|---|---|---|
| `/api/opportunities` | POST | Business opportunities |
| `/api/partners` | POST | Partner applications |

### SEO & Infrastructure
| Route | Method | Purpose |
|---|---|---|
| `/api/seo/indexnow` | POST | Manual IndexNow submission |
| `/api/cron/indexnow` | GET | Scheduled IndexNow (Vercel cron) |
| `/api/gsc-agent/update-meta` | POST | Rewrite page title/description |
| `/api/gsc-agent/inject-faq` | POST | Inject FAQ blocks |
| `/api/gsc-agent/create-page` | POST | Create new SEO page |
| `/api/gsc-agent/freeze-check` | GET | 14-day freeze enforcement |
| `/api/gsc-agent/log` | POST | GSC agent audit log |
| `/api/supabase-health` | GET | Supabase connectivity check |
| `/api/revenue-os/telemetry` | POST | Revenue telemetry |

---

## VERTICAL: /gifting/* (gifting.nutytales.com)
| Route | File | Status |
|---|---|---|
| `/gifting` | `src/app/gifting/page.tsx` | ✅ |
| `/gifting/explore` | `src/app/gifting/explore/page.tsx` | ✅ |
| `/gifting/product/[slug]` | `src/app/gifting/product/[slug]/page.tsx` | ✅ |
| `/gifting/cart` | `src/app/gifting/cart/page.tsx` | ✅ |
| `/gifting/checkout` | `src/app/gifting/checkout/page.tsx` | ✅ |
| `/gifting/dashboard` | `src/app/gifting/dashboard/page.tsx` | ✅ |
| `/gifting/designer` | `src/app/gifting/designer/page.tsx` | ✅ |
| `/gifting/recipients` | `src/app/gifting/recipients/page.tsx` | ✅ |
| `/gifting/track` | `src/app/gifting/track/page.tsx` | ✅ |

---

## VERTICAL: /weddings/* (weddings.nutytales.com)
| Route | File | Status |
|---|---|---|
| `/weddings` | `src/app/weddings/page.tsx` | ✅ |
| `/weddings/workspace` | `src/app/weddings/workspace/page.tsx` | ✅ |
| `/weddings/dashboard` | `src/app/weddings/dashboard/page.tsx` | ✅ |
| `/weddings/planner` | `src/app/weddings/planner/page.tsx` | ✅ |
| `/weddings/inspiration` | `src/app/weddings/inspiration/page.tsx` | ✅ |
| `/weddings/venues` | `src/app/weddings/venues/page.tsx` | ✅ |
| `/weddings/venues/[slug]` | `src/app/weddings/venues/[slug]/page.tsx` | ✅ |
| `/weddings/vendors` | `src/app/weddings/vendors/page.tsx` | ✅ |
| `/weddings/vendors/[slug]` | `src/app/weddings/vendors/[slug]/page.tsx` | ✅ |
| `/weddings/vendor-portal` | `src/app/weddings/vendor-portal/page.tsx` | ✅ |
| `/weddings/rsvp/[id]` | `src/app/weddings/rsvp/[id]/page.tsx` | ✅ |
| `/weddings/wedding-return-gifts` | `src/app/weddings/wedding-return-gifts/page.tsx` | ✅ |
| `/weddings/admin` | `src/app/weddings/admin/page.tsx` | ✅ |

---

## VERTICAL: /stays/* (stays.nutytales.com)
| Route | File | Status |
|---|---|---|
| `/stays` | `src/app/stays/page.tsx` | ✅ |
| `/stays/[slug]` | `src/app/stays/[slug]/page.tsx` | ✅ |
| `/stays/hosts` | `src/app/stays/hosts/page.tsx` | ✅ |
| `/stays/group-quote` | `src/app/stays/group-quote/page.tsx` | ✅ |
| `/stays/dashboard` | `src/app/stays/dashboard/page.tsx` | ✅ |
| `/stays/trips` | `src/app/stays/trips/page.tsx` | ✅ |
| `/stays/wishlist` | `src/app/stays/wishlist/page.tsx` | ✅ |
| `/stays/admin` | `src/app/stays/admin/page.tsx` | ✅ |

---

## VERTICAL: /crafts/* (crafts.nutytales.com)
| Route | File | Status |
|---|---|---|
| `/crafts` | `src/app/crafts/page.tsx` | ✅ |
| `/crafts/kashmir` | `src/app/crafts/kashmir/page.tsx` | ✅ |
| `/crafts/kashmir/[category]` | `src/app/crafts/kashmir/[category]/page.tsx` | ✅ |
| `/crafts/product/[slug]` | `src/app/crafts/product/[slug]/page.tsx` | ✅ |
| `/crafts/shawls-stoles` | ✅ |
| `/crafts/accessories` | ✅ |
| `/crafts/heritage-home` | ✅ |
| `/crafts/jackets-coats` | ✅ |
| `/crafts/pherans` | ✅ |
| `/crafts/winter-wear` | ✅ |
| `/crafts/men` | ✅ |
| `/crafts/women` | ✅ |
| `/crafts/kids` | ✅ |
| `/crafts/wholesale` | ✅ |
| `/crafts/try-with-si` | ✅ |
| `/crafts/india` | ✅ |
| `/crafts/world` | ✅ |
| `/crafts/dashboard` | ✅ |

---

## VERTICAL: /travel/* (travel.nutytales.com)
| Route | File | Status |
|---|---|---|
| `/travel` | `src/app/travel/page.tsx` | ✅ |
| `/travel/builder` | `src/app/travel/builder/page.tsx` | ✅ |
| `/travel/kashmir` | `src/app/travel/kashmir/page.tsx` | ✅ |
| `/travel/kashmir/[slug]` | `src/app/travel/kashmir/[slug]/page.tsx` | ✅ |
| `/travel/dashboard` | `src/app/travel/dashboard/page.tsx` | ✅ |
| `/travel/partners` | `src/app/travel/partners/page.tsx` | ✅ |

---

## VERTICAL: /b2b/* (business.nutytales.com)
| Route | File | Status |
|---|---|---|
| `/b2b` | `src/app/b2b/page.tsx` | ✅ |
| `/b2b/catalog` | ✅ |
| `/b2b/rfq` | ✅ |
| `/b2b/quotes` | ✅ |
| `/b2b/orders` | ✅ |
| `/b2b/dashboard` | ✅ |
| `/b2b/account` | ✅ |
| `/b2b/invoices` | ✅ |
| `/b2b/deliveries` | ✅ |
| `/b2b/replenishment` | ✅ |
| `/b2b/suppliers` | ✅ |
| `/b2b/desk` | ✅ |
| `/b2b/certificates` | ✅ |

---

## VERTICAL: /nri/* (nri.nutytales.com)
| Route | File | Status |
|---|---|---|
| `/nri` | `src/app/nri/page.tsx` | ✅ |
| `/nri/services` | ✅ |
| `/nri/services/[category]` | ✅ |
| `/nri/marketplace` | ✅ |
| `/nri/providers` | ✅ |
| `/nri/business` | ✅ |
| `/nri/dashboard` | ✅ |
| `/nri/emergency` | ✅ |
| `/nri/how-it-works` | ✅ |
| `/nri/country/[slug]` | ✅ |
| `/nri/requests/[id]` | ✅ |
| `/nri/provider-workspace` | ✅ |
| `/nri/admin` | ✅ |

---

## REGIONAL STOREFRONTS

### Middle East (/me/*)
| Route | File |
|---|---|
| `/me` | `src/app/me/page.tsx` |
| `/me/store` | `src/app/me/store/page.tsx` |
| `/me/store/[slug]` | `src/app/me/store/[slug]/page.tsx` |
| `/me/cart` | `src/app/me/cart/page.tsx` |
| `/me/checkout` | `src/app/me/checkout/page.tsx` |

### Europe (/eu/*)
Same structure under `src/app/eu/`

### North America (/us/*)
Same structure under `src/app/us/`

---

## SELLER PORTAL: /seller/* (seller.nutytales.com)
| Route | File | Status |
|---|---|---|
| `/seller` | `src/app/seller/page.tsx` | ✅ |
| `/seller/register` | ✅ |
| `/seller/products` | ✅ |
| `/seller/products/new` | ✅ |
| `/seller/orders` | ✅ |
| `/seller/inventory` | ✅ |
| `/seller/analytics` | ✅ |
| `/seller/finance` | ✅ |
| `/seller/customers` | ✅ |
| `/seller/reviews` | ✅ |
| `/seller/returns` | ✅ |
| `/seller/promotions` | ✅ |
| `/seller/storefront` | ✅ |
| `/seller/support` | ✅ |
| `/seller/shipping` | ✅ |
| `/seller/team` | ✅ |
| `/seller/settings` | ✅ |
| `/seller/profile` | ✅ |
| `/seller/ecosystem` | ✅ |
| `/seller/marketplace-reach` | ✅ |
| `/seller/admin` | ✅ |

**Total estimated routes: ~150+**
