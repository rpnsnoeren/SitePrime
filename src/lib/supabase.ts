import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missende Supabase credentials in client')
}

// Client voor frontend gebruik
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
)

// Admin client voor API routes
export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Test de connectie
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('quotes').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Supabase connectie error:', error.message)
      return false
    }
    
    console.log('Supabase connectie succesvol')
    return true
  } catch (error) {
    console.error('Onverwachte Supabase error:', error)
    return false
  }
} 