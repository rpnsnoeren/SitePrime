import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    console.log('Login poging voor gebruiker:', username)

    // Valideer input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Gebruikersnaam en wachtwoord zijn verplicht' },
        { status: 400 }
      )
    }

    // Zoek gebruiker
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      )
    }

    if (!user) {
      console.error('Gebruiker niet gevonden:', username)
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 401 }
      )
    }

    // Valideer wachtwoord
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      console.error('Ongeldig wachtwoord voor gebruiker:', username)
      return NextResponse.json(
        { error: 'Ongeldig wachtwoord' },
        { status: 401 }
      )
    }

    // Genereer token
    const token = jwt.sign(
      { 
        sub: user.id,
        username: user.username,
        role: user.role 
      },
      process.env.SUPABASE_JWT_SECRET!,
      { expiresIn: '1d' }
    )

    // Stuur response met token en user info
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        error: 'Er is een fout opgetreden',
        details: error instanceof Error ? error.message : 'Onbekende fout'
      },
      { status: 500 }
    )
  }
} 