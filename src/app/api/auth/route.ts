import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // Controleer eerst of het request correct is
    if (!request.body) {
      return NextResponse.json(
        { error: 'Geen data ontvangen' },
        { status: 400 }
      )
    }

    const { username, password } = await request.json()

    // Valideer input
    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Username en wachtwoord zijn verplicht' },
        { status: 400 }
      )
    }

    // Zoek gebruiker
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username.trim())
      .single()

    if (userError || !user) {
      console.error('User lookup error:', userError)
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 401 }
      )
    }

    // Verifieer wachtwoord
    try {
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Ongeldig wachtwoord' },
          { status: 401 }
        )
      }
    } catch (bcryptError) {
      console.error('Password verification error:', bcryptError)
      return NextResponse.json(
        { error: 'Authenticatie fout' },
        { status: 500 }
      )
    }

    // Genereer JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    // Creëer response met cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      },
      { status: 200 }
    )

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/' // Belangrijk: zorg dat de cookie beschikbaar is voor hele site
    })

    return response

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { 
        error: 'Er is een fout opgetreden bij het inloggen',
        details: error instanceof Error ? error.message : 'Onbekende fout'
      },
      { status: 500 }
    )
  }
} 