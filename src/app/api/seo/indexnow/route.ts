// ─── POST /api/seo/indexnow & GET /api/seo/indexnow ──────────────────────────
// Enterprise Real-Time Indexation Engine implementing IndexNow Protocol Mesh
//
// Key Architectural Guarantees:
// 1. Strict chunking to protocol hard limit: 10,000 URLs per POST request.
// 2. Mesh Network submission: Targets primary https://api.indexnow.org/indexnow
//    which auto-distributes to Bing, Yandex, Seznam, Naver, and Yep.
// 3. Fallback resilience: Uses https://www.bing.com/indexnow ONLY on primary timeout/5xx.
// 4. Handles HTTP 200 (OK) and 202 (Accepted) as successful validations.
// 5. Lean operational logging: Never dumps massive URL arrays in response payloads.
// 6. Zero dead pings: Deprecated google.com/ping removed (retired by Google late 2023).

import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products-data'
import { STAY_PROPERTIES } from '@/lib/stays-data'
import { CRAFT_PRODUCTS } from '@/lib/crafts-data'
import { CLOTHING_PRODUCTS } from '@/lib/clothing-data'
import { KASHMIR_TRAVEL_PACKAGES } from '@/lib/travel-data'
import { INITIAL_VENUES, INITIAL_VENDORS } from '@/lib/weddings/data'
import { getAllGifts } from '@/lib/gifting-marketplace-data'
import { INDUSTRIES } from '@/lib/business-supply-data'
import { GEO_ENTITIES } from '@/lib/seo/geo'
import { buildRootCoreSitemap } from '@/lib/seo/sitemap'

// IndexNow Protocol Constraints
const INDEXNOW_KEY = '479c5a2c20774a35b128562761895a28'
const HOST = 'nutytales.com'
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`
const MAX_URLS_PER_BATCH = 10_000 // Protocol hard limit

// Primary endpoint distributes to all mesh partners; fallback only used on primary failure
const PRIMARY_ENDPOINT = 'https://api.indexnow.org/indexnow'
const FAILOVER_ENDPOINT = 'https://www.bing.com/indexnow'

interface BatchSummary {
  batchIndex: number
  urlCount: number
  status: number
  statusText: string
  endpoint: string
  accepted: boolean
  durationMs: number
  error?: string
}

/**
 * Splits any array into chunks of maximum size
 */
function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  return chunks
}

/**
 * Submits a single batch of up to 10,000 URLs to the IndexNow mesh network.
 * If the primary mesh ingress fails, retries once on the failover endpoint.
 */
async function submitBatchWithFailover(
  batch: string[],
  batchIndex: number,
): Promise<BatchSummary> {
  const startTime = Date.now()
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: batch,
  }

  // Attempt 1: Primary Mesh Network
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(PRIMARY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const accepted = res.status === 200 || res.status === 202

    if (accepted || res.status < 500) {
      return {
        batchIndex,
        urlCount: batch.length,
        status: res.status,
        statusText: res.statusText || (res.status === 202 ? 'Accepted' : 'OK'),
        endpoint: PRIMARY_ENDPOINT,
        accepted,
        durationMs: Date.now() - startTime,
      }
    }
  } catch (primaryErr: any) {
    // Timeout or network drop on primary — fall through to failover
  }

  // Attempt 2: Failover to Bing ingress
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(FAILOVER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const accepted = res.status === 200 || res.status === 202

    return {
      batchIndex,
      urlCount: batch.length,
      status: res.status,
      statusText: res.statusText || (res.status === 202 ? 'Accepted (Failover)' : 'OK (Failover)'),
      endpoint: FAILOVER_ENDPOINT,
      accepted,
      durationMs: Date.now() - startTime,
    }
  } catch (failoverErr: any) {
    return {
      batchIndex,
      urlCount: batch.length,
      status: 503,
      statusText: 'Service Unavailable',
      endpoint: FAILOVER_ENDPOINT,
      accepted: false,
      durationMs: Date.now() - startTime,
      error: failoverErr.message || 'Failed connecting to both primary and failover IndexNow endpoints',
    }
  }
}

/**
 * Collects all indexable URLs across all Nutytales verticals
 */
function collectAllIndexableUrls(): string[] {
  const baseUrl = `https://${HOST}`
  const now = new Date()

  // 1. Core Pages
  const coreUrls = buildRootCoreSitemap().map((e) => e.url)

  // 2. High-Intent Hubs
  const hubUrls = [
    `${baseUrl}/stays`,
    `${baseUrl}/stays/hosts`,
    `${baseUrl}/stays/group-quote`,
    `${baseUrl}/crafts`,
    `${baseUrl}/crafts/kashmir`,
    `${baseUrl}/crafts/pherans`,
    `${baseUrl}/crafts/shawls-stoles`,
    `${baseUrl}/crafts/jackets-coats`,
    `${baseUrl}/crafts/heritage-home`,
    `${baseUrl}/crafts/men`,
    `${baseUrl}/crafts/women`,
    `${baseUrl}/crafts/winter-wear`,
    `${baseUrl}/pashmina-shawls`,
    `${baseUrl}/travel`,
    `${baseUrl}/travel/kashmir`,
    `${baseUrl}/travel/builder`,
    `${baseUrl}/travel/partners`,
    `${baseUrl}/weddings`,
    `${baseUrl}/destination-weddings`,
    `${baseUrl}/destination-weddings/kashmir`,
    `${baseUrl}/destination-weddings/dubai`,
    `${baseUrl}/destination-weddings/italy`,
    `${baseUrl}/wedding-return-gifts`,
    `${baseUrl}/gifting`,
    `${baseUrl}/corporate-gifting`,
    `${baseUrl}/corporate-gifts`,
    `${baseUrl}/corporate-gifts/diwali`,
    `${baseUrl}/corporate-gifts/diwali/mumbai`,
    `${baseUrl}/corporate-gifts/diwali/dubai`,
    `${baseUrl}/b2b`,
    `${baseUrl}/business-supply`,
    `${baseUrl}/wholesale-dry-fruits`,
    `${baseUrl}/bulk-quote`,
    `${baseUrl}/nri`,
    `${baseUrl}/nri/services`,
    `${baseUrl}/nri/how-it-works`,
    `${baseUrl}/nri/emergency`,
    `${baseUrl}/nri/country/usa`,
    `${baseUrl}/nri/country/uk`,
    `${baseUrl}/nri/country/canada`,
    `${baseUrl}/nri/country/uae`,
  ]

  // 3. Retail Products
  const productUrls = PRODUCTS.map((p) => `${baseUrl}/shop/${p.slug}`)

  // 4. Stays
  const stayUrls = STAY_PROPERTIES.map((s) => `${baseUrl}/stays/${s.slug}`)

  // 5. Travel
  const travelUrls = KASHMIR_TRAVEL_PACKAGES.map((t) => `${baseUrl}/travel/kashmir/${t.slug}`)

  // 6. Crafts
  const craftSlugs = Array.from(
    new Set([
      ...CRAFT_PRODUCTS.map((c) => c.slug),
      ...CLOTHING_PRODUCTS.map((p) => p.slug),
    ])
  )
  const craftUrls = craftSlugs.map((slug) => `${baseUrl}/crafts/product/${slug}`)

  // 7. Weddings
  const venueUrls = INITIAL_VENUES.map((v) => `${baseUrl}/venues/${v.slug}`)
  const vendorUrls = INITIAL_VENDORS.map((v) => `${baseUrl}/vendors/${v.slug}`)

  // 8. Gifting
  const giftUrls = getAllGifts().map((g) => `${baseUrl}/gifting/product/${g.slug}`)

  // 9. Wholesale Industries & 75+ Commercial Cities
  const industryUrls = INDUSTRIES.map((i) => `${baseUrl}/wholesale-dry-fruits/${i.slug}`)
  const cityUrls = GEO_ENTITIES
    .filter((g) => g.isLaunched && (g.type === 'city' || g.type === 'state'))
    .map((g) => `${baseUrl}/wholesale-dry-fruits/${g.slug}`)

  // Deduplicate all
  return Array.from(
    new Set([
      ...coreUrls,
      ...hubUrls,
      ...productUrls,
      ...stayUrls,
      ...travelUrls,
      ...craftUrls,
      ...venueUrls,
      ...vendorUrls,
      ...giftUrls,
      ...industryUrls,
      ...cityUrls,
    ])
  )
}

/**
 * GET /api/seo/indexnow
 * Assembles all site URLs, chunks them into 10,000 batches, and submits to IndexNow mesh.
 * Accepts ?dryRun=true to inspect batch structure without triggering network calls.
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const isDryRun = searchParams.get('dryRun') === 'true'

    const allUrls = collectAllIndexableUrls()
    const batches = chunkArray(allUrls, MAX_URLS_PER_BATCH)

    if (isDryRun) {
      return NextResponse.json({
        success: true,
        mode: 'dryRun',
        totalUrls: allUrls.length,
        batchCount: batches.length,
        maxPerBatch: MAX_URLS_PER_BATCH,
        sampleBatchSize: batches[0]?.length || 0,
        meshEndpoint: PRIMARY_ENDPOINT,
        failoverEndpoint: FAILOVER_ENDPOINT,
        keyLocation: KEY_LOCATION,
      })
    }

    const batchSummaries: BatchSummary[] = []
    let successfulBatches = 0
    let failedBatches = 0

    for (let i = 0; i < batches.length; i++) {
      const summary = await submitBatchWithFailover(batches[i], i + 1)
      batchSummaries.push(summary)
      if (summary.accepted) {
        successfulBatches++
      } else {
        failedBatches++
      }
    }

    return NextResponse.json({
      success: failedBatches === 0,
      message: `Processed ${allUrls.length} URLs across ${batches.length} batch(es) via IndexNow mesh network.`,
      totalUrls: allUrls.length,
      totalBatches: batches.length,
      successfulBatches,
      failedBatches,
      batches: batchSummaries,
      architecture: {
        meshProtocol: 'IndexNow (Single dispatch automatically reaches Bing, Yandex, Seznam, Naver, Yep)',
        googleNotice: 'Google deprecated unauthenticated sitemap pings in late 2023. Google re-crawl is governed by robots.txt sitemap declaration and Search Console API.',
        cdnKeyStatus: 'Key verification file configured with 1-year immutable edge caching.',
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed processing IndexNow submission.' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/seo/indexnow
 * Enterprise endpoint for programmatic push of any URL volume (from CMS/DB hooks).
 * Automatically chunks large URL arrays into 10,000-sized batches.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const rawUrls: string[] = body.urls || []

    if (!Array.isArray(rawUrls) || rawUrls.length === 0) {
      return NextResponse.json(
        { error: 'An array of URLs (body.urls) is required.' },
        { status: 400 },
      )
    }

    // Deduplicate and sanitize
    const uniqueUrls = Array.from(new Set(rawUrls.filter((u) => typeof u === 'string' && u.startsWith('http'))))
    const batches = chunkArray(uniqueUrls, MAX_URLS_PER_BATCH)

    const batchSummaries: BatchSummary[] = []
    let successfulBatches = 0
    let failedBatches = 0

    for (let i = 0; i < batches.length; i++) {
      const summary = await submitBatchWithFailover(batches[i], i + 1)
      batchSummaries.push(summary)
      if (summary.accepted) {
        successfulBatches++
      } else {
        failedBatches++
      }
    }

    return NextResponse.json({
      success: failedBatches === 0,
      totalUrls: uniqueUrls.length,
      totalBatches: batches.length,
      successfulBatches,
      failedBatches,
      batches: batchSummaries,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error processing IndexNow batch payload.' },
      { status: 500 },
    )
  }
}
