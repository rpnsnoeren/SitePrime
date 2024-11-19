'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

interface Freelancer {
  id: string
  name: string
  email: string
  expertise: string[]
  experience: string
  rate: number
  status: string
  created_at: string
  availability?: string
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await fetch('/api/freelancers')
        if (!response.ok) {
          throw new Error('Fout bij het ophalen van freelancers')
        }
        const data = await response.json()
        setFreelancers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
      } finally {
        setLoading(false)
      }
    }

    fetchFreelancers()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Freelancers Overzicht</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {/* Open toevoegen modal */}}
        >
          Freelancer Toevoegen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {freelancers.map((freelancer) => (
          <div key={freelancer.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">{freelancer.name}</h3>
                <p className="text-sm text-gray-500">{freelancer.email}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                freelancer.status === 'beschikbaar' ? 'bg-green-100 text-green-800' :
                freelancer.status === 'bezet' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {freelancer.status}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Expertise:</span>{' '}
                {freelancer.expertise.join(', ')}
              </p>
              <p className="text-sm">
                <span className="font-medium">Ervaring:</span>{' '}
                {freelancer.experience}
              </p>
              <p className="text-sm">
                <span className="font-medium">Tarief:</span>{' '}
                €{freelancer.rate}/uur
              </p>
              {freelancer.availability && (
                <p className="text-sm">
                  <span className="font-medium">Beschikbaarheid:</span>{' '}
                  {freelancer.availability}
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Lid sinds: {format(new Date(freelancer.created_at), 'dd MMM yyyy', { locale: nl })}
              </span>
              <button 
                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                onClick={() => {/* Open bewerk modal */}}
              >
                Bewerken
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 