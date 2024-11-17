'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface Quote {
  _id: string
  websiteType: string
  features: string[]
  budget: string
  timeline: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  status: string
  createdAt: string
}

interface Freelancer {
  _id: string
  name: string
  email: string
  skills: string[]
  experience: string
  availability: string
  rate: string
  portfolio?: string
  status: string
  createdAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/dashboard/login')
    } else {
      fetchData()
    }
  }, [router])

  const fetchData = async () => {
    try {
      // Haal quotes op
      const quotesRes = await fetch('/api/quotes')
      const quotesData = await quotesRes.json()
      setQuotes(quotesData)

      // Haal freelancers op
      const freelancersRes = await fetch('/api/freelancers')
      const freelancersData = await freelancersRes.json()
      setFreelancers(freelancersData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Cookies.remove('token')
    router.push('/dashboard/login')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Uitloggen
        </button>
      </div>

      {/* Recente Offerte Aanvragen */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Recente Offerte Aanvragen</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bedrijf</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{quote.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{quote.websiteType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{quote.budget}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{quote.contactPerson}</div>
                    <div className="text-sm text-gray-500">{quote.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${quote.status === 'nieuw' ? 'bg-green-100 text-green-800' : 
                      quote.status === 'in_behandeling' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recente Freelancer Aanmeldingen */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recente Freelancer Aanmeldingen</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ervaring</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarief</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {freelancers.map((freelancer) => (
                <tr key={freelancer._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{freelancer.name}</div>
                    <div className="text-sm text-gray-500">{freelancer.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {freelancer.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{freelancer.experience}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{freelancer.rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${freelancer.status === 'beschikbaar' ? 'bg-green-100 text-green-800' : 
                      freelancer.status === 'bezet' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                      {freelancer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(freelancer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 