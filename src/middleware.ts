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

    // ── A. BUSINESS: business.nutytales.com ───────────────────────────────────
    if (vertical === 'business') {
      if (pathname === '/' || pathname === '/business-supply') return rewriteVertical('/b2b')
      if (pathname === '/rfq') return rewriteVertical('/b2b/rfq')
      if (pathname === '/catalog') return rewriteVertical('/b2b/catalog')
      if (pathname === '/quotes') return rewriteVertical('/b2b/quotes')
      if (pathname === '/orders') return rewriteVertical('/b2b/orders')
      if (pathname === '/account') return rewriteVertical('/b2b/account')
      if (pathname === '/replenishment') return rewriteVertical('/b2b/replenishment')
      if (pathname.startsWith('/b2b')) return nextVertical()
      return rewriteVertical(`/b2b${pathname}`)
    }

    // ── B. GIFTING: gifting.nutytales.com ─────────────────────────────────────
    if (vertical === 'gifting') {
      if (pathname === '/') return rewriteVertical('/gifting')
      if (pathname.startsWith('/gifting')) return nextVertical()
      return rewriteVertical(`/gifting${pathname}`)
    }

    // ── C. WEDDINGS: weddings.nutytales.com ───────────────────────────────────
    if (vertical === 'weddings') {
      if (pathname === '/') return rewriteVertical('/weddings')
      if (pathname.startsWith('/weddings')) return nextVertical()
      return rewriteVertical(`/weddings${pathname}`)
    }

    // ── D. CRAFTS: crafts.nutytales.com ───────────────────────────────────────
    if (vertical === 'crafts') {
      if (pathname === '/') return rewriteVertical('/crafts')
      if (pathname.startsWith('/crafts')) return nextVertical()
      return rewriteVertical(`/crafts${pathname}`)
    }

    // ── E. STAYS: stays.nutytales.com ─────────────────────────────────────────
    if (vertical === 'stays') {
      if (pathname === '/') return rewriteVertical('/stays')
      if (pathname.startsWith('/stays')) return nextVertical()
      return rewriteVertical(`/stays${pathname}`)
    }

    // ── F. TRAVEL: travel.nutytales.com ───────────────────────────────────────
    if (vertical === 'travel') {
      if (pathname === '/') return rewriteVertical('/travel')
      if (pathname.startsWith('/travel')) return nextVertical()
      return rewriteVertical(`/travel${pathname}`)
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
