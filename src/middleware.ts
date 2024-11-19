import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Sla login route over
  if (request.nextUrl.pathname === '/dashboard/login') {
    return NextResponse.next()
  }

  // Check voor dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      // Creëer response
      const res = NextResponse.next()
      
      // Creëer Supabase client met expliciete configuratie
      const supabase = createMiddlewareClient(
        { req: request, res },
        {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          auth: {
            persistSession: false // Voorkom sessie persistentie problemen
          }
        }
      )

      // Check sessie
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Supabase auth error:', error)
        return NextResponse.redirect(new URL('/dashboard/login', request.url))
      }

      if (!session) {
        return NextResponse.redirect(new URL('/dashboard/login', request.url))
      }

      return res
    } catch (error) {
      console.error('Middleware error:', error)
      // Bij een error, redirect naar login
      return NextResponse.redirect(new URL('/dashboard/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
} 