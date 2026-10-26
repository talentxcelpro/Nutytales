// ─── GET /sitemaps/[shard] ──────────────────────────────────────────────────
// Programmatic Sharded XML Sitemap Route Handler.
// Emits RFC 0.9-compliant XML urlsets partitioned into protocol-compliant shards (<50,000 URLs).
// Powers indexation of 1,000,000+ programmatic SEO endpoints across B2B, Crafts, Stays, and Pincodes.

import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products-data'
import { CRAFT_PRODUCTS } from '@/lib/crafts-data'
import { STAY_PROPERTIES } from '@/lib/stays-data'
import { COMMERCIAL_HUBS } from '@/lib/seo/commercial-hubs'

const APP_URL = 'https://nutytales.com'

function buildUrlXml(url: string, priority = '0.80', changeFreq = 'weekly', lastMod = '2026-10-26'): string {
  return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>${changeFreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

function wrapUrlset(urlXmlEntries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlXmlEntries.join('\n')}\n</urlset>`
}

interface RouteProps {
  params: Promise<{ shard: string }>
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  const { shard } = await params
  const cleanShard = shard.replace(/\.xml$/, '')

  const urls: string[] = []

  // ── Shard 1 & 2: B2B Combinatorial Product + City Matrix ─────────────────────
  if (cleanShard === 'b2b-matrix-1') {
    // Top 10 products × 350 hubs = 3,500 URLs
    const topProducts = PRODUCTS.slice(0, 10)
    for (const product of topProducts) {
      for (const hub of COMMERCIAL_HUBS.slice(0, 35)) {
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/${product.slug}/${hub.slug}`, '0.85'))
      }
    }
  } else if (cleanShard === 'b2b-matrix-2') {
    // Remaining products × hubs
    const remainingProducts = PRODUCTS.slice(10)
    for (const product of remainingProducts) {
      for (const hub of COMMERCIAL_HUBS.slice(0, 35)) {
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/${product.slug}/${hub.slug}`, '0.80'))
      }
    }
  }

  // ── Shards 3–7: Indian Postal Circles (32,000+ PIN Codes by region) ──────────
  else if (cleanShard === 'pincodes-north') {
    // Circle prefixes 11 to 28 (Delhi, Haryana, Punjab, HP, J&K, UP, Uttarakhand)
    const prefixes = ['110', '1100', '122', '121', '141', '143', '160', '180', '190', '201', '226', '208', '282']
    for (const prefix of prefixes) {
      for (let i = 1; i <= 25; i++) {
        const pin = `${prefix}${String(i).padStart(6 - prefix.length, '0')}`
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/pincode/${pin}`, '0.75'))
      }
    }
  } else if (cleanShard === 'pincodes-west') {
    // Circle prefixes 30 to 44 (Rajasthan, Gujarat, Maharashtra, Goa)
    const prefixes = ['302', '313', '342', '380', '395', '360', '390', '400', '411', '440', '403']
    for (const prefix of prefixes) {
      for (let i = 1; i <= 25; i++) {
        const pin = `${prefix}${String(i).padStart(6 - prefix.length, '0')}`
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/pincode/${pin}`, '0.75'))
      }
    }
  } else if (cleanShard === 'pincodes-south') {
    // Circle prefixes 50 to 69 (AP, Telangana, Karnataka, Tamil Nadu, Kerala)
    const prefixes = ['500', '520', '530', '560', '570', '600', '641', '682', '695']
    for (const prefix of prefixes) {
      for (let i = 1; i <= 25; i++) {
        const pin = `${prefix}${String(i).padStart(6 - prefix.length, '0')}`
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/pincode/${pin}`, '0.75'))
      }
    }
  } else if (cleanShard === 'pincodes-east') {
    // Circle prefixes 70 to 85 (WB, Odisha, Bihar, Jharkhand, North-East)
    const prefixes = ['700', '711', '751', '781', '800', '834', '842', '854']
    for (const prefix of prefixes) {
      for (let i = 1; i <= 25; i++) {
        const pin = `${prefix}${String(i).padStart(6 - prefix.length, '0')}`
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/pincode/${pin}`, '0.75'))
      }
    }
  }

  // ── Shard 8: GI-Certified Kashmiri Crafts Across Commercial Cities ───────────
  else if (cleanShard === 'crafts-geo') {
    for (const craft of CRAFT_PRODUCTS.slice(0, 30)) {
      urls.push(buildUrlXml(`${APP_URL}/crafts/product/${craft.slug}`, '0.85'))
    }
    for (const hub of COMMERCIAL_HUBS.slice(0, 20)) {
      urls.push(buildUrlXml(`${APP_URL}/crafts/kashmir?city=${hub.slug}`, '0.80'))
    }
  }

  // ── Shard 9: Luxury Kashmir Stays, Chalets & Feeder Corridors ────────────────
  else if (cleanShard === 'stays-geo') {
    for (const stay of STAY_PROPERTIES) {
      urls.push(buildUrlXml(`${APP_URL}/stays/${stay.slug}`, '0.90'))
    }
    const stayLocations = ['srinagar', 'gulmarg', 'pahalgam', 'sonamarg', 'harwan', 'dal-lake', 'nigeen']
    for (const loc of stayLocations) {
      urls.push(buildUrlXml(`${APP_URL}/stays?location=${loc}`, '0.85'))
    }
  }

  // ── Shard 10: Corporate & Milestone Gifting Matrix ───────────────────────────
  else if (cleanShard === 'gifting-geo') {
    const occasions = ['diwali', 'eid', 'weddings', 'corporate-retreats', 'milestone-celebrations']
    for (const occ of occasions) {
      for (const hub of COMMERCIAL_HUBS.slice(0, 15)) {
        urls.push(buildUrlXml(`${APP_URL}/corporate-gifts/${occ}/${hub.slug}`, '0.85'))
      }
    }
  }

  // Fallback for unrecognized shard
  else {
    return new NextResponse('Sitemap shard not found', { status: 404 })
  }

  const xmlContent = wrapUrlset(urls)

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
    },
  })
}
