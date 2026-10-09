import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_ROUTE = /^\/admin(\/.*)?$/
const ACCOUNT_ROUTE = /^\/account(\/.*)?$/
const API_ADMIN_ROUTE = /^\/api\/admin(\/.*)?$/

function getActiveVertical(request: NextRequest): string | null {
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.hostname ||
    ''

  const searchParams = request.nextUrl.searchParams
  const queryParam = searchParams.get('vertical') || searchParams.get('subdomain')
  if (queryParam) return queryParam.toLowerCase()

  const headerVertical = request.headers.get('x-nutytales-vertical')
  if (headerVertical) return headerVertical.toLowerCase()

  if (host.startsWith('nri.nutytales.com') || host.startsWith('nri.localhost')) return 'nri'
  if (host.startsWith('business.nutytales.com') || host.startsWith('business.localhost')) return 'business'
  if (host.startsWith('gifting.nutytales.com') || host.startsWith('gifting.localhost')) return 'gifting'
  if (host.startsWith('weddings.nutytales.com') || host.startsWith('weddings.localhost')) return 'weddings'
  if (host.startsWith('crafts.nutytales.com') || host.startsWith('crafts.localhost')) return 'crafts'
  if (host.startsWith('stays.nutytales.com') || host.startsWith('stays.localhost')) return 'stays'
  if (host.startsWith('travel.nutytales.com') || host.startsWith('travel.localhost')) return 'travel'

  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.hostname ||
    ''

  // 1. Enforce single-hop HTTPS 301 permanent redirect from www.nutytales.com to canonical https://nutytales.com
  if (host.startsWith('www.nutytales.com')) {
    const redirectUrl = new URL(pathname + request.nextUrl.search, 'https://nutytales.com')
    return NextResponse.redirect(redirectUrl, { status: 301 })
  }

  const vertical = getActiveVertical(request)

  // 2. Hostname-specific robots.txt generation
  if (pathname === '/robots.txt') {
    const sitemapUrl = vertical
      ? `https://${vertical}.nutytales.com/sitemap.xml`
      : 'https://nutytales.com/sitemap.xml'
    const hostUrl = vertical
      ? `https://${vertical}.nutytales.com`
      : 'https://nutytales.com'

    const robotsTxt = `# Nuty Tales Search Engine Crawl Governance
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /account
Disallow: /account/
Disallow: /cart
Disallow: /checkout
Disallow: /api/
Disallow: /_next/
Disallow: /login
Disallow: /register
Disallow: /search?
Disallow: /*?*utm_*
Disallow: /*?*session_*
Disallow: /*.json$

# AI Scraper Policy
User-agent: GPTBot
Disallow: /
User-agent: Google-Extended
Disallow: /
User-agent: CCBot
Disallow: /
User-agent: anthropic-ai
Disallow: /
User-agent: Claude-Web
Disallow: /

Sitemap: ${sitemapUrl}
Host: ${hostUrl}
`
    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  }

  // 3. API route protection
  if (pathname.startsWith('/api')) {
    if (API_ADMIN_ROUTE.test(pathname)) {
      const authHeader = request.headers.get('authorization')
      const token = request.cookies.get('nt_uid')?.value
      if (!authHeader && !token) {
        return NextResponse.json({ error: 'Unauthorized', message: 'Authentication required.' }, { status: 401 })
      }
    }
    return NextResponse.next()
  }

  // 4. Subdomain-aware routing & rewrites
  if (vertical) {
    const rewriteVertical = (targetPath: string) => {
      const res = NextResponse.rewrite(new URL(targetPath, request.url))
      res.cookies.set('nt_active_vertical', vertical, { path: '/' })
      res.headers.set('x-nutytales-vertical', vertical)
      return res
    }

    const nextVertical = () => {
      const res = NextResponse.next()
      res.cookies.set('nt_active_vertical', vertical, { path: '/' })
      res.headers.set('x-nutytales-vertical', vertical)
      return res
    }

    if (vertical === 'nri') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/nri/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/nri')
      if (pathname === '/services') return rewriteVertical('/nri/services')
      if (pathname.startsWith('/services/')) return rewriteVertical(`/nri${pathname}`)
      if (pathname === '/marketplace') return rewriteVertical('/nri/marketplace')
      if (pathname === '/how-it-works') return rewriteVertical('/nri/how-it-works')
      if (pathname === '/providers' || pathname === '/for-providers') return rewriteVertical('/nri/providers')
      if (pathname === '/for-business' || pathname === '/business') return rewriteVertical('/nri/business')
      if (pathname === '/dashboard' || pathname === '/my-india') return rewriteVertical('/nri/dashboard')
      if (pathname === '/emergency') return rewriteVertical('/nri/emergency')
      if (pathname === '/provider-workspace') return rewriteVertical('/nri/provider-workspace')
      if (pathname.startsWith('/country/')) return rewriteVertical(`/nri${pathname}`)
      if (pathname.startsWith('/nri')) return nextVertical()
      return rewriteVertical(`/nri${pathname}`)
    }

    if (vertical === 'business') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/business/sitemap.xml')
      if (pathname === '/' || pathname === '/business-supply') return rewriteVertical('/b2b')
      if (pathname.startsWith('/wholesale-dry-fruits')) return nextVertical()
      if (pathname.startsWith('/bulk-quote')) return nextVertical()
      if (pathname === '/rfq') return rewriteVertical('/b2b/rfq')
      if (pathname === '/catalog') return rewriteVertical('/b2b/catalog')
      if (pathname === '/quotes') return rewriteVertical('/b2b/quotes')
      if (pathname === '/orders') return rewriteVertical('/b2b/orders')
      if (pathname === '/account') return rewriteVertical('/b2b/account')
      if (pathname === '/replenishment') return rewriteVertical('/b2b/replenishment')
      if (pathname.startsWith('/b2b')) return nextVertical()
      return rewriteVertical(`/b2b${pathname}`)
    }

    if (vertical === 'gifting') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/gifting/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/gifting')
      if (pathname.startsWith('/corporate-gifts')) return nextVertical()
      if (pathname.startsWith('/corporate-gifting')) return nextVertical()
      if (pathname === '/dashboard') return rewriteVertical('/gifting/dashboard')
      if (pathname === '/designer') return rewriteVertical('/gifting/designer')
      if (pathname === '/recipients') return rewriteVertical('/gifting/recipients')
      if (pathname.startsWith('/gifting')) return nextVertical()
      return rewriteVertical(`/gifting${pathname}`)
    }

    if (vertical === 'weddings') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/weddings/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/weddings')
      if (pathname.startsWith('/destination-weddings')) return nextVertical()
      if (pathname.startsWith('/wedding-return-gifts')) return nextVertical()
      if (pathname === '/wedding-planners/kashmir' || pathname === '/wedding-venues/kashmir' || pathname === '/wedding-catering/kashmir') {
        return rewriteVertical('/destination-weddings/kashmir')
      }
      if (pathname === '/wedding-gifts/kashmir') {
        return rewriteVertical('/wedding-return-gifts')
      }
      if (pathname === '/workspace') return rewriteVertical('/weddings/workspace')
      if (pathname === '/dashboard') return rewriteVertical('/weddings/dashboard')
      if (pathname.startsWith('/weddings')) return nextVertical()
      return rewriteVertical(`/weddings${pathname}`)
    }

    if (vertical === 'crafts') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/crafts/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/crafts')
      if (pathname.startsWith('/pashmina-shawls')) return nextVertical()
      if (pathname.startsWith('/kani-shawls') || pathname.startsWith('/sozni-shawls')) {
        return rewriteVertical('/pashmina-shawls')
      }
      if (pathname === '/kashmir-crafts') {
        return rewriteVertical('/crafts/kashmir')
      }
      if (pathname.startsWith('/product/')) return rewriteVertical(`/crafts${pathname}`)
      if (pathname.startsWith('/crafts')) return nextVertical()
      return rewriteVertical(`/crafts${pathname}`)
    }

    if (vertical === 'stays') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/stays/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/stays')
      if (pathname === '/hosts') return rewriteVertical('/stays/hosts')
      if (pathname === '/group-quote') return rewriteVertical('/stays/group-quote')
      if (pathname === '/dashboard') return rewriteVertical('/stays/dashboard')
      if (pathname === '/hotels/srinagar' || pathname === '/family-stays/srinagar') {
        return rewriteVertical('/stays/srinagar')
      }
      if (pathname === '/hotels/gulmarg') {
        return rewriteVertical('/stays/gulmarg')
      }
      if (pathname === '/boutique-stays/kashmir') {
        return rewriteVertical('/stays/kashmir')
      }
      if (pathname.startsWith('/stays')) return nextVertical()
      return rewriteVertical(`/stays${pathname}`)
    }

    if (vertical === 'travel') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/travel/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/travel')
      if (pathname === '/builder') return rewriteVertical('/travel/builder')
      if (pathname === '/dashboard') return rewriteVertical('/travel/dashboard')
      if (pathname === '/partners') return rewriteVertical('/travel/partners')
      if (pathname.startsWith('/travel')) return nextVertical()
      return rewriteVertical(`/travel${pathname}`)
    }
  }

  const token = request.cookies.get('nt_uid')?.value

  if (ADMIN_ROUTE.test(pathname)) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', 'admin')
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  if (ACCOUNT_ROUTE.test(pathname)) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
