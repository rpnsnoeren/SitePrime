import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missende Supabase credentials. Zorg ervoor dat NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY zijn ingesteld in je .env.local file.'
  )
}

// Client voor frontend gebruik
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client voor API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || '')

// Test de connectie
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('quotes').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Supabase connectie error:', error.message)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Onverwachte Supabase error:', error)
    return false
  }
} 