import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  if (process.env.COMING_SOON !== 'true') return NextResponse.next()

  const { pathname } = req.nextUrl
  if (pathname === '/coming-soon') return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/coming-soon'
  return NextResponse.rewrite(url)
}

export const config = {
  // Gate every page; leave API routes and static assets (incl. the logo) reachable.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)'],
}
