import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Standaard waarden voor development
const DEFAULT_SUPABASE_URL = 'https://ziqdiatxlteoqcedcvwx.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcWRpYXR4bHRlb3FjZWRjdnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4Nzk3MTAsImV4cCI6MjA0NzQ1NTcxMH0.2EoemT9FznEulS2W6lLZYGnq2pAEnNBZixDzpcUJ8iI'

// Gebruik environment variables of fallback naar defaults
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

// Singleton instantie met type
let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  }
  if (!supabaseInstance) {
    throw new Error('Supabase client could not be initialized')
  }
  return supabaseInstance
}

// Exporteer de client
export const supabase = getSupabaseClient()

// Test de connectie
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quotes')
      .select('count', { count: 'exact', head: true })
    
    return !error
  } catch (error) {
    console.error('Supabase connectie error:', error)
    return false
  }
} 