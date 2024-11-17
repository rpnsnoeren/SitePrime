import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Freelancer from '../../../../lib/models/Freelancer'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()
    console.log('Ontvangen freelancer data:', data)

    // Sla de freelancer op in de database
    const freelancer = new Freelancer(data)
    const savedFreelancer = await freelancer.save()
    console.log('Freelancer opgeslagen:', savedFreelancer)

    return NextResponse.json({ success: true, freelancer: savedFreelancer })
  } catch (error) {
    console.error('Error submitting freelancer:', error)
    return NextResponse.json(
      { error: 'Failed to submit freelancer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 