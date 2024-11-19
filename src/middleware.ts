import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient(
      { req: request, res },
      {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        options: {
          db: {
            schema: 'public'
          },
          global: {
            headers: { 'x-my-custom-header': 'my-app-name' },
          }
        }
      }
    )

    await supabase.auth.getSession()
    return res
  } catch (e) {
    console.error('Middleware error:', e)
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
} 