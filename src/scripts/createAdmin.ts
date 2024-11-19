import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as bcrypt from 'bcrypt'

dotenv.config()

// Controleer of alle benodigde omgevingsvariabelen aanwezig zijn
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missende omgevingsvariabelen. Controleer je .env bestand.')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function createAdmin() {
  try {
    // Admin gegevens
    const adminUsername = 'admin' // Pas dit aan naar wens
    const adminPassword = 'admin123' // Pas dit aan naar een sterk wachtwoord
    
    // Hash het wachtwoord
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds)

    // Voeg de admin toe aan de database
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: adminUsername,
          password: hashedPassword,
          role: 'admin'
        }
      ])
      .select()

    if (error) {
      throw error
    }

    console.log('Admin gebruiker succesvol aangemaakt:', data)
  } catch (error) {
    console.error('Fout bij het aanmaken van admin gebruiker:', error)
  }
}

// Voer de functie uit
createAdmin()
