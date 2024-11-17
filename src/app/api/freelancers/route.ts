import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Freelancer from '@/lib/models/Freelancer'

export async function GET() {
  try {
    await dbConnect()
    const freelancers = await Freelancer.find().sort({ createdAt: -1 })
    return NextResponse.json(freelancers)
  } catch (error) {
    console.error('Error fetching freelancers:', error)
    return NextResponse.json(
      { error: 'Error fetching freelancers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()
    console.log('Ontvangen freelancer data:', data)

    // Valideer verplichte velden
    const requiredFields = ['name', 'email', 'experience', 'availability', 'rate']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is verplicht` },
          { status: 400 }
        )
      }
    }

    // Valideer skills
    if (!data.skills || data.skills.length === 0) {
      return NextResponse.json(
        { error: 'Minimaal één skill is verplicht' },
        { status: 400 }
      )
    }

    // Sla de freelancer op in de database
    const freelancer = new Freelancer(data)
    
    try {
      const savedFreelancer = await freelancer.save()
      console.log('Freelancer opgeslagen:', savedFreelancer)
      return NextResponse.json({ success: true, freelancer: savedFreelancer })
    } catch (validationError: any) {
      console.error('Validatie error:', validationError)
      if (validationError.name === 'ValidationError') {
        const errors = Object.values(validationError.errors).map((err: any) => err.message)
        return NextResponse.json(
          { error: 'Validatie error', details: errors },
          { status: 400 }
        )
      }
      if (validationError.code === 11000) { // Duplicate key error
        return NextResponse.json(
          { error: 'Dit emailadres is al geregistreerd' },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    console.error('Error submitting freelancer:', error)
    return NextResponse.json(
      { error: 'Failed to submit freelancer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 