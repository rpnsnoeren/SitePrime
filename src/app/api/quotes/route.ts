import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: quotes, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(quotes)
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Error fetching quotes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Ontvangen quote data:', data)

    // Valideer verplichte velden
    const requiredFields = ['websiteType', 'budget', 'timeline', 'companyName', 'contactPerson', 'email', 'phone']
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
      .from('quotes')
      .select('count', { count: 'exact', head: true })

    if (tableError) {
      console.error('Tabel check error:', tableError)
      return NextResponse.json(
        { 
          error: 'Database configuratie fout',
          details: 'De quotes tabel bestaat niet. Voer eerst de migraties uit.'
        },
        { status: 500 }
      )
    }

    // Voeg de quote toe
    const { data: quote, error: insertError } = await supabase
      .from('quotes')
      .insert([{
        website_type: data.websiteType,
        features: Array.isArray(data.features) ? data.features : [],
        budget: data.budget,
        timeline: data.timeline,
        company_name: data.companyName,
        contact_person: data.contactPerson,
        email: data.email,
        phone: data.phone,
        additional_info: data.additionalInfo || null,
        status: 'nieuw'
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { 
          error: 'Database error',
          details: insertError.message
        },
        { status: 500 }
      )
    }

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote kon niet worden aangemaakt' },
        { status: 500 }
      )
    }

    console.log('Quote succesvol opgeslagen:', quote)
    return NextResponse.json({ success: true, quote })
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