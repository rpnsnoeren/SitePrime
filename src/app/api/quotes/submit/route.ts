import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const { data: quote, error } = await supabase
      .from('quotes')
      .insert([data])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, quote })
  } catch (error) {
    console.error('Error submitting quote:', error)
    return NextResponse.json(
      { error: 'Failed to submit quote', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 