import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Quote from '../../../../lib/models/Quote'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params
    const body = await request.json()

    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    )

    if (!updatedQuote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedQuote)
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { error: 'Error updating quote' },
      { status: 500 }
    )
  }
} 