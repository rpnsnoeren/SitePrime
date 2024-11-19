import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const isLoginPage = request.nextUrl.pathname === '/dashboard/login'

  // Alleen redirecten als er geen sessie is
  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
} 