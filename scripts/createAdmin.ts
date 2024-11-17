#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' })

const bcrypt = require('bcryptjs')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missende Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdmin() {
  try {
    // Verwijder bestaande admin gebruiker
    console.log('Verwijderen oude admin...')
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('username', 'admin')

    if (deleteError) {
      console.error('Error bij verwijderen:', deleteError)
    }

    // Maak admin gebruiker aan
    console.log('Aanmaken nieuwe admin gebruiker...')
    const password = 'admin123' // Verander dit in productie!
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert([{
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      }])
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    console.log('Admin gebruiker succesvol aangemaakt!')
    console.log('Username:', 'admin')
    console.log('Password:', password)
    console.log('Role:', 'admin')
    console.log('ID:', user.id)

  } catch (error) {
    console.error('Fout bij aanmaken admin:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

createAdmin() 