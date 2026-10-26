// ─── GET /sitemap_index.xml ──────────────────────────────────────────────────
// Master Enterprise Sitemap Index mapping all vertical sitemaps for Google, Bing, and AI crawlers.

import { NextResponse } from 'next/server'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nutytales.com'

export async function GET() {
  const now = new Date().toISOString()

  const subSitemaps = [
    { loc: `${APP_URL}/sitemap.xml`, lastmod: now },
    { loc: `${APP_URL}/crafts/sitemap.xml`, lastmod: now },
    { loc: `${APP_URL}/stays/sitemap.xml`, lastmod: now },
    { loc: `${APP_URL}/travel/sitemap.xml`, lastmod: now },
    { loc: `${APP_URL}/weddings/sitemap.xml`, lastmod: now },
    { loc: `${APP_URL}/gifting/sitemap.xml`, lastmod: now },
    { loc: `${APP_URL}/business/sitemap.xml`, lastmod: now },
    { loc: `${APP_URL}/nri/sitemap.xml`, lastmod: now },
    { loc: `${APP_URL}/us/sitemap.xml`, lastmod: now },
    { loc: `${APP_URL}/eu/sitemap.xml`, lastmod: now },
    { loc: `${APP_URL}/me/sitemap.xml`, lastmod: now },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${subSitemaps
  .map(
    (s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`,
  )
  .join('\n')}
</sitemapindex>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
