import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialiseer Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

    // Authenticeer met Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username, // Supabase gebruikt email als identifier
      password: password
    })

    if (error) {
      console.error('Supabase auth error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      user: data.user
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 