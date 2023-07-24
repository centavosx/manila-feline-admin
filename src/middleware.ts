import { User } from 'entities'

import jwtDecode from 'jwt-decode'
import { NextRequest, NextResponse } from 'next/server'

// Limit the middleware to paths starting with `/api/`

const PAGES_WITH_NO_GUARD = ['/']

const checkPath = (user: boolean, pathname: string) => {
  if (!user && !PAGES_WITH_NO_GUARD.some((v) => pathname === v)) {
    return '/'
  }

  if (!!user && PAGES_WITH_NO_GUARD.some((v) => pathname === v)) {
    return '/dashboard'
  }

  return null
}

export function middleware(request: NextRequest) {
  // Call our authentication function to check the request
  const token = request.cookies.get('accessToken')
  const user: User | undefined = !!token?.value
    ? jwtDecode(token?.value) || undefined
    : undefined

  const redirectString = checkPath(!!user, request.nextUrl.pathname)

  if (redirectString !== null)
    return NextResponse.redirect(new URL(redirectString, request.url))
}

export const config = {
  matcher: [
    '/',
    '/appointments/:path*',
    '/dashboard',
    '/doctors/:path*',
    '/products/:path*',
    '/reset',
    '/services',
    '/users',
    '/admins',
  ],
}
