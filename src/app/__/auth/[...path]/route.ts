import { NextRequest, NextResponse } from 'next/server'

const FIREBASE_AUTH_UPSTREAM = 'https://nutty-tales-1c667.firebaseapp.com'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  const search = request.nextUrl.search
  const subPath = Array.isArray(path) ? path.join('/') : path
  const targetUrl = `${FIREBASE_AUTH_UPSTREAM}/__/auth/${subPath}${search}`

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': request.headers.get('accept') || '*/*',
        'User-Agent': request.headers.get('user-agent') || 'Next.js Firebase Proxy',
      },
    })

    const contentType = upstreamRes.headers.get('content-type') || 'text/html; charset=utf-8'
    const body = await upstreamRes.arrayBuffer()

    return new NextResponse(body, {
      status: upstreamRes.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': upstreamRes.headers.get('cache-control') || 'public, max-age=1800',
      },
    })
  } catch (err) {
    console.error('Firebase Auth Proxy error (GET):', err)
    return new NextResponse('Internal Auth Proxy Error', { status: 502 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  const search = request.nextUrl.search
  const subPath = Array.isArray(path) ? path.join('/') : path
  const targetUrl = `${FIREBASE_AUTH_UPSTREAM}/__/auth/${subPath}${search}`

  try {
    const reqBody = await request.arrayBuffer()
    const contentType = request.headers.get('content-type') || 'application/x-www-form-urlencoded'

    const upstreamRes = await fetch(targetUrl, {
      method: 'POST',
      body: reqBody,
      headers: {
        'Content-Type': contentType,
        'Accept': request.headers.get('accept') || '*/*',
        'User-Agent': request.headers.get('user-agent') || 'Next.js Firebase Proxy',
      },
    })

    const resContentType = upstreamRes.headers.get('content-type') || 'text/html; charset=utf-8'
    const resBody = await upstreamRes.arrayBuffer()

    return new NextResponse(resBody, {
      status: upstreamRes.status,
      headers: {
        'Content-Type': resContentType,
      },
    })
  } catch (err) {
    console.error('Firebase Auth Proxy error (POST):', err)
    return new NextResponse('Internal Auth Proxy Error', { status: 502 })
  }
}
