'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { logActivity } from '@/lib/activities'

interface FormData {
  // Stap 1: Basisinformatie
  companyName: string
  industry: string
  desiredDomain: string
  customIndustry?: string

  // Stap 2: Doel
  primaryGoal: string
  secondaryGoals: string[]

  // Stap 3: Doelgroep
  targetAudience: {
    ageRange: string
    gender: string
    interests: string[]
  }
  geographicFocus: string

  // Stap 4: Functionaliteiten
  features: string[]

  // Stap 5: Design
  colorScheme: string
  style: string
  websiteExamples: string

  // Stap 6: Inhoud
  numberOfPages: string
  hasOwnContent: boolean
  needsContentSupport: boolean

  // Stap 7: Technisch
  seoRequirements: string[]

  // Stap 8: Budget & Timeline
  budget: string
  deadline: string

  // Stap 9: Onderhoud
  maintenanceContract: boolean
  needsTraining: boolean

  // Stap 10: Contact
  contactPerson: string
  email: string
  phone: string
}

const INITIAL_FORM_DATA: FormData = {
  companyName: '',
  industry: '',
  desiredDomain: '',
  primaryGoal: '',
  secondaryGoals: [],
  targetAudience: {
    ageRange: '',
    gender: '',
    interests: []
  },
  geographicFocus: '',
  features: [],
  colorScheme: '',
  style: '',
  websiteExamples: '',
  numberOfPages: '',
  hasOwnContent: false,
  needsContentSupport: false,
  seoRequirements: [],
  budget: '',
  deadline: '',
  maintenanceContract: false,
  needsTraining: false,
  contactPerson: '',
  email: '',
  phone: ''
}

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-blue-600">
          Stap {currentStep} van {totalSteps}
        </span>
        <span className="text-sm font-medium text-blue-600">
          {Math.round(progress)}% compleet
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">Start</span>
        <span className="text-xs text-gray-500">Voltooid</span>
      </div>
    </div>
  )
}

const StepIndicator = ({ title, description }: { title: string, description: string }) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
  </div>
)

// Voeg deze nieuwe component toe voor mooiere select dropdowns
const Select = ({
  value,
  onChange,
  options,
  placeholder,
  label
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string, label: string }[]
  placeholder: string
  label: string
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border-gray-300 bg-white py-3.5 pl-4 pr-10 text-base 
                  focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  shadow-sm transition-all duration-200 ease-in-out
                  appearance-none hover:border-gray-400"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg 
          className="h-5 w-5 text-gray-400" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      <div className="absolute inset-0 rounded-lg pointer-events-none border border-gray-300 transition-all duration-200 ease-in-out"></div>
    </div>
  </div>
)

// Voeg deze nieuwe component toe voor mooiere text inputs
const Input = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = ""
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className="block w-full rounded-lg border-gray-300 py-3 px-4 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm"
    />
  </div>
)

// Voeg deze nieuwe SuccessMessage component toe
const SuccessMessage = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
          Offerte aanvraag succesvol verstuurd!
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Wij nemen zo spoedig mogelijk contact met u op om uw wensen te bespreken.
        </p>
        <button
          onClick={onClose}
          className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Sluiten
        </button>
      </div>
    </div>
  </div>
)

export default function QuoteModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCustomIndustry, setShowCustomIndustry] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const totalSteps = 10

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const validateCurrentStep = (): boolean => {
    setError(null)
    switch (currentStep) {
      case 1:
        if (!formData.companyName) {
          setError('Bedrijfsnaam is verplicht')
          return false
        }
        break
      case 10:
        if (!formData.email || !formData.phone) {
          setError('Contactgegevens zijn verplicht')
          return false
        }
        break
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Valideer verplichte velden
      if (!formData.companyName?.trim()) {
        setError('Vul de bedrijfsnaam in')
        return
      }

      if (!formData.email?.trim() || !formData.phone?.trim()) {
        setError('Vul alle contactgegevens in')
        return
      }

      // Valideer e-mailadres
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        setError('Vul een geldig e-mailadres in')
        return
      }

      const { data, error } = await supabase
        .from('quotes')
        .insert([
          {
            company_name: formData.companyName.trim(),
            industry: formData.industry,
            desired_domain: formData.desiredDomain,
            primary_goal: formData.primaryGoal,
            secondary_goals: formData.secondaryGoals,
            target_audience: formData.targetAudience,
            geographic_focus: formData.geographicFocus,
            features: formData.features,
            color_scheme: formData.colorScheme,
            style: formData.style,
            website_examples: formData.websiteExamples,
            number_of_pages: formData.numberOfPages,
            has_own_content: formData.hasOwnContent,
            needs_content_support: formData.needsContentSupport,
            seo_requirements: formData.seoRequirements,
            budget: formData.budget,
            deadline: formData.deadline,
            maintenance_contract: formData.maintenanceContract,
            needs_training: formData.needsTraining,
            contact_person: formData.contactPerson,
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            status: 'pending'
          }
        ])
        .select()

      if (error) throw error

      // Log de activiteit
      await logActivity({
        description: `Nieuwe offerte aanvraag van ${formData.companyName}`,
        type: 'quote',
        related_id: data[0].id,
        related_type: 'quotes'
      })

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 3000)

    } catch (error: any) {
      console.error('Error:', error)
      setError(error.message || 'Er is een onverwachte fout opgetreden')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Input
              label="Bedrijfsnaam"
              value={formData.companyName}
              onChange={(value) => setFormData({...formData, companyName: value})}
              required
              placeholder="Uw bedrijfsnaam"
            />
            
            <div className="space-y-4">
              <Select
                label="Branche/Sector"
                value={formData.industry}
                onChange={(value) => {
                  setFormData({...formData, industry: value, customIndustry: ''})
                  setShowCustomIndustry(value === 'overig')
                }}
                options={[
                  { value: 'retail', label: 'Retail' },
                  { value: 'horeca', label: 'Horeca' },
                  { value: 'zakelijke-dienstverlening', label: 'Zakelijke Dienstverlening' },
                  { value: 'gezondheidszorg', label: 'Gezondheidszorg' },
                  { value: 'onderwijs', label: 'Onderwijs' },
                  { value: 'technologie', label: 'Technologie' },
                  { value: 'bouw', label: 'Bouw' },
                  { value: 'overig', label: 'Overig' }
                ]}
                placeholder="Selecteer uw branche"
              />

              {showCustomIndustry && (
                <div className="animate-fade-in-down">
                  <Input
                    label="Uw branche"
                    value={formData.customIndustry || ''}
                    onChange={(value) => setFormData({
                      ...formData,
                      industry: value,
                      customIndustry: value
                    })}
                    placeholder="Vul uw branche in"
                    required
                  />
                </div>
              )}
            </div>

            <Input
              label="Gewenste Domeinnaam"
              value={formData.desiredDomain}
              onChange={(value) => setFormData({...formData, desiredDomain: value})}
              placeholder="www.uwdomein.nl"
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {[
                { value: 'informatie', label: 'Informatie Verstrekken' },
                { value: 'verkoop', label: 'Producten Verkopen' },
                { value: 'leads', label: 'Leads Genereren' },
                { value: 'branding', label: 'Merkbekendheid Vergroten' }
              ].map((option) => (
                <label key={option.value} className="relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={formData.secondaryGoals.includes(option.value)}
                    onChange={(e) => {
                      const newGoals = e.target.checked
                        ? [...formData.secondaryGoals, option.value]
                        : formData.secondaryGoals.filter(g => g !== option.value)
                      setFormData({...formData, secondaryGoals: newGoals})
                    }}
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{option.label}</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center ${
                      formData.secondaryGoals.includes(option.value) 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-300'
                    }`}>
                      {formData.secondaryGoals.includes(option.value) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="absolute -inset-px rounded-lg border-2 pointer-events-none peer-checked:border-blue-600" aria-hidden="true" />
                </label>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Doelgroep</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Leeftijdscategorie</label>
              <select
                value={formData.targetAudience.ageRange}
                onChange={e => setFormData({
                  ...formData,
                  targetAudience: {...formData.targetAudience, ageRange: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecteer leeftijdscategorie</option>
                <option value="18-24">18-24 jaar</option>
                <option value="25-34">25-34 jaar</option>
                <option value="35-44">35-44 jaar</option>
                <option value="45-54">45-54 jaar</option>
                <option value="55+">55+ jaar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Geografische Focus</label>
              <select
                value={formData.geographicFocus}
                onChange={e => setFormData({...formData, geographicFocus: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecteer geografische focus</option>
                <option value="lokaal">Lokaal</option>
                <option value="regionaal">Regionaal</option>
                <option value="nationaal">Nationaal</option>
                <option value="internationaal">Internationaal</option>
              </select>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {[
                'Contactformulier',
                'Nieuwsbrief Inschrijving',
                'Webshop',
                'Blog',
                'Galerij/Portfolio',
                'Social Media Integratie',
                'CMS Systeem',
                'Chatfunctie',
                'Klantenportaal',
                'Meerdere Talen'
              ].map((feature) => (
                <label key={feature} className="relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={formData.features.includes(feature)}
                    onChange={(e) => {
                      const newFeatures = e.target.checked
                        ? [...formData.features, feature]
                        : formData.features.filter(f => f !== feature)
                      setFormData({...formData, features: newFeatures})
                    }}
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{feature}</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center ${
                      formData.features.includes(feature) 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-300'
                    }`}>
                      {formData.features.includes(feature) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="absolute -inset-px rounded-lg border-2 pointer-events-none peer-checked:border-blue-600" aria-hidden="true" />
                </label>
              ))}
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Design Voorkeuren</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kleurenschema</label>
              <select
                value={formData.colorScheme}
                onChange={e => setFormData({...formData, colorScheme: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecteer kleurenschema</option>
                <option value="zakelijk">Zakelijk (Blauw/Grijs)</option>
                <option value="creatief">Creatief (Levendige Kleuren)</option>
                <option value="minimalistisch">Minimalistisch (Zwart/Wit)</option>
                <option value="natuurlijk">Natuurlijk (Groen/Bruin)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stijl</label>
              <select
                value={formData.style}
                onChange={e => setFormData({...formData, style: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecteer stijl</option>
                <option value="modern">Modern</option>
                <option value="klassiek">Klassiek</option>
                <option value="minimalistisch">Minimalistisch</option>
                <option value="speels">Speels</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Voorbeelden van Websites</label>
              <textarea
                value={formData.websiteExamples}
                onChange={e => setFormData({...formData, websiteExamples: e.target.value})}
                placeholder="Voeg links toe naar websites die u aanspreken"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Inhoud</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Aantal Gewenste Pagina's</label>
              <select
                value={formData.numberOfPages}
                onChange={e => setFormData({...formData, numberOfPages: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecteer aantal pagina's</option>
                <option value="1-5">1-5 pagina's</option>
                <option value="5-10">5-10 pagina's</option>
                <option value="10-20">10-20 pagina's</option>
                <option value="20+">20+ pagina's</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hasOwnContent}
                  onChange={e => setFormData({...formData, hasOwnContent: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Ik heb eigen teksten en afbeeldingen</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.needsContentSupport}
                  onChange={e => setFormData({...formData, needsContentSupport: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Ik heb ondersteuning nodig bij het maken van content</span>
              </label>
            </div>
          </div>
        )
      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Wensen</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                'Basis SEO Optimalisatie',
                'Keyword Research',
                'Content Optimalisatie',
                'Lokale SEO',
                'SEO Monitoring',
                'Maandelijkse SEO Rapportage'
              ].map(requirement => (
                <label key={requirement} className="relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={formData.seoRequirements.includes(requirement)}
                    onChange={e => {
                      const newRequirements = e.target.checked
                        ? [...formData.seoRequirements, requirement]
                        : formData.seoRequirements.filter(r => r !== requirement)
                      setFormData({...formData, seoRequirements: newRequirements})
                    }}
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{requirement}</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center ${
                      formData.seoRequirements.includes(requirement) 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-300'
                    }`}>
                      {formData.seoRequirements.includes(requirement) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="absolute -inset-px rounded-lg border-2 pointer-events-none peer-checked:border-blue-600" aria-hidden="true" />
                </label>
              ))}
            </div>
          </div>
        )
      case 8:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Budget en Timeline</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Budget</label>
              <select
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecteer budget</option>
                <option value="750-1000">€750 - €1.000</option>
                <option value="1000-2500">€1.000 - €2.500</option>
                <option value="2500-5000">€2.500 - €5.000</option>
                <option value="5000+">€5.000+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gewenste Opleverdatum</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )
      case 9:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Onderhoud</h3>
            <div className="grid grid-cols-1 gap-4">
              <label className="relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={formData.maintenanceContract}
                  onChange={e => setFormData({...formData, maintenanceContract: e.target.checked})}
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Onderhoudscontract</p>
                      <p className="text-gray-500">Regelmatig onderhoud en updates van uw website</p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center ${
                    formData.maintenanceContract ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {formData.maintenanceContract && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="absolute -inset-px rounded-lg border-2 pointer-events-none peer-checked:border-blue-600" aria-hidden="true" />
              </label>

              <label className="relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={formData.needsTraining}
                  onChange={e => setFormData({...formData, needsTraining: e.target.checked})}
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Training Nodig</p>
                      <p className="text-gray-500">Instructie voor het gebruik van uw website</p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center ${
                    formData.needsTraining ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {formData.needsTraining && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="absolute -inset-px rounded-lg border-2 pointer-events-none peer-checked:border-blue-600" aria-hidden="true" />
              </label>
            </div>
          </div>
        )
      case 10:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contactgegevens</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Naam Contactpersoon</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mailadres</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefoonnummer</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        )
    }
  }

  const getStepInfo = (step: number): { title: string, description: string } => {
    switch (step) {
      case 1:
        return {
          title: "Basisinformatie",
          description: "Vertel ons meer over uw bedrijf"
        }
      case 2:
        return {
          title: "Doel van de Website",
          description: "Wat wilt u bereiken met uw website?"
        }
      case 3:
        return {
          title: "Doelgroep",
          description: "Voor wie is uw website bedoeld?"
        }
      case 4:
        return {
          title: "Functionaliteiten",
          description: "Welke features heeft u nodig?"
        }
      case 5:
        return {
          title: "Design Voorkeuren",
          description: "Hoe moet uw website eruit zien?"
        }
      case 6:
        return {
          title: "Inhoud",
          description: "Wat voor content wilt u op uw website?"
        }
      case 7:
        return {
          title: "SEO Wensen",
          description: "Hoe wilt u gevonden worden?"
        }
      case 8:
        return {
          title: "Budget & Timeline",
          description: "Wat is uw budget en wanneer moet het af zijn?"
        }
      case 9:
        return {
          title: "Onderhoud",
          description: "Heeft u ondersteuning nodig na oplevering?"
        }
      case 10:
        return {
          title: "Contactgegevens",
          description: "Hoe kunnen we u bereiken?"
        }
      default:
        return {
          title: "",
          description: ""
        }
    }
  }

  if (!isOpen) return null
  
  // Toon de success message als showSuccess true is
  if (showSuccess) {
    return <SuccessMessage onClose={() => {
      setShowSuccess(false)
      onClose()
    }} />
  }

  const stepInfo = getStepInfo(currentStep)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 sm:px-6 py-4 border-b border-gray-200 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Offerte Aanvragen</h2>
              <p className="text-sm text-gray-600 mt-1">Stap {currentStep} van {totalSteps}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <StepIndicator title={stepInfo.title} description={stepInfo.description} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              {renderStepContent()}
            </div>

            <div className="sticky bottom-0 bg-white px-4 sm:px-6 py-4 border-t border-gray-200 mt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Vorige
                  </button>
                )}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Volgende
                    <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Versturen...
                      </>
                    ) : (
                      'Verstuur Aanvraag'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 