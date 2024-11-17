import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('MongoDB URI is niet geconfigureerd')
}

async function dbConnect() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return
    }

    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
    })
    console.log('Verbonden met MongoDB op:', MONGODB_URI)
  } catch (error) {
    console.error('MongoDB connectie fout:', error)
    throw error
  }
}

export default dbConnect 