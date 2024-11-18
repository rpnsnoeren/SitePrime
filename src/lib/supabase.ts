import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missende Supabase credentials. Zorg ervoor dat NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY zijn ingesteld in je .env.local file.'
  )
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

// Test de connectie en exporteer de functie zodat deze gebruikt kan worden
export const testSupabaseConnection = async () => {
  try {
    const { error: testError } = await supabase
      .from('quotes')
      .select('count', { count: 'exact', head: true })

    if (testError) {
      console.error('Supabase connectie error:', testError.message)
      return false
    } 
    console.log('Supabase connectie succesvol')
    return true
  } catch (error) {
    console.error('Onverwachte Supabase error:', error)
    return false
  }
} 