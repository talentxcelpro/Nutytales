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

  if (host.startsWith('seller.nutytales.com') || host.startsWith('seller.localhost') || host.startsWith('seller.') || queryParam === 'seller') return 'seller'
  if (host.startsWith('nri.nutytales.com') || host.startsWith('nri.localhost')) return 'nri'
  if (host.startsWith('business.nutytales.com') || host.startsWith('business.localhost')) return 'business'
  if (host.startsWith('gifting.nutytales.com') || host.startsWith('gifting.localhost')) return 'gifting'
  if (host.startsWith('weddings.nutytales.com') || host.startsWith('weddings.localhost')) return 'weddings'
  if (host.startsWith('crafts.nutytales.com') || host.startsWith('crafts.localhost')) return 'crafts'
  if (host.startsWith('stays.nutytales.com') || host.startsWith('stays.localhost')) return 'stays'
  if (host.startsWith('travel.nutytales.com') || host.startsWith('travel.localhost')) return 'travel'
  if (host.startsWith('middleeast.nutytales.com') || host.startsWith('middleeast.localhost') || queryParam === 'middleeast' || queryParam === 'me') return 'middleeast'
  if (host.startsWith('europe.nutytales.com') || host.startsWith('europe.localhost') || queryParam === 'europe' || queryParam === 'eu') return 'europe'
  if (host.startsWith('america.nutytales.com') || host.startsWith('america.localhost') || queryParam === 'america' || queryParam === 'us') return 'america'

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

  // 2. Firebase Auth custom domain proxy handler
  // Must intercept /__/auth/* before any subdomain routing so that OAuth popups
  // on subdomains (nri.nutytales.com, crafts.nutytales.com, etc.) are proxied
  // directly to Firebase Auth Hosting instead of getting 404
  if (pathname.includes('/__/auth')) {
    const authPath = pathname.substring(pathname.indexOf('/__/auth'))
    const targetUrl = new URL(`https://nutty-tales-1c667.firebaseapp.com${authPath}${request.nextUrl.search}`)
    return NextResponse.rewrite(targetUrl)
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

    const isSeller = vertical === 'seller'
    const robotsTxt = isSeller
      ? `# Nuty Tales Seller Portal — Private Operations Platform
User-agent: *
Disallow: /
`
      : `# Nuty Tales — Search Engine and AI Crawler Policy
# Public pages may be crawled; private and transactional paths are restricted.

User-agent: *
Allow: /
Disallow: /seller
Disallow: /seller/
Disallow: /admin
Disallow: /admin/
Disallow: /account
Disallow: /account/
Disallow: /cart
Disallow: /cart/
Disallow: /checkout
Disallow: /checkout/
Disallow: /api/
Disallow: /login
Disallow: /login/
Disallow: /register
Disallow: /register/
Disallow: /search
Disallow: /search/
Disallow: /*?*utm_
Disallow: /*?*session_*
Disallow: /*.json$

# OpenAI crawler for potential search discovery
User-agent: OAI-SearchBot
Allow: /

# OpenAI crawler used for model training
User-agent: GPTBot
Allow: /

# Google AI training and grounding crawler
User-agent: Google-Extended
Allow: /

# Anthropic crawler
User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

# Common Crawl
User-agent: CCBot
Allow: /

Sitemap: ${sitemapUrl}
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
    const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  }

  // 4. Subdomain-aware routing & rewrites
  if (vertical) {
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
    const protocol = isLocalhost ? 'http' : 'https'

    // ─── 4A. Cross-Subdomain Portal Redirection ───
    // When a request reaches one subdomain but asks for another regional portal or vertical,
    // redirect gracefully to the canonical portal instead of failing with 404.

    // Middle East Portal (/me)
    if (pathname === '/me' || pathname.startsWith('/me/')) {
      const clean = pathname.replace(/^\/me/, '') || '/'
      if (vertical === 'middleeast' || vertical === 'me') {
        return NextResponse.redirect(new URL(clean + request.nextUrl.search, request.url), 302)
      } else {
        const targetHost = isLocalhost
          ? (host.includes('.localhost') ? 'middleeast.localhost:3000' : 'localhost:3000/me')
          : 'middleeast.nutytales.com'
        const dest = isLocalhost && !host.includes('.localhost')
          ? `${protocol}://${targetHost}${clean === '/' ? '' : clean}`
          : `${protocol}://${targetHost}${clean}`
        return NextResponse.redirect(dest + request.nextUrl.search, 302)
      }
    }

    // UK & Europe Portal (/eu)
    if (pathname === '/eu' || pathname.startsWith('/eu/')) {
      const clean = pathname.replace(/^\/eu/, '') || '/'
      if (vertical === 'europe' || vertical === 'eu') {
        return NextResponse.redirect(new URL(clean + request.nextUrl.search, request.url), 302)
      } else {
        const targetHost = isLocalhost
          ? (host.includes('.localhost') ? 'europe.localhost:3000' : 'localhost:3000/eu')
          : 'europe.nutytales.com'
        const dest = isLocalhost && !host.includes('.localhost')
          ? `${protocol}://${targetHost}${clean === '/' ? '' : clean}`
          : `${protocol}://${targetHost}${clean}`
        return NextResponse.redirect(dest + request.nextUrl.search, 302)
      }
    }

    // North America Portal (/us)
    if (pathname === '/us' || pathname.startsWith('/us/')) {
      const clean = pathname.replace(/^\/us/, '') || '/'
      if (vertical === 'america' || vertical === 'us') {
        return NextResponse.redirect(new URL(clean + request.nextUrl.search, request.url), 302)
      } else {
        const targetHost = isLocalhost
          ? (host.includes('.localhost') ? 'america.localhost:3000' : 'localhost:3000/us')
          : 'america.nutytales.com'
        const dest = isLocalhost && !host.includes('.localhost')
          ? `${protocol}://${targetHost}${clean === '/' ? '' : clean}`
          : `${protocol}://${targetHost}${clean}`
        return NextResponse.redirect(dest + request.nextUrl.search, 302)
      }
    }

    // Cross-subdomain mappings for core verticals
    const CROSS_PORTALS: { prefix: string; verticalKey: string; subdomain: string }[] = [
      { prefix: '/b2b', verticalKey: 'business', subdomain: 'business.nutytales.com' },
      { prefix: '/business-supply', verticalKey: 'business', subdomain: 'business.nutytales.com' },
      { prefix: '/gifting', verticalKey: 'gifting', subdomain: 'gifting.nutytales.com' },
      { prefix: '/weddings', verticalKey: 'weddings', subdomain: 'weddings.nutytales.com' },
      { prefix: '/crafts', verticalKey: 'crafts', subdomain: 'crafts.nutytales.com' },
      { prefix: '/stays', verticalKey: 'stays', subdomain: 'stays.nutytales.com' },
      { prefix: '/travel', verticalKey: 'travel', subdomain: 'travel.nutytales.com' },
      { prefix: '/nri', verticalKey: 'nri', subdomain: 'nri.nutytales.com' },
      { prefix: '/seller', verticalKey: 'seller', subdomain: 'seller.nutytales.com' },
    ]

    for (const portal of CROSS_PORTALS) {
      if (pathname === portal.prefix || pathname.startsWith(`${portal.prefix}/`)) {
        if (vertical !== portal.verticalKey) {
          const clean = pathname.replace(new RegExp(`^\\${portal.prefix}`), '') || '/'
          const dest = isLocalhost
            ? (host.includes('.localhost') ? `http://${portal.verticalKey}.localhost:3000${clean}` : `http://localhost:3000${portal.prefix}${clean === '/' ? '' : clean}`)
            : `https://${portal.subdomain}${clean}`
          return NextResponse.redirect(dest + request.nextUrl.search, 302)
        }
      }
    }

    const rewriteVertical = (targetPath: string) => {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-nutytales-vertical', vertical)
      requestHeaders.set('x-pathname', targetPath)
      const res = NextResponse.rewrite(new URL(targetPath, request.url), {
        request: {
          headers: requestHeaders,
        },
      })
      res.cookies.set('nt_active_vertical', vertical, { path: '/' })
      res.headers.set('x-nutytales-vertical', vertical)
      return res
    }

    const nextVertical = () => {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-nutytales-vertical', vertical)
      requestHeaders.set('x-pathname', pathname)
      const res = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
      res.cookies.set('nt_active_vertical', vertical, { path: '/' })
      res.headers.set('x-nutytales-vertical', vertical)
      return res
    }

    // ─── 4A-1. Dedicated Seller Portal Subdomain (seller.nutytales.com) ───
    if (vertical === 'seller') {
      // Static assets, next internals, and API routes pass through directly
      if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.')
      ) {
        return nextVertical()
      }

      // If already prefixed with /seller, pass through directly
      if (pathname === '/seller' || pathname.startsWith('/seller/')) {
        return nextVertical()
      }

      // Rewrite root and all subpaths directly into the /seller portal
      const targetPath = `/seller${pathname === '/' ? '' : pathname}`
      return rewriteVertical(targetPath)
    }

    // ─── 4B. Shared Global Commerce & Utility Routes ───
    // Preserve unified root commerce and utility routes instead of rewriting to non-existent
    // vertical subdirectories (e.g. /crafts/checkout -> 404).
    const isRegionalVertical =
      vertical === 'middleeast' ||
      vertical === 'me' ||
      vertical === 'europe' ||
      vertical === 'eu' ||
      vertical === 'america' ||
      vertical === 'us'

    // Root checkout & cart (regional subdomains have dedicated /me, /eu, /us versions)
    if (!isRegionalVertical) {
      if (pathname === '/checkout' || pathname.startsWith('/checkout/')) {
        return nextVertical()
      }
      if (pathname === '/cart' || pathname.startsWith('/cart/')) {
        return nextVertical()
      }
    }

    // Direct redirects for any legacy or accidental vertical prefixes to checkout/cart
    if (pathname === '/crafts/checkout' || pathname === '/b2b/checkout' || pathname === '/gifting/checkout' || pathname === '/weddings/checkout') {
      return NextResponse.redirect(new URL('/checkout', request.url), 302)
    }
    if (pathname === '/crafts/cart' || pathname === '/b2b/cart' || pathname === '/gifting/cart' || pathname === '/weddings/cart') {
      return NextResponse.redirect(new URL('/cart', request.url), 302)
    }

    // Order tracking & live delivery status
    if (pathname === '/orders/track' || pathname.startsWith('/orders/track/')) {
      return nextVertical()
    }
    if (pathname === '/orders' && vertical !== 'business') {
      return NextResponse.redirect(new URL('/orders/track', request.url), 302)
    }

    // Shared universal pages (auth, policies, search, shop catalog, gastronomy journal, sitemap index, verification txt)
    if (
      pathname.startsWith('/sitemaps/') ||
      pathname.endsWith('.txt') ||
      pathname === '/login' ||
      pathname === '/search' ||
      pathname === '/contact' ||
      pathname === '/privacy' ||
      pathname === '/terms' ||
      pathname === '/shipping' ||
      pathname === '/founders' ||
      pathname === '/technology' ||
      pathname === '/shop' ||
      pathname.startsWith('/shop/') ||
      pathname === '/gastronomy-journal' ||
      pathname.startsWith('/gastronomy-journal/') ||
      pathname === '/bulk-quote' ||
      pathname.startsWith('/bulk-quote/')
    ) {
      return nextVertical()
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
      if (pathname === '/venues') return rewriteVertical('/weddings/venues')
      if (pathname === '/vendors') return rewriteVertical('/weddings/vendors')
      if (pathname === '/inspiration') return rewriteVertical('/weddings/inspiration')
      if (pathname === '/planner') return rewriteVertical('/weddings/planner')
      if (pathname === '/vendor-portal') return rewriteVertical('/weddings/vendor-portal')
      if (pathname === '/admin') return rewriteVertical('/weddings/admin')
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

    if (vertical === 'middleeast' || vertical === 'me') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/me/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/me')
      if (pathname === '/store' || pathname === '/shop') return rewriteVertical('/me/store')
      if (pathname.startsWith('/store/')) return rewriteVertical(`/me${pathname}`)
      if (pathname.startsWith('/shop/')) return rewriteVertical(`/me/store${pathname.replace(/^\/shop/, '')}`)
      if (pathname === '/cart') return rewriteVertical('/me/cart')
      if (pathname === '/checkout') return rewriteVertical('/me/checkout')
      if (pathname.startsWith('/me')) return nextVertical()
      return rewriteVertical(`/me${pathname}`)
    }

    if (vertical === 'europe' || vertical === 'eu') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/eu/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/eu')
      if (pathname === '/store' || pathname === '/shop') return rewriteVertical('/eu/store')
      if (pathname.startsWith('/store/')) return rewriteVertical(`/eu${pathname}`)
      if (pathname.startsWith('/shop/')) return rewriteVertical(`/eu/store${pathname.replace(/^\/shop/, '')}`)
      if (pathname === '/cart') return rewriteVertical('/eu/cart')
      if (pathname === '/checkout') return rewriteVertical('/eu/checkout')
      if (pathname.startsWith('/eu')) return nextVertical()
      return rewriteVertical(`/eu${pathname}`)
    }

    if (vertical === 'america' || vertical === 'us') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/us/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/us')
      if (pathname === '/store' || pathname === '/shop') return rewriteVertical('/us/store')
      if (pathname.startsWith('/store/')) return rewriteVertical(`/us${pathname}`)
      if (pathname.startsWith('/shop/')) return rewriteVertical(`/us/store${pathname.replace(/^\/shop/, '')}`)
      if (pathname === '/cart') return rewriteVertical('/us/cart')
      if (pathname === '/checkout') return rewriteVertical('/us/checkout')
      if (pathname.startsWith('/us')) return nextVertical()
      return rewriteVertical(`/us${pathname}`)
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
    const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  }

  if (ACCOUNT_ROUTE.test(pathname)) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    // Does NOT exclude sitemap.xml so that vertical subdomain rewrites still work
    // (e.g. nri.nutytales.com/sitemap.xml → /nri/sitemap.xml via middleware).
    '/((?!_next/static|_next/image|favicon.ico|sitemap_index\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)',
  ],
}
