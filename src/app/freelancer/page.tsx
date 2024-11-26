'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function FreelancerPage() {
  useEffect(() => {
    // Cleanup functie voor als de component unmount
    return () => {
      // Verwijder oude form instances indien nodig
      const oldForm = document.querySelector('.jotform-form')
      if (oldForm) {
        oldForm.remove()
      }
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Word SitePrime Professional</h1>
        <p className="text-gray-600 mb-8">
          Vul onderstaand formulier in om je aan te melden als freelancer. 
          Wij nemen zo spoedig mogelijk contact met je op.
        </p>
        
        {/* JotForm Script en Container */}
        <div id="jotform-container" className="mb-8">
          <Script
            src="https://form.jotform.com/jsform/243305849896371"
            strategy="afterInteractive"
          />
        </div>
      </div>
    </div>
  )
} 