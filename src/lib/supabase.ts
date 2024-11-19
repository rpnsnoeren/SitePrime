import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Standaard waarden voor development
const DEFAULT_SUPABASE_URL = 'https://ziqdiatxlteoqcedcvwx.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcWRpYXR4bHRlb3FjZWRjdnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4Nzk3MTAsImV4cCI6MjA0NzQ1NTcxMH0.2EoemT9FznEulS2W6lLZYGnq2pAEnNBZixDzpcUJ8iI'

// Gebruik environment variables of fallback naar defaults
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Singleton instanties met correcte types
let supabaseInstance: SupabaseClient | null = null
let supabaseAdminInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      db: {
        schema: 'public'
      }
    })
  }
  return supabaseInstance
}

function getSupabaseAdminClient(): SupabaseClient {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    })
  }
  return supabaseAdminInstance
}

// Exporteer de clients
export const supabase = getSupabaseClient()
export const supabaseAdmin = getSupabaseAdminClient()

// Test de connectie
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('quotes')
      .select('count', { count: 'exact', head: true })
    
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

// Helper functie om te controleren of de client correct is geïnitialiseerd
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey)
} 