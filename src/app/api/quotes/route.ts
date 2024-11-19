import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('API ontvangen data:', data)

    // Valideer verplichte velden
    const requiredFields = ['company_name', 'contact_person', 'email', 'phone']
    for (const field of requiredFields) {
      if (!data[field]?.trim()) {
        return NextResponse.json(
          { error: `${field.replace('_', ' ')} is verplicht` },
          { status: 400 }
        )
      }
    }

    // Voeg de quote toe aan Supabase
    const { data: quote, error: insertError } = await supabaseAdmin
      .from('quotes')
      .insert([{
        ...data,
        status: 'PENDING',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json(
        { error: 'Database error bij opslaan quote' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      quote,
      message: 'Quote succesvol opgeslagen'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Er is een onverwachte fout opgetreden' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data: quotes, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(quotes)
  } catch (error) {
    console.error('API error bij ophalen quotes:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van de quotes' },
      { status: 500 }
    )
  }
} 