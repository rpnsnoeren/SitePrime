import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Valideer input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Gebruikersnaam en wachtwoord zijn verplicht' },
        { status: 400 }
      )
    }

    // Controleer eerst of de users tabel bestaat
    const { error: tableError } = await supabaseAdmin
      .from('users')
      .select('count', { count: 'exact', head: true })

    if (tableError) {
      console.error('Users tabel error:', tableError)
      return NextResponse.json(
        { error: 'Database configuratie fout' },
        { status: 500 }
      )
    }

    // Haal gebruiker op uit Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (userError) {
      console.error('User lookup error:', userError)
      return NextResponse.json(
        { error: 'Ongeldige inloggegevens' },
        { status: 401 }
      )
    }

    if (!user) {
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

    // Stel cookie headers in
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })

    // Voeg cookies toe aan response
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 dag
    })

    return response

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het inloggen' },
      { status: 500 }
    )
  }
} 