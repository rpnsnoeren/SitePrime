import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'

interface EmailData {
  websiteType: string
  features: string[]
  budget: string
  timeline: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  additionalInfo: string
}

// Email configuratie
const transportConfig: SMTPTransport.Options = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
}

export async function POST(request: Request) {
  try {
    // Valideer of alle environment variables aanwezig zijn
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email configuratie ontbreekt')
    }

    const formData: EmailData = await request.json()
    
    // Valideer form data
    if (!formData.email || !formData.companyName) {
      return NextResponse.json(
        { error: 'Verplichte velden ontbreken' },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport(transportConfig)

    // Test de connectie
    await transporter.verify()

    // Email template
    const emailContent = `
      Nieuwe Offerte Aanvraag:
      
      Website Type: ${formData.websiteType}
      Gewenste Features: ${formData.features.join(', ')}
      Budget: ${formData.budget}
      Timeline: ${formData.timeline}
      
      Contactgegevens:
      Bedrijf: ${formData.companyName}
      Contactpersoon: ${formData.contactPerson}
      Email: ${formData.email}
      Telefoon: ${formData.phone}
      
      Aanvullende Informatie:
      ${formData.additionalInfo}
    `

    // Verstuur email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Nieuwe Offerte Aanvraag - ${formData.companyName}`,
      text: emailContent,
    })

    console.log('Email verzonden:', info.messageId)

    return NextResponse.json({ success: true, messageId: info.messageId })
  } catch (error) {
    console.error('Error processing quote:', error)
    
    // Gedetailleerdere error message
    const errorMessage = error instanceof Error ? error.message : 'Onbekende fout'
    
    return NextResponse.json(
      { error: 'Er is een fout opgetreden', details: errorMessage },
      { status: 500 }
    )
  }
} 