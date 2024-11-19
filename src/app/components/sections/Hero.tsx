'use client'
import { useState } from 'react'
import QuoteModal from '../modals/QuoteModal'

export default function Hero() {
  const [showModal, setShowModal] = useState(false)

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-[#1E3D59] min-h-[80vh] flex items-center">
      <div className="max-w-screen-xl px-4 mx-auto text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white lg:text-6xl">
          Premium Websites{' '}
          <span className="block text-[#FFB400]">
            binnen Handbereik
          </span>
        </h1>
        
        <p className="mb-8 text-lg text-gray-200 max-w-2xl mx-auto">
          Professionele websites op maat, aangedreven door AI-technologie en ontwikkeld door experts
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => setShowModal(true)}
            className="px-8 py-3 text-[#1E3D59] bg-[#FF6B35] rounded-lg hover:bg-[#ff8555] transition-colors font-semibold"
          >
            Offerte Aanvragen
          </button>
          <button 
            onClick={scrollToServices}
            className="px-8 py-3 text-white border-2 border-[#FFB400] rounded-lg hover:bg-[#FFB400] hover:text-[#1E3D59] transition-colors"
          >
            Bekijk Diensten
          </button>
        </div>
      </div>

      <QuoteModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </section>
  )
}