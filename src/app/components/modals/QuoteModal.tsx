'use client'
import { useState } from 'react'

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

export default function QuoteModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
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
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    try {
      console.log('Versturen quote data:', formData)

      // Valideer verplichte velden
      const requiredFields = ['websiteType', 'budget', 'timeline', 'companyName', 'contactPerson', 'email', 'phone']
      for (const field of requiredFields) {
        if (!formData[field as keyof FormData]) {
          throw new Error(`${field} is verplicht`)
        }
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Response van server:', data)

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Er is iets misgegaan')
      }

      // Toon success message
      alert('Offerte aanvraag succesvol verstuurd!')
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
    } catch (error) {
      console.error('Error details:', error)
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
          <h2 className="text-xl font-bold">Offerte Aanvragen</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Website Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type Website
            </label>
            <select
              value={formData.websiteType}
              onChange={(e) => setFormData({ ...formData, websiteType: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Selecteer type website</option>
              <option value="landing">AI Landing Page (€750)</option>
              <option value="basic">Basis Website (vanaf €1.000)</option>
              <option value="custom">Maatwerk Solution (op aanvraag)</option>
            </select>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    onChange={(e) => {
                      const newFeatures = e.target.checked
                        ? [...formData.features, feature]
                        : formData.features.filter(f => f !== feature)
                      setFormData({ ...formData, features: newFeatures })
                    }}
                    className="rounded text-blue-600"
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget
            </label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Selecteer budget</option>
              <option value="€500-€1000">€500-€1000</option>
              <option value="€1000-€2500">€1000-€2500</option>
              <option value="€2500-€5000">€2500-€5000</option>
              <option value="> €5000">{"> €5000"}</option>
            </select>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gewenste Timeline
            </label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Selecteer timeline</option>
              <option value="1-2 weken">1-2 weken</option>
              <option value="2-4 weken">2-4 weken</option>
              <option value="1-2 maanden">1-2 maanden</option>
              <option value="2+ maanden">2+ maanden</option>
            </select>
          </div>

          {/* Bedrijfsnaam */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrijfsnaam
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Contactpersoon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contactpersoon
            </label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
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

          {/* Telefoon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefoon
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Aanvullende Informatie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aanvullende Informatie (optioneel)
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={4}
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
            {isSubmitting ? 'Bezig met versturen...' : 'Verstuur Aanvraag'}
          </button>
        </form>
      </div>
    </div>
  )
} 