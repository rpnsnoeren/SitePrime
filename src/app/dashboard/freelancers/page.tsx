'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import FreelancerDetailModal from '../components/FreelancerDetailModal'
import AddFreelancerModal from '../components/AddFreelancerModal'

interface Freelancer {
  id: string
  name: string
  email: string
  expertise: string
  experience: string
  rate: string
  status: string
  created_at: string
  availability: string
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const fetchFreelancers = async () => {
    try {
      const response = await fetch('/api/freelancers')
      if (!response.ok) {
        throw new Error('Fout bij het ophalen van freelancers')
      }
      const data = await response.json()
      console.log('Opgehaalde data:', data)
      setFreelancers(data)
    } catch (err) {
      console.error('Fout:', err)
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFreelancers()
  }, [])

  const handleAddSuccess = () => {
    fetchFreelancers()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
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
          onClick={() => setIsAddModalOpen(true)}
        >
          Freelancer Toevoegen
        </button>
      </div>

      {freelancers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Geen freelancers gevonden</p>
        </div>
      ) : (
        <div className="space-y-4">
          {freelancers.map((freelancer) => (
            <div
              key={freelancer.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedFreelancer(freelancer)
                setIsDetailModalOpen(true)
              }}
            >
              <div className="flex justify-between items-start">
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

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Expertise:</span>{' '}
                    {freelancer.expertise}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Ervaring:</span>{' '}
                    {freelancer.experience}
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Uurtarief:</span>{' '}
                    {freelancer.rate}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Beschikbaarheid:</span>{' '}
                    {freelancer.availability}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Toegevoegd op:{' '}
                {format(new Date(freelancer.created_at), 'dd MMMM yyyy', { locale: nl })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFreelancer && (
        <FreelancerDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedFreelancer(null)
          }}
          freelancer={selectedFreelancer}
        />
      )}

      <AddFreelancerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}