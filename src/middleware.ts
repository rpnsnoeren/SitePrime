import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  // Sla login route over
  if (request.nextUrl.pathname === '/dashboard/login') {
    return NextResponse.next()
  }

  // Check voor dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url))
    }

    try {
      // Verifieer token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(token.value, secret)
      return NextResponse.next()
    } catch (error) {
      // Token ongeldig of verlopen
      return NextResponse.redirect(new URL('/dashboard/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*'
} 