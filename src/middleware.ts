import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ── Route matchers ────────────────────────────────────────────────────────────
const ADMIN_ROUTE = /^\/admin(\/.*)?$/
const ACCOUNT_ROUTE = /^\/account(\/.*)?$/
const API_ADMIN_ROUTE = /^\/api\/admin(\/.*)?$/

/**
 * Detects whether the incoming request is targeting the dedicated B2B portal:
 * - Production: business.nutytales.com
 * - Local development: business.localhost:3000
 * - Query override: ?subdomain=business or ?b2b=1
 * - Header override: x-business-subdomain: true
 */
function isBusinessHost(request: NextRequest): boolean {
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.hostname ||
    ''

  const searchParams = request.nextUrl.searchParams

  return (
    host.startsWith('business.nutytales.com') ||
    host.startsWith('business.localhost') ||
    searchParams.get('subdomain') === 'business' ||
    searchParams.get('b2b') === '1' ||
    request.headers.get('x-business-subdomain') === 'true'
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. Hostname-Aware B2B Subdomain Routing ────────────────────────────────
  // When accessed via business.nutytales.com, internally rewrite to /b2b routes
  // while keeping the browser URL clean (e.g. business.nutytales.com/rfq)
  if (isBusinessHost(request)) {
    // API endpoints pass through directly
    if (pathname.startsWith('/api')) {
      return NextResponse.next()
    }

    // Direct B2B route mappings
    if (pathname === '/' || pathname === '/business-supply') {
      return NextResponse.rewrite(new URL('/b2b', request.url))
    }

    if (pathname === '/rfq') {
      return NextResponse.rewrite(new URL('/b2b/rfq', request.url))
    }

    if (pathname === '/catalog') {
      return NextResponse.rewrite(new URL('/b2b/catalog', request.url))
    }

    if (pathname === '/quotes') {
      return NextResponse.rewrite(new URL('/b2b/quotes', request.url))
    }

    if (pathname === '/orders') {
      return NextResponse.rewrite(new URL('/b2b/orders', request.url))
    }

    if (pathname === '/account') {
      return NextResponse.rewrite(new URL('/b2b/account', request.url))
    }

    if (pathname === '/replenishment') {
      return NextResponse.rewrite(new URL('/b2b/replenishment', request.url))
    }

    // If already starting with /b2b, let it pass through
    if (pathname.startsWith('/b2b')) {
      return NextResponse.next()
    }

    // Rewrite any other path to /b2b/[path]
    return NextResponse.rewrite(new URL(`/b2b${pathname}`, request.url))
  }

  // ── 2. Consumer Website (nutytales.com) Authentication Checks ───────────────
  // Check for session token in cookies (Firebase Auth nt_uid or NextAuth fallback)
  const token =
    request.cookies.get('nt_uid')?.value ||
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value

  // API admin routes
  if (API_ADMIN_ROUTE.test(pathname)) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 },
      )
    }
    return NextResponse.next()
  }

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
