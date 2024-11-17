'use client'
import { useState } from 'react'

export default function QuoteForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    websiteType: '',
    features: [] as string[],
    budget: '',
    timeline: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    additionalInfo: '',
    status: 'nieuw'
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    const requiredFields = ['websiteType', 'budget', 'timeline', 'companyName', 'contactPerson', 'email', 'phone']
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (emptyFields.length > 0) {
      setError(`De volgende velden zijn verplicht: ${emptyFields.join(', ')}`)
      return
    }

    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(formData.email)) {
      setError('Voer een geldig emailadres in')
      return
    }
    
    try {
      console.log('Versturen quote data:', formData)
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          features: formData.features.length > 0 ? formData.features : [],
        }),
      })

      const data = await response.json()
      console.log('Response van server:', data)

      if (response.ok) {
        alert('Offerte aanvraag succesvol verstuurd!')
        onClose()
      } else {
        const errorMessage = data.details 
          ? Array.isArray(data.details) 
            ? data.details.join(', ') 
            : data.details
          : data.error || 'Er is iets misgegaan'
        setError(errorMessage)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Er is een fout opgetreden bij het versturen van de offerte aanvraag')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFeatureChange = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Type Website</label>
        <select
          name="websiteType"
          value={formData.websiteType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Selecteer type</option>
          <option value="corporate">Corporate Website</option>
          <option value="webshop">Webshop</option>
          <option value="portfolio">Portfolio</option>
          <option value="landing">Landing Page</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Features</label>
        <div className="mt-2 space-y-2">
          {['Responsive design', 'CMS integratie', 'Contact formulieren', 'Analytics'].map(feature => (
            <label key={feature} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => handleFeatureChange(feature)}
                className="rounded border-gray-300"
              />
              <span className="ml-2">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Budget</label>
        <select
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Selecteer budget</option>
          <option value="< €5000">&lt; €5000</option>
          <option value="€5000 - €10000">€5000 - €10000</option>
          <option value="€10000 - €20000">€10000 - €20000</option>
          <option value="> €20000">&gt; €20000</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Timeline</label>
        <select
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Selecteer timeline</option>
          <option value="< 1 maand">&lt; 1 maand</option>
          <option value="1-2 maanden">1-2 maanden</option>
          <option value="2-3 maanden">2-3 maanden</option>
          <option value="> 3 maanden">&gt; 3 maanden</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Bedrijfsnaam</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contactpersoon</label>
        <input
          type="text"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Telefoon</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Aanvullende informatie</label>
        <textarea
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuleren
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Verstuur Aanvraag
        </button>
      </div>
    </form>
  )
} 