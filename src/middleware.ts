import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ── Route matchers ────────────────────────────────────────────────────────────
const ADMIN_ROUTE = /^\/admin(\/.*)?$/
const ACCOUNT_ROUTE = /^\/account(\/.*)?$/
const API_ADMIN_ROUTE = /^\/api\/admin(\/.*)?$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for session token in cookies (NextAuth / Auth.js)
  const token =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value

  // ── 1. API admin routes ─────────────────────────────────────────────────────
  if (API_ADMIN_ROUTE.test(pathname)) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 },
      )
    }
    return NextResponse.next()
  }

  // ── 2. Admin UI routes ──────────────────────────────────────────────────────
  if (ADMIN_ROUTE.test(pathname)) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', 'admin')
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // ── 3. Customer account routes ──────────────────────────────────────────────
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
  matcher: ['/admin/:path*', '/api/admin/:path*', '/account/:path*'],
}
