// ─── POST /api/seo/indexnow & GET /api/seo/indexnow ──────────────────────────
// Instant real-time indexation engine implementing the IndexNow protocol (Bing, Yandex, Seznam, Naver)
// and Google Sitemap Re-Crawl Ping automation.

import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products-data'
import { STAY_PROPERTIES } from '@/lib/stays-data'
import { CRAFT_PRODUCTS } from '@/lib/crafts-data'
import { GEO_ENTITIES } from '@/lib/seo/geo'
import { INDUSTRIES } from '@/lib/business-supply-data'

const INDEXNOW_KEY = '479c5a2c20774a35b128562761895a28'
const HOST = 'nutytales.com'
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`

export async function GET(req: NextRequest) {
  try {
    const baseUrl = `https://${HOST}`

    // Collect high-priority URLs to submit
    const sampleUrls: string[] = [
      `${baseUrl}/`,
      `${baseUrl}/shop`,
      `${baseUrl}/stays`,
      `${baseUrl}/crafts`,
      `${baseUrl}/travel`,
      `${baseUrl}/weddings`,
      `${baseUrl}/gifting`,
      `${baseUrl}/wholesale-dry-fruits`,
      `${baseUrl}/nri`,
      // Add top products
      ...PRODUCTS.slice(0, 20).map((p) => `${baseUrl}/shop/${p.slug}`),
      // Add stays
      ...STAY_PROPERTIES.map((s) => `${baseUrl}/stays/${s.slug}`),
      // Add crafts
      ...CRAFT_PRODUCTS.slice(0, 15).map((c) => `${baseUrl}/crafts/product/${c.slug}`),
      // Add top wholesale cities
      ...GEO_ENTITIES.filter((g) => g.isLaunched && g.type === 'city')
        .slice(0, 25)
        .map((g) => `${baseUrl}/wholesale-dry-fruits/${g.slug}`),
      // Add industries
      ...INDUSTRIES.slice(0, 10).map((i) => `${baseUrl}/wholesale-dry-fruits/${i.slug}`),
    ]

    const results = await submitUrlsToIndexNow(sampleUrls)

    // Trigger Google sitemap ping
    const googlePingResult = await triggerGoogleSitemapPing(baseUrl)

    return NextResponse.json({
      success: true,
      message: `Pushed ${sampleUrls.length} high-intent URLs to search engines via IndexNow & Google Ping.`,
      submittedUrlsCount: sampleUrls.length,
      indexNowResults: results,
      googlePing: googlePingResult,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to submit IndexNow ping.' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const urlList: string[] = body.urls || []

    if (!Array.isArray(urlList) || urlList.length === 0) {
      return NextResponse.json(
        { error: 'An array of URLs (body.urls) is required.' },
        { status: 400 },
      )
    }

    const results = await submitUrlsToIndexNow(urlList)
    return NextResponse.json({
      success: true,
      submittedCount: urlList.length,
      results,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error processing IndexNow submission.' },
      { status: 500 },
    )
  }
}

async function submitUrlsToIndexNow(urlList: string[]) {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ]

  const results: Record<string, any> = {}

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      })
      results[endpoint] = {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
      }
    } catch (err: any) {
      results[endpoint] = { error: err.message }
    }
  }

  return results
}

async function triggerGoogleSitemapPing(baseUrl: string) {
  const pingTargets = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(`${baseUrl}/sitemap.xml`)}`,
    `https://www.google.com/ping?sitemap=${encodeURIComponent(`${baseUrl}/sitemap_index.xml`)}`,
  ]

  const results: Record<string, any> = {}

  for (const target of pingTargets) {
    try {
      const res = await fetch(target, { method: 'GET' })
      results[target] = { status: res.status, ok: res.ok }
    } catch (err: any) {
      results[target] = { error: err.message }
    }
  }

  return results
}
