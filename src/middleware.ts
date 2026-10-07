import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ── Route matchers ────────────────────────────────────────────────────────────
const ADMIN_ROUTE = /^\/admin(\/.*)?$/
const ACCOUNT_ROUTE = /^\/account(\/.*)?$/
const API_ADMIN_ROUTE = /^\/api\/admin(\/.*)?$/

/**
 * Identifies the vertical subdomain from the incoming request:
 * Supports:
 * - Production: business.nutytales.com, gifting.nutytales.com, weddings.nutytales.com,
 *               crafts.nutytales.com, stays.nutytales.com, travel.nutytales.com
 * - Local Dev: *.localhost:3000
 * - Query Override: ?vertical=... or ?subdomain=...
 * - Header Override: x-nutytales-vertical or x-forwarded-host
 */
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
  const vertical = getActiveVertical(request)

  // ── 1. Pass through API routes untouched ───────────────────────────────────
  if (pathname.startsWith('/api')) {
    // API admin protection
    if (API_ADMIN_ROUTE.test(pathname)) {
      const token =
        request.cookies.get('nt_uid')?.value ||
        request.cookies.get('authjs.session-token')?.value ||
        request.cookies.get('__Secure-authjs.session-token')?.value ||
        request.cookies.get('next-auth.session-token')?.value
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized', message: 'Authentication required.' }, { status: 401 })
      }
    }
    return NextResponse.next()
  }

  // ── 2. Multi-Vertical Subdomain Hostname-Aware Routing ─────────────────────
  if (vertical) {
    // ── A. BUSINESS: business.nutytales.com ───────────────────────────────────
    if (vertical === 'business') {
      if (pathname === '/' || pathname === '/business-supply') {
        return NextResponse.rewrite(new URL('/b2b', request.url))
      }
      if (pathname === '/rfq') return NextResponse.rewrite(new URL('/b2b/rfq', request.url))
      if (pathname === '/catalog') return NextResponse.rewrite(new URL('/b2b/catalog', request.url))
      if (pathname === '/quotes') return NextResponse.rewrite(new URL('/b2b/quotes', request.url))
      if (pathname === '/orders') return NextResponse.rewrite(new URL('/b2b/orders', request.url))
      if (pathname === '/account') return NextResponse.rewrite(new URL('/b2b/account', request.url))
      if (pathname === '/replenishment') return NextResponse.rewrite(new URL('/b2b/replenishment', request.url))
      if (pathname.startsWith('/b2b')) return NextResponse.next()
      return NextResponse.rewrite(new URL(`/b2b${pathname}`, request.url))
    }

    // ── B. GIFTING: gifting.nutytales.com ─────────────────────────────────────
    if (vertical === 'gifting') {
      if (pathname === '/') return NextResponse.rewrite(new URL('/gifting', request.url))
      if (pathname.startsWith('/gifting')) return NextResponse.next()
      return NextResponse.rewrite(new URL(`/gifting${pathname}`, request.url))
    }

    // ── C. WEDDINGS: weddings.nutytales.com ───────────────────────────────────
    if (vertical === 'weddings') {
      if (pathname === '/') return NextResponse.rewrite(new URL('/weddings', request.url))
      if (pathname.startsWith('/weddings')) return NextResponse.next()
      return NextResponse.rewrite(new URL(`/weddings${pathname}`, request.url))
    }

    // ── D. CRAFTS: crafts.nutytales.com ───────────────────────────────────────
    if (vertical === 'crafts') {
      if (pathname === '/') return NextResponse.rewrite(new URL('/crafts', request.url))
      if (pathname.startsWith('/crafts')) return NextResponse.next()
      return NextResponse.rewrite(new URL(`/crafts${pathname}`, request.url))
    }

    // ── E. STAYS: stays.nutytales.com ─────────────────────────────────────────
    if (vertical === 'stays') {
      if (pathname === '/') return NextResponse.rewrite(new URL('/stays', request.url))
      if (pathname.startsWith('/stays')) return NextResponse.next()
      return NextResponse.rewrite(new URL(`/stays${pathname}`, request.url))
    }

    // ── F. TRAVEL: travel.nutytales.com ───────────────────────────────────────
    if (vertical === 'travel') {
      if (pathname === '/') return NextResponse.rewrite(new URL('/travel', request.url))
      if (pathname.startsWith('/travel')) return NextResponse.next()
      return NextResponse.rewrite(new URL(`/travel${pathname}`, request.url))
    }
  }

  // ── 3. Consumer Website (nutytales.com) Authentication Checks ───────────────
  const token =
    request.cookies.get('nt_uid')?.value ||
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value

  // Admin UI routes
  if (ADMIN_ROUTE.test(pathname)) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', 'admin')
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Customer account routes (consumer site)
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
    /*
     * Match all request paths except for static files:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (e.g. .svg, .png, .jpg, .jpeg, .gif, .webp, .ico, .txt, .xml)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
}
