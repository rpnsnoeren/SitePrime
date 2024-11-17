'use client'
import React, { useState } from 'react'
import QuoteModal from '../modals/QuoteModal'

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <section className="bg-gradient-to-b from-[#1E3D59] to-[#234567]">
        <div className="max-w-screen-xl px-4 py-24 mx-auto lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white lg:text-6xl">
              Premium Websites <span className="text-[#FFB400]">binnen Handbereik</span>
            </h1>
            <p className="mb-8 text-lg text-gray-200 leading-relaxed">
              Professionele websites op maat, aangedreven door AI-technologie en ontwikkeld door experts
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
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
        </div>
      </section>

      <QuoteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}