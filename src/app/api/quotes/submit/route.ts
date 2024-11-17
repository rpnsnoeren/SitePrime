import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Quote from '../../../../lib/models/Quote'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()
    console.log('Ontvangen quote data:', data)

    // Sla de quote op in de database
    const quote = new Quote(data)
    const savedQuote = await quote.save()
    console.log('Quote opgeslagen:', savedQuote)

    return NextResponse.json({ success: true, quote: savedQuote })
  } catch (error) {
    console.error('Error submitting quote:', error)
    return NextResponse.json(
      { error: 'Failed to submit quote', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 