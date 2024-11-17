import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Deze functie moet als 'default' geëxporteerd worden
export default function middleware(request: NextRequest) {
  // Als het een dashboard pagina is (maar niet de login pagina)
  if (
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !request.nextUrl.pathname.includes('/login')
  ) {
    // Check voor de isLoggedIn cookie
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value
    
    if (!isLoggedIn) {
      // Redirect naar login als niet ingelogd
      const loginUrl = new URL('/dashboard/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Config voor de middleware
export const config = {
  matcher: '/dashboard/:path*',
} 