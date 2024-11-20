import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('freelancers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van de freelancers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'expertise', 'experience', 'rate', 'status', 'availability']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return NextResponse.json(
        { error: `Verplichte velden ontbreken: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Create the freelancer object
    const freelancer = {
      name: body.name,
      email: body.email,
      expertise: body.expertise,
      experience: body.experience,
      rate: body.rate,
      status: body.status,
      availability: body.availability,
      created_at: new Date().toISOString(),
    }

    console.log('Attempting to insert freelancer:', freelancer)

    const { data, error } = await supabase
      .from('freelancers')
      .insert([freelancer])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      // Log detailed error information
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'De freelancers tabel bestaat niet in de database' },
          { status: 500 }
        )
      } else if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Er bestaat al een freelancer met dit e-mailadres' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Freelancer is aangemaakt maar kon niet worden opgehaald' },
        { status: 500 }
      )
    }

    console.log('Successfully created freelancer:', data[0])
    return NextResponse.json(data[0])
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        error: 'Er is een fout opgetreden bij het toevoegen van de freelancer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}