import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'quotes.json')

// Zorg ervoor dat de data directory bestaat
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'))
}

// Maak quotes.json aan als deze nog niet bestaat
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]))
}

export async function GET() {
  try {
    const quotes = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
    return NextResponse.json(quotes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Kon aanvragen niet ophalen' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const quotes = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
    
    const newQuote = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'nieuw'
    }
    
    quotes.push(newQuote)
    fs.writeFileSync(DB_PATH, JSON.stringify(quotes, null, 2))

    return NextResponse.json(newQuote)
  } catch (error) {
    return NextResponse.json(
      { error: 'Kon aanvraag niet opslaan' },
      { status: 500 }
    )
  }
} 