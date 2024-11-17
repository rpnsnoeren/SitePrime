import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Quote from '@/lib/models/Quote'

export async function GET() {
  try {
    await dbConnect()
    const quotes = await Quote.find().sort({ createdAt: -1 })
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
    await dbConnect()
    const data = await request.json()
    console.log('Ontvangen quote data:', data)

    // Valideer verplichte velden
    const requiredFields = ['websiteType', 'budget', 'timeline', 'companyName', 'contactPerson', 'email', 'phone']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is verplicht` },
          { status: 400 }
        )
      }
    }

    // Sla de quote op in de database
    const quote = new Quote(data)
    
    try {
      const savedQuote = await quote.save()
      console.log('Quote opgeslagen:', savedQuote)
      return NextResponse.json({ success: true, quote: savedQuote })
    } catch (validationError: any) {
      console.error('Validatie error:', validationError)
      if (validationError.name === 'ValidationError') {
        const errors = Object.values(validationError.errors).map((err: any) => err.message)
        return NextResponse.json(
          { error: 'Validatie error', details: errors },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    console.error('Error submitting quote:', error)
    return NextResponse.json(
      { error: 'Failed to submit quote', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 