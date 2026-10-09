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
  const vertical = getActiveVertical(request)

  if (pathname.startsWith('/api')) {
    // Note: nt_uid cookie is a routing/redirect convenience hint only.
    // Sensitive API endpoints MUST independently verify Firebase ID tokens via verifyIdToken() or Supabase JWT.
    if (API_ADMIN_ROUTE.test(pathname)) {
      const authHeader = request.headers.get('authorization')
      const token = request.cookies.get('nt_uid')?.value
      if (!authHeader && !token) {
        return NextResponse.json({ error: 'Unauthorized', message: 'Authentication required.' }, { status: 401 })
      }
    }
    return NextResponse.next()
  }

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
      if (pathname === '/marketplace') return rewriteVertical('/nri/marketplace')
      if (pathname === '/how-it-works') return rewriteVertical('/nri/how-it-works')
      if (pathname === '/providers' || pathname === '/for-providers') return rewriteVertical('/nri/providers')
      if (pathname === '/for-business' || pathname === '/business') return rewriteVertical('/nri/business')
      if (pathname === '/dashboard' || pathname === '/my-india') return rewriteVertical('/nri/dashboard')
      if (pathname === '/emergency') return rewriteVertical('/nri/emergency')
      if (pathname === '/provider-workspace') return rewriteVertical('/nri/provider-workspace')
      if (pathname === '/nri-services') return rewriteVertical('/nri/services')
      if (pathname === '/nri-property-management') return rewriteVertical('/nri/services/property-management')
      if (pathname === '/nri-parent-care') return rewriteVertical('/nri/services/parent-care')
      if (pathname === '/nri-healthcare') return rewriteVertical('/nri/services/healthcare')
      if (pathname === '/nri-legal-services') return rewriteVertical('/nri/services/legal-services')
      if (pathname === '/nri-tax-services') return rewriteVertical('/nri/services/tax-services')
      if (pathname === '/nri-home-services') return rewriteVertical('/nri/services/home-services')
      if (pathname === '/nri-travel') return rewriteVertical('/nri/services/travel')
      if (pathname === '/nri-weddings') return rewriteVertical('/nri/services/weddings')
      if (pathname === '/nri-gifting') return rewriteVertical('/nri/services/gifting')
      if (pathname === '/usa-to-india-services') return rewriteVertical('/nri/country/usa')
      if (pathname === '/uk-to-india-services') return rewriteVertical('/nri/country/uk')
      if (pathname === '/canada-to-india-services') return rewriteVertical('/nri/country/canada')
      if (pathname === '/dubai-to-india-services') return rewriteVertical('/nri/country/uae')
      if (pathname.startsWith('/nri')) return nextVertical()
      return rewriteVertical(`/nri${pathname}`)
    }

    if (vertical === 'business') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/business/sitemap.xml')
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

    if (vertical === 'gifting') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/gifting/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/gifting')
      if (pathname.startsWith('/gifting')) return nextVertical()
      return rewriteVertical(`/gifting${pathname}`)
    }

    if (vertical === 'weddings') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/weddings/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/weddings')
      if (pathname.startsWith('/weddings')) return nextVertical()
      return rewriteVertical(`/weddings${pathname}`)
    }

    if (vertical === 'crafts') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/crafts/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/crafts')
      if (pathname.startsWith('/crafts')) return nextVertical()
      return rewriteVertical(`/crafts${pathname}`)
    }

    if (vertical === 'stays') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/stays/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/stays')
      if (pathname.startsWith('/stays')) return nextVertical()
      return rewriteVertical(`/stays${pathname}`)
    }

    if (vertical === 'travel') {
      if (pathname === '/sitemap.xml') return rewriteVertical('/travel/sitemap.xml')
      if (pathname === '/') return rewriteVertical('/travel')
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)',
  ],
}
