// ─── GET /sitemaps/[shard] ──────────────────────────────────────────────────
// Programmatic Sharded XML Sitemap Route Handler.
// Emits RFC 0.9-compliant XML urlsets partitioned into protocol-compliant shards (<50,000 URLs).
// Powers indexation of 100,000+ programmatic SEO endpoints across B2B, Crafts, Stays,
// Indian Postal Pincodes (Tier 1 Metros), and International NRI Diaspora Hubs.

import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products-data'
import { CRAFT_PRODUCTS } from '@/lib/crafts-data'
import { STAY_PROPERTIES } from '@/lib/stays-data'
import { COMMERCIAL_HUBS } from '@/lib/seo/commercial-hubs'
import { getRegionalProducts } from '@/lib/regional-data'

const APP_URL = 'https://nutytales.com'

function buildUrlXml(url: string, priority = '0.80', changeFreq = 'weekly', lastMod = '2026-10-30'): string {
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
    // Top 15 products × 50 apex commercial hubs
    const topProducts = PRODUCTS.slice(0, 15)
    for (const product of topProducts) {
      for (const hub of COMMERCIAL_HUBS.slice(0, 50)) {
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/${product.slug}/${hub.slug}`, '0.85'))
      }
    }
  } else if (cleanShard === 'b2b-matrix-2') {
    // Remaining products × remaining commercial hubs
    const remainingProducts = PRODUCTS.slice(15)
    for (const product of remainingProducts) {
      for (const hub of COMMERCIAL_HUBS.slice(0, 50)) {
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/${product.slug}/${hub.slug}`, '0.80'))
      }
    }
  }

  // ── Shard 3: Indian Postal Circles (Northern Metros & Industrial Belts) ────────
  else if (cleanShard === 'pincodes-north') {
    // Delhi NCR (Delhi, Noida, Greater Noida, Gurgaon, Faridabad, Ghaziabad), Punjab, Haryana, UP, J&K
    const metroRanges = [
      { prefix: '1100', start: 1, end: 96 },   // Delhi Central & NCT (110001 - 110096)
      { prefix: '2013', start: 1, end: 18 },   // Noida & Greater Noida (201301 - 201318)
      { prefix: '1220', start: 1, end: 22 },   // Gurgaon & Manesar (122001 - 122022)
      { prefix: '1210', start: 1, end: 10 },   // Faridabad
      { prefix: '2010', start: 1, end: 17 },   // Ghaziabad
      { prefix: '1600', start: 1, end: 71 },   // Chandigarh, Mohali, Panchkula
      { prefix: '1410', start: 1, end: 15 },   // Ludhiana
      { prefix: '1430', start: 1, end: 10 },   // Amritsar
      { prefix: '2260', start: 1, end: 30 },   // Lucknow
      { prefix: '2080', start: 1, end: 27 },   // Kanpur
      { prefix: '2820', start: 1, end: 10 },   // Agra
      { prefix: '1900', start: 1, end: 25 },   // Srinagar Hub
      { prefix: '1800', start: 1, end: 20 },   // Jammu Hub
      { prefix: '2480', start: 1, end: 15 },   // Dehradun
    ]

    for (const r of metroRanges) {
      for (let i = r.start; i <= r.end; i++) {
        const pin = `${r.prefix}${String(i).padStart(6 - r.prefix.length, '0')}`
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/pincode/${pin}`, '0.80'))
      }
    }
  }

  // ── Shard 4: Western Circle (Mumbai, Pune, Ahmedabad, Surat, Jaipur) ──────────
  else if (cleanShard === 'pincodes-west') {
    const metroRanges = [
      { prefix: '4000', start: 1, end: 99 },   // Mumbai City, South Mumbai & Suburbs
      { prefix: '4001', start: 1, end: 10 },   // Mumbai Western Suburbs
      { prefix: '4006', start: 1, end: 15 },   // Thane
      { prefix: '4007', start: 1, end: 10 },   // Navi Mumbai & Vashi APMC
      { prefix: '4110', start: 1, end: 62 },   // Pune & PCMC
      { prefix: '3800', start: 1, end: 63 },   // Ahmedabad
      { prefix: '3950', start: 1, end: 15 },   // Surat
      { prefix: '3900', start: 1, end: 25 },   // Vadodara
      { prefix: '3020', start: 1, end: 39 },   // Jaipur
      { prefix: '3420', start: 1, end: 26 },   // Jodhpur
      { prefix: '4520', start: 1, end: 20 },   // Indore
      { prefix: '4030', start: 1, end: 15 },   // Goa Panaji & Margao
    ]

    for (const r of metroRanges) {
      for (let i = r.start; i <= r.end; i++) {
        const pin = `${r.prefix}${String(i).padStart(6 - r.prefix.length, '0')}`
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/pincode/${pin}`, '0.80'))
      }
    }
  }

  // ── Shard 5: Southern Circle (Bengaluru, Hyderabad, Chennai, Kochi) ───────────
  else if (cleanShard === 'pincodes-south') {
    const metroRanges = [
      { prefix: '5600', start: 1, end: 99 },   // Bengaluru Core & Tech Corridors
      { prefix: '5601', start: 1, end: 15 },   // Greater Bengaluru & Electronic City
      { prefix: '5000', start: 1, end: 98 },   // Hyderabad, Cyberabad & Secunderabad
      { prefix: '6000', start: 1, end: 99 },   // Chennai Metro & Port Zone
      { prefix: '6001', start: 1, end: 30 },   // Greater Chennai & OMR Belt
      { prefix: '6410', start: 1, end: 50 },   // Coimbatore
      { prefix: '6820', start: 1, end: 42 },   // Kochi & Ernakulam
      { prefix: '5300', start: 1, end: 50 },   // Visakhapatnam
      { prefix: '5200', start: 1, end: 15 },   // Vijayawada
      { prefix: '6950', start: 1, end: 35 },   // Thiruvananthapuram
    ]

    for (const r of metroRanges) {
      for (let i = r.start; i <= r.end; i++) {
        const pin = `${r.prefix}${String(i).padStart(6 - r.prefix.length, '0')}`
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/pincode/${pin}`, '0.80'))
      }
    }
  }

  // ── Shard 6: Eastern Circle (Kolkata, Patna Hub, Bihar, Odisha, Assam) ────────
  else if (cleanShard === 'pincodes-east') {
    const metroRanges = [
      { prefix: '7000', start: 1, end: 99 },   // Kolkata Metro
      { prefix: '7001', start: 1, end: 60 },   // Greater Kolkata, Salt Lake & New Town
      { prefix: '7111', start: 1, end: 14 },   // Howrah
      { prefix: '8000', start: 1, end: 30 },   // Patna Hub (Nafis Colony, Kankarbagh, Fraser Rd)
      { prefix: '8420', start: 1, end: 10 },   // Muzaffarpur
      { prefix: '8543', start: 1, end: 10 },   // Purnia (Makhana Hub)
      { prefix: '8230', start: 1, end: 10 },   // Gaya
      { prefix: '8340', start: 1, end: 15 },   // Ranchi
      { prefix: '8310', start: 1, end: 20 },   // Jamshedpur
      { prefix: '7510', start: 1, end: 30 },   // Bhubaneswar
      { prefix: '7810', start: 1, end: 40 },   // Guwahati
    ]

    for (const r of metroRanges) {
      for (let i = r.start; i <= r.end; i++) {
        const pin = `${r.prefix}${String(i).padStart(6 - r.prefix.length, '0')}`
        urls.push(buildUrlXml(`${APP_URL}/wholesale-dry-fruits/pincode/${pin}`, '0.80'))
      }
    }
  }

  // ── Shard 7: GI-Certified Kashmiri Crafts Across Commercial Cities ───────────
  else if (cleanShard === 'crafts-geo') {
    for (const craft of CRAFT_PRODUCTS) {
      urls.push(buildUrlXml(`${APP_URL}/crafts/product/${craft.slug}`, '0.85'))
    }
    for (const hub of COMMERCIAL_HUBS.slice(0, 40)) {
      urls.push(buildUrlXml(`${APP_URL}/crafts/kashmir?city=${hub.slug}`, '0.80'))
    }
  }

  // ── Shard 8: Luxury Kashmir Stays, Chalets & Feeder Corridors ────────────────
  else if (cleanShard === 'stays-geo') {
    for (const stay of STAY_PROPERTIES) {
      urls.push(buildUrlXml(`${APP_URL}/stays/${stay.slug}`, '0.90'))
    }
    const stayLocations = ['srinagar', 'gulmarg', 'pahalgam', 'sonamarg', 'harwan', 'dal-lake', 'nigeen', 'yusmarg', 'doodhpathri']
    for (const loc of stayLocations) {
      urls.push(buildUrlXml(`${APP_URL}/stays?location=${loc}`, '0.85'))
    }
  }

  // ── Shard 9: Corporate & Milestone Gifting Matrix ───────────────────────────
  else if (cleanShard === 'gifting-geo') {
    const occasions = ['diwali', 'eid', 'weddings', 'corporate-retreats', 'milestone-celebrations', 'new-year', 'annual-day']
    for (const occ of occasions) {
      for (const hub of COMMERCIAL_HUBS.slice(0, 30)) {
        urls.push(buildUrlXml(`${APP_URL}/corporate-gifts/${occ}/${hub.slug}`, '0.85'))
      }
    }
  }

  // ── Shard 10: Middle East Diaspora Portal (middleeast.nutytales.com) ─────────
  else if (cleanShard === 'diaspora-me') {
    const meBase = 'https://middleeast.nutytales.com'
    const gccCities = ['dubai', 'abu-dhabi', 'sharjah', 'ajman', 'ras-al-khaimah', 'riyadh', 'jeddah', 'dammam', 'khobar', 'doha', 'kuwait-city', 'manama', 'muscat']
    const meProducts = getRegionalProducts('me')

    urls.push(buildUrlXml(`${meBase}/`, '1.0', 'daily'))
    urls.push(buildUrlXml(`${meBase}/store`, '0.95', 'daily'))

    for (const p of meProducts) {
      urls.push(buildUrlXml(`${meBase}/store/${p.regionalSlug}`, '0.90'))
    }

    for (const city of gccCities) {
      urls.push(buildUrlXml(`${meBase}/store?city=${city}`, '0.85'))
      urls.push(buildUrlXml(`${meBase}/store?gifting=ramadan&city=${city}`, '0.85'))
      urls.push(buildUrlXml(`${meBase}/store?gifting=eid&city=${city}`, '0.85'))
      urls.push(buildUrlXml(`${meBase}/store?category=saffron&city=${city}`, '0.85'))
    }
  }

  // ── Shard 11: North America Diaspora Portal (america.nutytales.com) ──────────
  else if (cleanShard === 'diaspora-us') {
    const usBase = 'https://america.nutytales.com'
    const usCities = ['new-york', 'san-francisco', 'silicon-valley', 'los-angeles', 'chicago', 'dallas', 'houston', 'seattle', 'austin', 'boston', 'new-jersey', 'edison', 'toronto', 'vancouver', 'calgary', 'mississauga', 'brampton']
    const usProducts = getRegionalProducts('us')

    urls.push(buildUrlXml(`${usBase}/`, '1.0', 'daily'))
    urls.push(buildUrlXml(`${usBase}/store`, '0.95', 'daily'))

    for (const p of usProducts) {
      urls.push(buildUrlXml(`${usBase}/store/${p.regionalSlug}`, '0.90'))
    }

    for (const city of usCities) {
      urls.push(buildUrlXml(`${usBase}/store?city=${city}`, '0.85'))
      urls.push(buildUrlXml(`${usBase}/store?gifting=diwali&city=${city}`, '0.85'))
      urls.push(buildUrlXml(`${usBase}/store?category=pashmina&city=${city}`, '0.85'))
      urls.push(buildUrlXml(`${usBase}/store?category=mamra&city=${city}`, '0.85'))
    }
  }

  // ── Shard 12: Europe & UK Diaspora Portal (europe.nutytales.com) ─────────────
  else if (cleanShard === 'diaspora-eu') {
    const euBase = 'https://europe.nutytales.com'
    const euCities = ['london', 'birmingham', 'manchester', 'leicester', 'edinburgh', 'glasgow', 'paris', 'frankfurt', 'berlin', 'munich', 'amsterdam', 'dublin', 'zurich', 'brussels']
    const euProducts = getRegionalProducts('eu')

    urls.push(buildUrlXml(`${euBase}/`, '1.0', 'daily'))
    urls.push(buildUrlXml(`${euBase}/store`, '0.95', 'daily'))

    for (const p of euProducts) {
      urls.push(buildUrlXml(`${euBase}/store/${p.regionalSlug}`, '0.90'))
    }

    for (const city of euCities) {
      urls.push(buildUrlXml(`${euBase}/store?city=${city}`, '0.85'))
      urls.push(buildUrlXml(`${euBase}/store?gifting=luxury-box&city=${city}`, '0.85'))
      urls.push(buildUrlXml(`${euBase}/store?category=pashmina-shawls&city=${city}`, '0.85'))
      urls.push(buildUrlXml(`${euBase}/store?category=organic-saffron&city=${city}`, '0.85'))
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
