import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const user = request.cookies.get('user')

  // Als we op de login pagina zijn en er is een token, redirect naar dashboard
  if (request.nextUrl.pathname === '/dashboard/login') {
    if (token && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Voor alle andere dashboard routes, check auth
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token || !user) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*'
} 