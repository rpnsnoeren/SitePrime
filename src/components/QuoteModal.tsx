'use client'
import { useState } from 'react'
import QuoteForm from './QuoteForm'

export default function QuoteModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
      >
        Start Nu
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Offerte Aanvragen</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <QuoteForm onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
} 