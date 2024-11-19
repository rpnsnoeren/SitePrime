'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

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

interface FreelancerDetailModalProps {
  freelancer: Freelancer | null
  isOpen: boolean
  onClose: () => void
  mode: 'view' | 'edit'
}

export default function FreelancerDetailModal({
  freelancer,
  isOpen,
  onClose,
  mode
}: FreelancerDetailModalProps) {
  const [editData, setEditData] = useState<Freelancer | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (freelancer && mode === 'edit') {
      setEditData(freelancer)
      setIsEditing(true)
    }
  }, [freelancer, mode])

  if (!isOpen || !freelancer) return null

  const handleSave = async () => {
    if (!editData) return

    try {
      const response = await fetch(`/api/freelancers/${freelancer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (!response.ok) throw new Error('Fout bij het opslaan')

      // Sluit modal en refresh data
      onClose()
      window.location.reload()
    } catch (error) {
      console.error('Error saving freelancer:', error)
      alert('Er is een fout opgetreden bij het opslaan')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8">
        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {isEditing ? 'Freelancer Bewerken' : 'Freelancer Details'}
            </h2>
            <p className="text-sm text-gray-500">
              Lid sinds {format(new Date(freelancer.created_at), 'd MMMM yyyy', { locale: nl })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Persoonlijke Informatie */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Persoonlijke Informatie</h3>
              
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Naam</label>
                    <input
                      type="text"
                      value={editData?.name}
                      onChange={(e) => setEditData(prev => ({ ...prev!, name: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={editData?.email}
                      onChange={(e) => setEditData(prev => ({ ...prev!, email: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Naam</label>
                    <p className="mt-1">{freelancer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="mt-1">{freelancer.email}</p>
                  </div>
                </>
              )}
            </div>

            {/* Professionele Informatie */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professionele Informatie</h3>
              
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expertise</label>
                    <input
                      type="text"
                      value={editData?.expertise}
                      onChange={(e) => setEditData(prev => ({ ...prev!, expertise: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ervaring</label>
                    <input
                      type="text"
                      value={editData?.experience}
                      onChange={(e) => setEditData(prev => ({ ...prev!, experience: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Uurtarief</label>
                    <input
                      type="text"
                      value={editData?.rate}
                      onChange={(e) => setEditData(prev => ({ ...prev!, rate: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Expertise</label>
                    <p className="mt-1">{freelancer.expertise}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Ervaring</label>
                    <p className="mt-1">{freelancer.experience}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Uurtarief</label>
                    <p className="mt-1">€{freelancer.rate}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Beschikbaarheid Sectie */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Beschikbaarheid</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editData?.status}
                    onChange={(e) => setEditData(prev => ({ ...prev!, status: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="beschikbaar">Beschikbaar</option>
                    <option value="bezet">Bezet</option>
                    <option value="inactief">Inactief</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Beschikbaarheid</label>
                  <input
                    type="text"
                    value={editData?.availability}
                    onChange={(e) => setEditData(prev => ({ ...prev!, availability: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    freelancer.status === 'beschikbaar' ? 'bg-green-100 text-green-800' :
                    freelancer.status === 'bezet' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {freelancer.status}
                  </span>
                </div>
                <p className="text-sm">{freelancer.availability}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuleren
          </button>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Opslaan
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Bewerken
            </button>
          )}
        </div>
      </div>
    </div>
  )
}