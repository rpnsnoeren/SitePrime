'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import { logActivity, formatFreelancerActivity } from '@/lib/activities'

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
  portfolio: string
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
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (freelancer && mode === 'edit') {
      setEditData(freelancer)
      setIsEditing(true)
    } else {
      setEditData(freelancer)
      setIsEditing(false)
    }
  }, [freelancer, mode])

  if (!isOpen || !freelancer) return null

  const handleSave = async () => {
    if (!editData) return
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('freelancers')
        .update({
          name: editData.name,
          email: editData.email,
          expertise: editData.expertise,
          experience: editData.experience,
          rate: editData.rate,
          status: editData.status,
          availability: editData.availability,
          portfolio: editData.portfolio
        })
        .eq('id', freelancer.id)
        .select()
        .single()

      if (error) throw error

      await logActivity({
        description: formatFreelancerActivity(`Freelancer ${data.name} gegevens bijgewerkt`, freelancer),
        type: 'freelancer',
        related_id: data.id,
        related_type: 'freelancers'
      })

      onClose()
    } catch (err) {
      console.error('Error updating freelancer:', err)
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het opslaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {isEditing ? 'Freelancer Bewerken' : 'Freelancer Details'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.name || ''}
                  onChange={(e) =>
                    setEditData(prev => prev ? { ...prev, name: e.target.value } : null)
                  }
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="text-gray-900">{freelancer.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData?.email || ''}
                  onChange={(e) =>
                    setEditData(prev => prev ? { ...prev, email: e.target.value } : null)
                  }
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="text-gray-900">{freelancer.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expertise
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.expertise || ''}
                  onChange={(e) =>
                    setEditData(prev => prev ? { ...prev, expertise: e.target.value } : null)
                  }
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="text-gray-900">{freelancer.expertise}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ervaring
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.experience || ''}
                  onChange={(e) =>
                    setEditData(prev => prev ? { ...prev, experience: e.target.value } : null)
                  }
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="text-gray-900">{freelancer.experience}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Uurtarief
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.rate || ''}
                  onChange={(e) =>
                    setEditData(prev => prev ? { ...prev, rate: e.target.value } : null)
                  }
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="text-gray-900">{freelancer.rate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschikbaarheid
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.availability || ''}
                  onChange={(e) =>
                    setEditData(prev => prev ? { ...prev, availability: e.target.value } : null)
                  }
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="text-gray-900">{freelancer.availability}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.portfolio || ''}
                  onChange={(e) =>
                    setEditData(prev => prev ? { ...prev, portfolio: e.target.value } : null)
                  }
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="text-gray-900">
                  {freelancer.portfolio ? (
                    <a 
                      href={freelancer.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {freelancer.portfolio}
                    </a>
                  ) : (
                    'Niet opgegeven'
                  )}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              {isEditing ? (
                <select
                  value={editData?.status || ''}
                  onChange={(e) =>
                    setEditData(prev => prev ? { ...prev, status: e.target.value } : null)
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="pending">In behandeling</option>
                  <option value="approved">Goedgekeurd</option>
                  <option value="rejected">Afgewezen</option>
                </select>
              ) : (
                <p className="text-gray-900">{freelancer.status}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aangemeld op
              </label>
              <p className="text-gray-900">
                {format(new Date(freelancer.created_at), 'dd MMMM yyyy', { locale: nl })}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
                  disabled={loading}
                >
                  Annuleren
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Opslaan...' : 'Opslaan'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  Bewerken
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Sluiten
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}