import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    console.log('Update quote data:', { id: params.id, ...data })

    const { data: quote, error } = await supabaseAdmin
      .from('quotes')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json(
        { error: 'Fout bij updaten quote' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      quote,
      message: 'Quote succesvol bijgewerkt'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Er is een onverwachte fout opgetreden' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
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