import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ziqdiatxlteoqcedcvwx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcWRpYXR4bHRlb3FjZWRjdnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4Nzk3MTAsImV4cCI6MjA0NzQ1NTcxMH0.2EoemT9FznEulS2W6lLZYGnq2pAEnNBZixDzpcUJ8iI'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client voor frontend gebruik
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Admin client voor API routes (alleen server-side)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Test de connectie
export const testSupabaseConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missende Supabase credentials')
    return false
  }

  try {
    const { error } = await supabase
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