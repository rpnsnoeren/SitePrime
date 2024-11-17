'use client'
import { useState } from 'react'

interface FormData {
  name: string
  email: string
  skills: string[]
  experience: string
  availability: string
  rate: string
  portfolio: string
}

export default function FreelancerModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    skills: [],
    experience: '',
    availability: '',
    rate: '',
    portfolio: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    try {
      console.log('Versturen data:', formData) // Debug logging

      const response = await fetch('/api/freelancers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Response van server:', data) // Debug logging

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Er is iets misgegaan')
      }

      // Toon success message
      alert('Registratie succesvol!')
      onClose()
      setFormData({
        name: '',
        email: '',
        skills: [],
        experience: '',
        availability: '',
        rate: '',
        portfolio: ''
      })
    } catch (error) {
      console.error('Error details:', error) // Debug logging
      setError(error instanceof Error ? error.message : 'Er is een onverwachte fout opgetreden')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Freelancer Registratie</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Naam */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Naam
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <select
              multiple
              value={formData.skills}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value)
                setFormData({ ...formData, skills: values })
              }}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="Frontend Development">Frontend Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Mobile Development">Mobile Development</option>
            </select>
          </div>

          {/* Ervaring */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ervaring
            </label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Selecteer ervaring</option>
              <option value="0-2 jaar">0-2 jaar</option>
              <option value="2-5 jaar">2-5 jaar</option>
              <option value="5+ jaar">5+ jaar</option>
            </select>
          </div>

          {/* Beschikbaarheid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschikbaarheid
            </label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Selecteer beschikbaarheid</option>
              <option value="Fulltime">Fulltime</option>
              <option value="Parttime">Parttime</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          {/* Uurtarief */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uurtarief
            </label>
            <select
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Selecteer uurtarief</option>
              <option value="€30-€50 per uur">€30-€50 per uur</option>
              <option value="€50-€75 per uur">€50-€75 per uur</option>
              <option value="€75-€100 per uur">€75-€100 per uur</option>
              <option value="> €100 per uur">{'>'} €100 per uur</option>
            </select>
          </div>

          {/* Portfolio URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio URL (optioneel)
            </label>
            <input
              type="url"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-2 px-4 rounded-md transition-colors`}
          >
            {isSubmitting ? 'Bezig met registreren...' : 'Registreren'}
          </button>
        </form>
      </div>
    </div>
  )
} 