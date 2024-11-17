import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missende Supabase credentials. Zorg ervoor dat NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY zijn ingesteld in je .env.local file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

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