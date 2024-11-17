'use client'
import { useState } from 'react'

export default function FreelancerForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: [] as string[],
    experience: '',
    availability: '',
    rate: '',
    portfolio: '',
    status: 'beschikbaar'
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Valideer verplichte velden
    const requiredFields = ['name', 'email', 'experience', 'availability', 'rate']
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (emptyFields.length > 0) {
      setError(`De volgende velden zijn verplicht: ${emptyFields.join(', ')}`)
      return
    }

    if (formData.skills.length === 0) {
      setError('Selecteer minimaal één skill')
      return
    }

    // Valideer email formaat
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(formData.email)) {
      setError('Voer een geldig emailadres in')
      return
    }

    // Valideer portfolio URL alleen als deze is ingevuld
    if (formData.portfolio && !formData.portfolio.startsWith('http')) {
      setError('Portfolio URL moet beginnen met http:// of https://')
      return
    }

    // Bereid de data voor volgens het model schema
    const submitData = {
      name: formData.name,
      email: formData.email,
      skills: formData.skills,
      experience: formData.experience,
      // Zorg dat availability exact overeenkomt met de enum waarden in het model
      availability: formData.availability, // Dit is al correct door de select opties
      // Voeg 'per uur' toe aan rate als het er nog niet in zit
      rate: formData.rate.includes('per uur') ? formData.rate : `${formData.rate} per uur`,
      // Voeg portfolio alleen toe als het niet leeg is
      ...(formData.portfolio && { portfolio: formData.portfolio }),
      status: 'beschikbaar'
    }

    try {
      console.log('Versturen freelancer data:', submitData)
      const response = await fetch('/api/freelancers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      const data = await response.json()
      console.log('Response van server:', data)

      if (response.ok) {
        alert('Freelancer registratie succesvol!')
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
      setError('Er is een fout opgetreden bij de registratie')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSkillChange = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
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
        <label className="block text-sm font-medium text-gray-700">Naam</label>
        <input
          type="text"
          name="name"
          value={formData.name}
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
        <label className="block text-sm font-medium text-gray-700">Skills</label>
        <div className="mt-2 space-y-2">
          {['Frontend', 'Backend', 'UI/UX', 'Mobile', 'DevOps'].map(skill => (
            <label key={skill} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={formData.skills.includes(skill)}
                onChange={() => handleSkillChange(skill)}
                className="rounded border-gray-300"
              />
              <span className="ml-2">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ervaring</label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Selecteer ervaring</option>
          <option value="0-2 jaar">0-2 jaar</option>
          <option value="2-5 jaar">2-5 jaar</option>
          <option value="5-10 jaar">5-10 jaar</option>
          <option value="10+ jaar">10+ jaar</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Beschikbaarheid</label>
        <select
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Selecteer beschikbaarheid</option>
          <option value="32-40 uur">32-40 uur</option>
          <option value="24-32 uur">24-32 uur</option>
          <option value="16-24 uur">16-24 uur</option>
          <option value="8-16 uur">8-16 uur</option>
          <option value="0-8 uur">0-8 uur</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Uurtarief</label>
        <select
          name="rate"
          value={formData.rate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Selecteer uurtarief</option>
          <option value="€30-€50 per uur">€30-€50 per uur</option>
          <option value="€50-€75 per uur">€50-€75 per uur</option>
          <option value="€75-€100 per uur">€75-€100 per uur</option>
          <option value="> €100 per uur">&gt; €100 per uur</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Portfolio URL (optioneel)</label>
        <input
          type="url"
          name="portfolio"
          value={formData.portfolio}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="https://..."
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
          Registreren
        </button>
      </div>
    </form>
  )
} 