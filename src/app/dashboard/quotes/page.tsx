'use client'
import { useEffect, useState } from 'react'

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

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/quotes')
      const data = await res.json()
      setQuotes(data)
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    try {
      await fetch(`/api/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchQuotes() // Refresh de lijst
    } catch (error) {
      console.error('Error updating quote:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Opdrachten Overzicht</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {quotes.map((quote) => (
            <li key={quote._id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{quote.companyName}</h3>
                  <p className="text-sm text-gray-600">
                    Type: {quote.websiteType}
                  </p>
                  <p className="text-sm text-gray-600">
                    Budget: {quote.budget}
                  </p>
                  <p className="text-sm text-gray-600">
                    Contact: {quote.contactPerson} ({quote.email})
                  </p>
                </div>
                <div className="space-y-2">
                  <select
                    value={quote.status}
                    onChange={(e) => updateQuoteStatus(quote._id, e.target.value)}
                    className="ml-2 rounded border border-gray-300 p-2"
                  >
                    <option value="nieuw">Nieuw</option>
                    <option value="in_behandeling">In behandeling</option>
                    <option value="afgerond">Afgerond</option>
                    <option value="geannuleerd">Geannuleerd</option>
                  </select>
                  <p className="text-sm text-gray-500">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 