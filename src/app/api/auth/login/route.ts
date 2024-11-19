import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Initialiseer Supabase client met admin rechten
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Basis validatie
    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Vul alle velden in' },
        { status: 400 }
      )
    }

    // Zoek gebruiker in database
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, username, password, role')
      .eq('username', username.trim())
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 401 }
      )
    }

    // Verifieer wachtwoord
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Ongeldig wachtwoord' },
        { status: 401 }
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

    // Maak response met cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 dag
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het inloggen' },
      { status: 500 }
    )
  }
} 