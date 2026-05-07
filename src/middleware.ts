import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'up_session'

const PROTECTED: { pattern: RegExp; role: string; redirect: string }[] = [
  { pattern: /^\/dashboard/,            role: 'admin',    redirect: '/auth/login' },
  { pattern: /^\/api\/admin/,           role: 'admin',    redirect: '/auth/login' },
  { pattern: /^\/resellers\/dashboard/, role: 'reseller', redirect: '/auth/login' },
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionId = req.cookies.get(SESSION_COOKIE)?.value

  for (const route of PROTECTED) {
    if (!route.pattern.test(pathname)) continue
    if (!sessionId) {
      const url = req.nextUrl.clone()
      url.pathname = route.redirect
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    if (req.headers.get('x-middleware-check')) return NextResponse.next()
    const check = await fetch(new URL('/api/auth/me', req.url), {
      headers: {
        cookie: req.headers.get('cookie') ?? '',
        'x-middleware-check': '1',
      },
    }).catch(() => null)
    if (!check?.ok) {
      const url = req.nextUrl.clone()
      url.pathname = route.redirect
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    const { role } = await check.json().catch(() => ({ role: '' }))
    if (route.role === 'admin' && role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login?error=forbidden', req.url))
    }
    break
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*', '/resellers/dashboard/:path*'],
}
