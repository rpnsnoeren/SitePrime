import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: freelancers, error } = await supabase
      .from('freelancers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(freelancers)
  } catch (error) {
    console.error('Error fetching freelancers:', error)
    return NextResponse.json(
      { error: 'Error fetching freelancers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Ontvangen data:', data)

    // Valideer verplichte velden
    const requiredFields = ['name', 'email', 'experience', 'availability', 'rate']
    for (const field of requiredFields) {
      if (!data[field]) {
        console.log(`Ontbrekend verplicht veld: ${field}`)
        return NextResponse.json(
          { error: `${field} is verplicht` },
          { status: 400 }
        )
      }
    }

    // Valideer email formaat
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Ongeldig email formaat' },
        { status: 400 }
      )
    }

    // Controleer eerst of de tabel bestaat
    const { error: tableError } = await supabase
      .from('freelancers')
      .select('count', { count: 'exact', head: true })

    if (tableError) {
      console.error('Tabel check error:', tableError)
      return NextResponse.json(
        { 
          error: 'Database configuratie fout',
          details: 'De freelancers tabel bestaat niet. Voer eerst de migraties uit.'
        },
        { status: 500 }
      )
    }

    // Probeer de freelancer toe te voegen
    const { data: freelancer, error: insertError } = await supabase
      .from('freelancers')
      .insert([{
        name: data.name,
        email: data.email,
        skills: Array.isArray(data.skills) ? data.skills : [],
        experience: data.experience,
        availability: data.availability,
        rate: data.rate,
        portfolio: data.portfolio || null,
        status: 'beschikbaar'
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      
      // Specifieke error handling
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Dit emailadres is al geregistreerd' },
          { status: 400 }
        )
      }

      // Database permission errors
      if (insertError.code === '42501') {
        return NextResponse.json(
          { error: 'Geen toegang tot de database' },
          { status: 403 }
        )
      }

      // Andere database errors
      return NextResponse.json(
        { 
          error: 'Database error',
          details: insertError.message
        },
        { status: 500 }
      )
    }

    if (!freelancer) {
      return NextResponse.json(
        { error: 'Freelancer kon niet worden aangemaakt' },
        { status: 500 }
      )
    }

    console.log('Succesvol geregistreerd:', freelancer)
    return NextResponse.json({ success: true, freelancer })
  } catch (error) {
    console.error('Onverwachte error:', error)
    return NextResponse.json(
      { 
        error: 'Er is een onverwachte fout opgetreden',
        details: error instanceof Error ? error.message : 'Onbekende fout'
      },
      { status: 500 }
    )
  }
} 