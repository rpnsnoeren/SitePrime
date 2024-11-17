'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      if (username === 'admin' && password === 'Eliasnoeren.2410') {
        // Sla login status op in een cookie
        Cookies.set('isLoggedIn', 'true', { 
          expires: 1, // Verloopt na 1 dag
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        })
        
        // Gebruik window.location voor een harde redirect
        window.location.href = '/dashboard'
      } else {
        setError('Ongeldige inloggegevens')
      }
    } catch (err) {
      setError('Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-[#1E3D59] mb-6">Dashboard Login</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gebruikersnaam
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wachtwoord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 text-white bg-[#1E3D59] rounded-lg transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2a5580]'}`}
          >
            {isLoading ? 'Inloggen...' : 'Inloggen'}
          </button>
        </form>
      </div>
    </div>
  )
} 