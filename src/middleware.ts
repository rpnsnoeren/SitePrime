import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip middleware voor de login route
  if (request.nextUrl.pathname === '/dashboard/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')
  
  // Redirect naar login als er geen token is
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
} 