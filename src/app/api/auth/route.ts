import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import User from '@/lib/models/User'

export async function POST(request: Request) {
  try {
    await dbConnect()
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
    const user = await User.findOne({ username })
    console.log('Gebruiker gevonden:', user ? 'ja' : 'nee')
    
    if (!user) {
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 401 }
      )
    }

    // Valideer wachtwoord
    const isValid = await bcrypt.compare(password, user.password)
    console.log('Wachtwoord validatie resultaat:', isValid)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Ongeldig wachtwoord' },
        { status: 401 }
      )
    }

    // Controleer JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET niet geconfigureerd')
      return NextResponse.json(
        { error: 'Server configuratie fout' },
        { status: 500 }
      )
    }

    // Genereer token
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    // Stuur response
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 