'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FormData {
  name: string
  email: string
  expertise: string
  experience: string
  availability: string
  rate: string
  status: string
  portfolio: string
}

interface Step {
  title: string
  description: string
}

const steps: Step[] = [
  {
    title: 'Persoonlijke Informatie',
    description: 'Vul je basis gegevens in'
  },
  {
    title: 'Expertise & Ervaring',
    description: 'Vertel ons over je expertise'
  },
  {
    title: 'Beschikbaarheid & Tarief',
    description: 'Deel je beschikbaarheid en tarieven'
  }
]

export default function FreelancerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    expertise: '',
    experience: '',
    availability: '',
    rate: '',
    status: 'beschikbaar',
    portfolio: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      expertise: '',
      experience: '',
      availability: '',
      rate: '',
      status: 'beschikbaar',
      portfolio: ''
    })
    setCurrentStep(0)
    setShowSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      return
    }

    setError(null)
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/freelancers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Er is iets misgegaan')
      }

      setShowSuccess(true)
    } catch (error) {
      console.error('Error details:', error)
      setError(error instanceof Error ? error.message : 'Er is een onverwachte fout opgetreden')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSuccessScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-8"
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Registratie Succesvol!
      </h3>
      <p className="text-gray-600 mb-8">
        Je gegevens zijn succesvol opgeslagen. We nemen zo snel mogelijk contact met je op.
      </p>
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Jouw gegevens:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <p className="text-gray-600">Naam:</p>
              <p className="font-medium">{formData.name}</p>
            </div>
            <div className="text-left">
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div className="text-left">
              <p className="text-gray-600">Expertise:</p>
              <p className="font-medium">{formData.expertise}</p>
            </div>
            <div className="text-left">
              <p className="text-gray-600">Ervaring:</p>
              <p className="font-medium">{formData.experience}</p>
            </div>
            <div className="text-left">
              <p className="text-gray-600">Beschikbaarheid:</p>
              <p className="font-medium">{formData.availability}</p>
            </div>
            <div className="text-left">
              <p className="text-gray-600">Uurtarief:</p>
              <p className="font-medium">{formData.rate}</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-3 justify-center">
          <button
            onClick={resetForm}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Nieuwe Registratie
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Sluiten
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio URL (optioneel)
              </label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://"
              />
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expertise
              </label>
              <select
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecteer expertise</option>
                <option value="Frontend Development">Frontend Development</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Full Stack Development">Full Stack Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="DevOps">DevOps</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ervaring
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecteer ervaring</option>
                <option value="0-2 jaar">0-2 jaar</option>
                <option value="2-5 jaar">2-5 jaar</option>
                <option value="5-10 jaar">5-10 jaar</option>
                <option value="10+ jaar">10+ jaar</option>
              </select>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschikbaarheid
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecteer beschikbaarheid</option>
                <option value="Fulltime">Fulltime (40 uur)</option>
                <option value="Parttime 32">Parttime (32 uur)</option>
                <option value="Parttime 24">Parttime (24 uur)</option>
                <option value="Parttime 16">Parttime (16 uur)</option>
                <option value="Op projectbasis">Op projectbasis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Uurtarief
              </label>
              <select
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecteer uurtarief</option>
                <option value="€30-€50">€30-€50 per uur</option>
                <option value="€50-€75">€50-€75 per uur</option>
                <option value="€75-€100">€75-€100 per uur</option>
                <option value="€100+">€100+ per uur</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="beschikbaar">Direct Beschikbaar</option>
                <option value="bezet">Momenteel Bezet</option>
                <option value="niet_beschikbaar">Niet Beschikbaar</option>
              </select>
            </div>
          </motion.div>
        )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {!showSuccess ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h2>
                <p className="text-sm text-gray-500 mt-1">{steps[currentStep].description}</p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`flex items-center ${
                      index === steps.length - 1 ? '' : 'flex-1'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Vorige
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  } ${currentStep === 0 ? 'ml-auto' : ''}`}
                >
                  {currentStep === steps.length - 1
                    ? isSubmitting
                      ? 'Bezig met versturen...'
                      : 'Versturen'
                    : 'Volgende'}
                </button>
              </div>
            </form>
          </>
        ) : (
          renderSuccessScreen()
        )}
      </motion.div>
    </div>
  )
}