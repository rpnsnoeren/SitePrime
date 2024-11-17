import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'
import dbConnect from '../lib/db'
import bcrypt from 'bcryptjs'
import User from '../lib/models/User'

async function createAdmin() {
  try {
    console.log('Verbinding maken met database...')
    await dbConnect()

    // Verwijder bestaande admin (optioneel)
    console.log('Verwijderen oude admin...')
    await User.deleteOne({ username: 'admin' })

    // Maak admin gebruiker aan
    console.log('Aanmaken nieuwe admin gebruiker...')
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    })

    const savedUser = await adminUser.save()
    console.log('Admin gebruiker succesvol aangemaakt!')
    console.log('Username:', savedUser.username)
    console.log('Password:', password)
    console.log('Role:', savedUser.role)
    console.log('ID:', savedUser._id)

    // Test wachtwoord validatie
    const testValidation = await bcrypt.compare(password, savedUser.password)
    console.log('Wachtwoord validatie test:', testValidation)

  } catch (error) {
    console.error('Fout bij aanmaken admin:', error)
    process.exit(1)
  } finally {
    console.log('Sluiten database verbinding...')
    await mongoose.disconnect()
    process.exit(0)
  }
}

createAdmin() 