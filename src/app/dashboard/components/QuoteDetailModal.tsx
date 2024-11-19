'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

interface QuoteDetailModalProps {
  quote: {
    id: string
    company_name: string
    contact_person: string
    email: string
    phone: string
    status: string
    created_at: string
    description?: string
    budget?: string
    timeline?: string
    requirements?: string[]
    attachments?: string[]
    notes?: string
  } | null
  isOpen: boolean
  onClose: () => void
}

type TabType = 'details' | 'requirements' | 'communication'

export default function QuoteDetailModal({ quote, isOpen, onClose }: QuoteDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details')

  if (!isOpen || !quote) return null

  const tabs = [
    { id: 'details', label: 'Algemeen' },
    { id: 'requirements', label: 'Specificaties' },
    { id: 'communication', label: 'Communicatie' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8">
        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{quote.company_name}</h2>
            <p className="text-sm text-gray-500">
              Aangemaakt op {format(new Date(quote.created_at), 'd MMMM yyyy', { locale: nl })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-end">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  quote.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  quote.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {quote.status}
                </span>
              </div>

              {/* Contact Informatie */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Informatie</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Contactpersoon</label>
                      <p className="mt-1">{quote.contact_person}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1">{quote.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Telefoon</label>
                      <p className="mt-1">{quote.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Budget</label>
                      <p className="mt-1">{quote.budget || 'Niet gespecificeerd'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Timeline</label>
                      <p className="mt-1">{quote.timeline || 'Niet gespecificeerd'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Project Beschrijving</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{quote.description || 'Geen beschrijving beschikbaar'}</p>
              </div>

              {quote.requirements && quote.requirements.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Vereisten</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {quote.requirements.map((req, index) => (
                      <li key={index} className="text-gray-700">{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {quote.attachments && quote.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Bijlagen</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {quote.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        className="flex items-center p-3 border rounded hover:bg-gray-50"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                        </svg>
                        <span>Bijlage {index + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Notities</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-700 whitespace-pre-wrap">{quote.notes || 'Geen notities beschikbaar'}</p>
                </div>
              </div>

              {/* Hier kunnen we later een communicatie log toevoegen */}
              <div>
                <h3 className="text-lg font-medium mb-4">Communicatie Geschiedenis</h3>
                <p className="text-gray-500 italic">Communicatie log wordt binnenkort toegevoegd</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Sluiten
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Status Bijwerken
          </button>
        </div>
      </div>
    </div>
  )
}