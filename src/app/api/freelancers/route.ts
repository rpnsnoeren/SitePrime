import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'freelancers.json')

// Zorg ervoor dat de data directory bestaat
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'))
}

// Maak freelancers.json aan als deze nog niet bestaat
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]))
}

export async function GET() {
  try {
    const freelancers = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
    return NextResponse.json(freelancers)
  } catch (error) {
    return NextResponse.json(
      { error: 'Kon freelancer aanmeldingen niet ophalen' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const freelancers = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
    
    const newFreelancer = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'nieuw'
    }
    
    freelancers.push(newFreelancer)
    fs.writeFileSync(DB_PATH, JSON.stringify(freelancers, null, 2))

    return NextResponse.json(newFreelancer)
  } catch (error) {
    return NextResponse.json(
      { error: 'Kon aanmelding niet opslaan' },
      { status: 500 }
    )
  }
} 