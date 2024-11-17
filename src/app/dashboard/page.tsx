'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface Quote {
  id: number
  websiteType: string
  features: string[]
  budget: string
  timeline: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  additionalInfo: string
  createdAt: string
  status: string
}

interface Freelancer {
  id: number
  fullName: string
  email: string
  phone: string
  portfolioUrl: string
  expertise: string[]
  yearsExperience: string
  weeklyAvailability: string
  rateRange: string
  createdAt: string
  status: string
}

type TabType = 'quotes' | 'freelancers'

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('quotes')
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null)

  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/dashboard/login')
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const [quotesRes, freelancersRes] = await Promise.all([
        fetch('/api/quotes'),
        fetch('/api/freelancers')
      ])

      if (!quotesRes.ok || !freelancersRes.ok) throw new Error('Kon data niet laden')

      const quotesData = await quotesRes.json()
      const freelancersData = await freelancersRes.json()

      setQuotes(quotesData)
      setFreelancers(freelancersData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Cookies.remove('isLoggedIn')
    router.push('/dashboard/login')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) return <div className="p-8">Laden...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1E3D59]">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-[#FF6B35] rounded-lg hover:bg-[#ff8555] transition-colors"
          >
            Uitloggen
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'quotes'
                ? 'bg-[#1E3D59] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Offerte Aanvragen
          </button>
          <button
            onClick={() => setActiveTab('freelancers')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'freelancers'
                ? 'bg-[#1E3D59] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Freelancer Aanmeldingen
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Lijst */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              {activeTab === 'quotes' ? 'Recente Aanvragen' : 'Recente Aanmeldingen'}
            </h2>
            <div className="space-y-4">
              {activeTab === 'quotes' ? (
                quotes.length === 0 ? (
                  <p className="text-gray-500">Nog geen aanvragen ontvangen</p>
                ) : (
                  quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setSelectedQuote(quote)
                        setSelectedFreelancer(null)
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[#1E3D59]">
                            {quote.companyName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {quote.websiteType}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(quote.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )
              ) : (
                freelancers.length === 0 ? (
                  <p className="text-gray-500">Nog geen aanmeldingen ontvangen</p>
                ) : (
                  freelancers.map((freelancer) => (
                    <div
                      key={freelancer.id}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setSelectedFreelancer(freelancer)
                        setSelectedQuote(null)
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-[#1E3D59]">
                            {freelancer.fullName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {freelancer.expertise.join(', ')}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(freelancer.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

          {/* Detail view */}
          {selectedQuote && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">Aanvraag Details</h2>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-500">Bedrijf</h3>
                  <p className="text-[#1E3D59]">{selectedQuote.companyName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Contactpersoon</h3>
                  <p className="text-[#1E3D59]">{selectedQuote.contactPerson}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Contact</h3>
                  <p className="text-[#1E3D59]">{selectedQuote.email}</p>
                  <p className="text-[#1E3D59]">{selectedQuote.phone}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Website Type</h3>
                  <p className="text-[#1E3D59]">{selectedQuote.websiteType}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Features</h3>
                  <ul className="list-disc list-inside text-[#1E3D59]">
                    {selectedQuote.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Budget</h3>
                  <p className="text-[#1E3D59]">{selectedQuote.budget}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Timeline</h3>
                  <p className="text-[#1E3D59]">{selectedQuote.timeline}</p>
                </div>
                {selectedQuote.additionalInfo && (
                  <div>
                    <h3 className="font-medium text-gray-500">Extra Informatie</h3>
                    <p className="text-[#1E3D59] whitespace-pre-wrap">
                      {selectedQuote.additionalInfo}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedFreelancer && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">Freelancer Details</h2>
                <button
                  onClick={() => setSelectedFreelancer(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-500">Naam</h3>
                  <p className="text-[#1E3D59]">{selectedFreelancer.fullName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Contact</h3>
                  <p className="text-[#1E3D59]">{selectedFreelancer.email}</p>
                  <p className="text-[#1E3D59]">{selectedFreelancer.phone}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Portfolio</h3>
                  <a 
                    href={selectedFreelancer.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedFreelancer.portfolioUrl}
                  </a>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Expertise</h3>
                  <ul className="list-disc list-inside text-[#1E3D59]">
                    {selectedFreelancer.expertise.map((exp, index) => (
                      <li key={index}>{exp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Ervaring</h3>
                  <p className="text-[#1E3D59]">{selectedFreelancer.yearsExperience}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Beschikbaarheid</h3>
                  <p className="text-[#1E3D59]">{selectedFreelancer.weeklyAvailability}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Uurtarief</h3>
                  <p className="text-[#1E3D59]">{selectedFreelancer.rateRange}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 