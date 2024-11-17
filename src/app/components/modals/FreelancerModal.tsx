'use client'
import React, { useState } from 'react'
import type { FC } from 'react'

interface FreelancerModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  phone: string
  portfolio: string
  skills: string[]
  experience: string
  availability: string
  rate: string
}

const FreelancerModal: FC<FreelancerModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    portfolio: '',
    skills: [],
    experience: '',
    availability: '',
    rate: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const skillOptions = [
    'Frontend',
    'Backend',
    'UI/UX',
    'Mobile',
    'DevOps'
  ]

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setError(null)

    // Valideer verplichte velden
    const requiredFields = ['name', 'email', 'experience', 'availability', 'rate']
    const emptyFields = requiredFields.filter(field => !formData[field as keyof FormData])
    
    if (emptyFields.length > 0) {
      setError(`De volgende velden zijn verplicht: ${emptyFields.join(', ')}`)
      setIsSubmitting(false)
      return
    }

    if (formData.skills.length === 0) {
      setError('Selecteer minimaal één skill')
      setIsSubmitting(false)
      return
    }

    try {
      // Bereid de data voor volgens het model schema
      const submitData = {
        ...formData,
        status: 'beschikbaar'
      }

      console.log('Versturen freelancer data:', submitData)
      
      const response = await fetch('/api/freelancers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()
      console.log('Response van server:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Verzenden mislukt')
      }

      setSubmitStatus('success')
      setTimeout(() => {
        onClose()
        setFormData({
          name: '',
          email: '',
          phone: '',
          portfolio: '',
          skills: [],
          experience: '',
          availability: '',
          rate: ''
        })
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
      setSubmitStatus('error')
      setError(error instanceof Error ? error.message : 'Er is iets misgegaan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSubmitStatus = () => {
    if (submitStatus === 'success') {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl text-center max-w-md">
            <svg
              className="w-16 h-16 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="text-2xl font-bold text-[#1E3D59] mb-4">
              Aanmelding Ontvangen!
            </h3>
            <p className="text-gray-600 mb-6">
              Bedankt voor je interesse in SitePrime. We nemen je aanmelding zorgvuldig in behandeling.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#1E3D59] text-white rounded-lg hover:bg-[#2a5580] transition-colors"
            >
              Sluiten
            </button>
          </div>
        </div>
      )
    }

    if (submitStatus === 'error') {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Er is iets misgegaan. Probeer het opnieuw.'}
        </div>
      )
    }

    return null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1E3D59]">Word SitePrime Professional</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volledige Naam
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefoonnummer
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio URL
            </label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            <div className="grid grid-cols-2 gap-2">
              {skillOptions.map((skill) => (
                <label key={skill} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="rounded text-[#FFB400] focus:ring-[#FFB400]"
                  />
                  <span className="text-sm">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ervaring
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              required
            >
              <option value="">Selecteer jaren ervaring</option>
              <option value="0-2 jaar">0-2 jaar</option>
              <option value="2-5 jaar">2-5 jaar</option>
              <option value="5-10 jaar">5-10 jaar</option>
              <option value="10+ jaar">10+ jaar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschikbaarheid
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              required
            >
              <option value="">Selecteer beschikbaarheid</option>
              <option value="0-8 uur">0-8 uur</option>
              <option value="8-16 uur">8-16 uur</option>
              <option value="16-24 uur">16-24 uur</option>
              <option value="24-32 uur">24-32 uur</option>
              <option value="32-40 uur">32-40 uur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uurtarief
            </label>
            <select
              name="rate"
              value={formData.rate}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              required
            >
              <option value="">Selecteer uurtarief</option>
              <option value="€30-€50 per uur">€30-€50 per uur</option>
              <option value="€50-€75 per uur">€50-€75 per uur</option>
              <option value="€75-€100 per uur">€75-€100 per uur</option>
              <option value="> €100 per uur">&gt; €100 per uur</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 text-white bg-[#FF6B35] rounded-lg transition-colors
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ff8555]'}`}
          >
            {isSubmitting ? 'Verzenden...' : 'Aanmelding Versturen'}
          </button>
        </form>
      </div>
      {renderSubmitStatus()}
    </div>
  )
}

export default FreelancerModal 