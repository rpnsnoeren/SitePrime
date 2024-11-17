import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missende Supabase credentials. Zorg ervoor dat NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY zijn ingesteld in je .env.local file.'
  )
}

try {
  // Valideer de URL
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(
    `Ongeldige NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}. Zorg ervoor dat dit een geldige URL is.`
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Test de connectie met async/await en proper error handling
const testConnection = async () => {
  try {
    const { error } = await supabase
      .from('quotes')
      .select('count', { count: 'exact', head: true })

    if (error) {
      console.error('Supabase connectie error:', error.message)
    } else {
      console.log('Supabase connectie succesvol')
    }
  } catch (error) {
    console.error('Onverwachte Supabase error:', error)
  }
}

// Voer de test uit
testConnection() 