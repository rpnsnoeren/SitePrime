import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local or Vercel dashboard')
  } else {
    console.warn('MongoDB URI is niet geconfigureerd in development mode')
  }
}

async function dbConnect() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return
    }

    if (!MONGODB_URI) {
      return
    }

    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
    })
    console.log('Verbonden met MongoDB')
  } catch (error) {
    console.error('MongoDB connectie fout:', error)
    throw error
  }
}

export default dbConnect 