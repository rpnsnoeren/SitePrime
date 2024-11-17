'use client'
import React, { useState } from 'react'
import type { FC } from 'react'

interface FreelancerModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  fullName: string
  email: string
  phone: string
  portfolioUrl: string
  expertise: string[]
  yearsExperience: string
  weeklyAvailability: string
  rateRange: string
}

const FreelancerModal: FC<FreelancerModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    portfolioUrl: '',
    expertise: [],
    yearsExperience: '',
    weeklyAvailability: '',
    rateRange: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const expertiseOptions = [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'UI/UX Design',
    'WordPress Development',
    'E-commerce',
    'API Development',
    'Mobile Development'
  ]

  const handleExpertiseToggle = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
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

    try {
      const response = await fetch('/api/freelancers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Verzenden mislukt')

      setSubmitStatus('success')
      setTimeout(() => {
        onClose()
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          portfolioUrl: '',
          expertise: [],
          yearsExperience: '',
          weeklyAvailability: '',
          rateRange: ''
        })
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render success/error message
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
            <div className="text-left space-y-4 mb-6">
              <h4 className="font-semibold text-[#1E3D59]">Vervolgstappen:</h4>
              <ol className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Portfolio review door ons team</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Korte video call om kennis te maken</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Technische assessment passend bij jouw expertise</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Referentiecheck van eerdere projecten</span>
                </li>
              </ol>
            </div>
            <p className="text-sm text-gray-500">
              Je ontvangt binnen 2 werkdagen een email met meer informatie over de vervolgstappen.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-[#1E3D59] text-white rounded-lg hover:bg-[#2a5580] transition-colors"
            >
              Sluiten
            </button>
          </div>
        </div>
      )
    }

    if (submitStatus === 'error') {
      return (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          Er is iets misgegaan bij het verzenden. Probeer het opnieuw.
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volledige Naam
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
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
              Portfolio/Website URL
            </label>
            <input
              type="url"
              name="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expertise
            </label>
            <div className="grid grid-cols-2 gap-2">
              {expertiseOptions.map((expertise) => (
                <label key={expertise} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.expertise.includes(expertise)}
                    onChange={() => handleExpertiseToggle(expertise)}
                    className="rounded text-[#FFB400] focus:ring-[#FFB400]"
                  />
                  <span className="text-sm">{expertise}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jaren Ervaring
            </label>
            <select
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              required
            >
              <option value="">Selecteer jaren ervaring</option>
              <option value="0-2">0-2 jaar</option>
              <option value="2-5">2-5 jaar</option>
              <option value="5-10">5-10 jaar</option>
              <option value="10+">10+ jaar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschikbaarheid per week
            </label>
            <select
              name="weeklyAvailability"
              value={formData.weeklyAvailability}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              required
            >
              <option value="">Selecteer beschikbaarheid</option>
              <option value="0-8">0-8 uur</option>
              <option value="8-16">8-16 uur</option>
              <option value="16-24">16-24 uur</option>
              <option value="24-32">24-32 uur</option>
              <option value="32-40">32-40 uur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uurtarief Range
            </label>
            <select
              name="rateRange"
              value={formData.rateRange}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              required
            >
              <option value="">Selecteer uurtarief range</option>
              <option value="30-50">€30-€50 per uur</option>
              <option value="50-75">€50-€75 per uur</option>
              <option value="75-100">€75-€100 per uur</option>
              <option value="100+">€100+ per uur</option>
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