'use client'
import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import { testSupabaseConnection } from '@/lib/supabase'

interface Quote {
  id: string
  created_at: string
  company_name: string
  status: string
  contact_person: string
  email: string
  phone: string
  industry: string
  budget: string
  deadline: string
}

export default function QuotesDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  const checkConnection = useCallback(async () => {
    const isConnected = await testSupabaseConnection()
    setConnectionStatus(isConnected)
    if (isConnected) {
      fetchQuotes()
    } else {
      setError('Kan geen verbinding maken met de database. Controleer de instellingen.')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  const fetchQuotes = async () => {
    try {
      setError(null)
      const { data, error: supabaseError } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      setQuotes(data || [])
    } catch (err) {
      console.error('Error fetching quotes:', err)
      setError('Er is een fout opgetreden bij het ophalen van de offertes')
    } finally {
      setLoading(false)
    }
  }

  const updateQuoteStatus = async (id: string, newStatus: string) => {
    try {
      setError(null)
      const { error: updateError } = await supabase
        .from('quotes')
        .update({ status: newStatus })
        .eq('id', id)

      if (updateError) {
        throw updateError
      }

      // Refresh quotes na update
      await fetchQuotes()
    } catch (err) {
      console.error('Error updating quote:', err)
      setError('Er is een fout opgetreden bij het updaten van de status')
    }
  }

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
        <button 
          onClick={fetchQuotes}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Probeer opnieuw
        </button>
      </div>
    )
  }

  if (!connectionStatus) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        <p>Database verbinding niet mogelijk. Controleer of alle instellingen correct zijn.</p>
        <button 
          onClick={checkConnection}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Probeer opnieuw te verbinden
        </button>
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600">Geen offertes gevonden</h2>
        <p className="mt-2 text-gray-500">Er zijn nog geen offerte aanvragen binnengekomen.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Offerte Aanvragen</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white rounded-lg shadow">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Recente Aanvragen</h2>
            <div className="space-y-2">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedQuote?.id === quote.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-gray-50 border-gray-200'
                  } border`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{quote.company_name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(quote.created_at), 'dd MMM yyyy HH:mm', { locale: nl })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      quote.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      quote.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2">
          {selectedQuote ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{selectedQuote.company_name}</h2>
                  <div className="space-x-2">
                    <button
                      onClick={() => updateQuoteStatus(selectedQuote.id, 'APPROVED')}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Goedkeuren
                    </button>
                    <button
                      onClick={() => updateQuoteStatus(selectedQuote.id, 'REJECTED')}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Afwijzen
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p>{selectedQuote.contact_person}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{selectedQuote.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefoon</p>
                    <p>{selectedQuote.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Branche</p>
                    <p>{selectedQuote.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p>{selectedQuote.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Deadline</p>
                    <p>{selectedQuote.deadline}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-full">
              <p className="text-gray-500">Selecteer een offerte om de details te bekijken</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 