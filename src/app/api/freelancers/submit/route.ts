import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const { data: freelancer, error } = await supabase
      .from('freelancers')
      .insert([data])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, freelancer })
  } catch (error) {
    console.error('Error submitting freelancer:', error)
    return NextResponse.json(
      { error: 'Failed to submit freelancer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 