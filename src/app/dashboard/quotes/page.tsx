'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

interface Quote {
  id: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  status: string
  created_at: string
  description?: string
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/quotes')
        if (!response.ok) {
          throw new Error('Fout bij het ophalen van opdrachten')
        }
        const data = await response.json()
        setQuotes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Opdrachten Overzicht</h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          Totaal: {quotes.length}
        </span>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bedrijf
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acties
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{quote.company_name}</div>
                  <div className="text-sm text-gray-500">{quote.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{quote.contact_person}</div>
                  <div className="text-sm text-gray-500">{quote.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    quote.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    quote.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {quote.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {format(new Date(quote.created_at), 'dd MMM yyyy', { locale: nl })}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => {/* Bekijk details */}}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 