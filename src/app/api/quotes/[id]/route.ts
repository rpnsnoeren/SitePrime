import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const { data: quote, error } = await supabase
      .from('quotes')
      .update(data)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, quote })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het updaten van de offerte' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { error: 'Fout bij verwijderen quote' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Quote succesvol verwijderd'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Er is een onverwachte fout opgetreden' },
      { status: 500 }
    )
  }
} 