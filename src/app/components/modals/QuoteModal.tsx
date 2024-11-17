'use client'
import React, { useState } from 'react'
import type { FC } from 'react'

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormStep = 1 | 2 | 3 | 4

interface FormData {
  websiteType: string
  features: string[]
  budget: string
  timeline: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  additionalInfo: string
}

const QuoteModal: FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<FormStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState<FormData>({
    websiteType: '',
    features: [],
    budget: '',
    timeline: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    additionalInfo: ''
  })

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await fetch('/api/quotes', {
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
          websiteType: '',
          features: [],
          budget: '',
          timeline: '',
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          additionalInfo: ''
        })
        setStep(1)
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
          <div className="bg-white p-6 rounded-xl text-center">
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Offerte Aanvraag Verzonden!
            </h3>
            <p className="text-gray-600">
              We nemen zo spoedig mogelijk contact met u op.
            </p>
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
        {renderSubmitStatus()}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#1E3D59]">Offerte Aanvragen</h2>
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

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Stap indicators */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s}
                  className={`w-1/4 h-2 rounded-full mx-1 ${
                    s <= step ? 'bg-[#FFB400]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Stap 1: Website Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type Website
                  </label>
                  <select
                    name="websiteType"
                    value={formData.websiteType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
                  >
                    <option value="">Selecteer type website</option>
                    <option value="landing">AI Landing Page (€750)</option>
                    <option value="basic">Basis Website (vanaf €1.000)</option>
                    <option value="custom">Maatwerk Solution (op aanvraag)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gewenste Features
                  </label>
                  <div className="space-y-2">
                    {[
                      'Contact Formulier',
                      'CMS Systeem',
                      'Blog Functionaliteit',
                      'E-commerce',
                      'SEO Optimalisatie',
                      'Analytics Integratie',
                      'Custom Design',
                      'API Koppelingen'
                    ].map((feature) => (
                      <label key={feature} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          className="rounded text-[#FFB400] focus:ring-[#FFB400]"
                        />
                        <span>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stap 2: Budget & Timeline */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
                  >
                    <option value="">Selecteer budget range</option>
                    <option value="750-1000">€750 - €1.000</option>
                    <option value="1000-2500">€1.000 - €2.500</option>
                    <option value="2500-5000">€2.500 - €5.000</option>
                    <option value="5000+">€5.000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gewenste Timeline
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
                  >
                    <option value="">Selecteer timeline</option>
                    <option value="2-weeks">Binnen 2 weken</option>
                    <option value="month">Binnen 1 maand</option>
                    <option value="quarter">Binnen 3 maanden</option>
                    <option value="flexible">Flexibel</option>
                  </select>
                </div>
              </div>
            )}

            {/* Stap 3: Contact Informatie */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrijfsnaam
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contactpersoon
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
              </div>
            )}

            {/* Stap 4: Extra Informatie */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aanvullende Informatie
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
                    placeholder="Beschrijf hier eventuele specifieke wensen of vereisten..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as FormStep)}
                className="px-6 py-2 text-[#1E3D59] border border-[#1E3D59] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Vorige
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as FormStep)}
                className="px-6 py-2 text-white bg-[#1E3D59] rounded-lg hover:bg-[#2a5580] transition-colors ml-auto"
              >
                Volgende
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 text-white bg-[#FF6B35] rounded-lg transition-colors ml-auto
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ff8555]'}`}
              >
                {isSubmitting ? 'Verzenden...' : 'Verstuur Aanvraag'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuoteModal 