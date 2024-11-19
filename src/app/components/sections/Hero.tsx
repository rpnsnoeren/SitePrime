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
    <div className="bg-[#1E3D59] text-white min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Premium Websites <span className="text-[#FFB400]">binnen</span>
            <br />
            <span className="text-[#FFB400]">Handbereik</span>
          </h1>
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto">
            Professionele websites op maat, aangedreven door AI-technologie en ontwikkeld door experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const element = document.getElementById('diensten')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-[#FFB400] text-[#1E3D59] px-8 py-3 rounded-lg hover:bg-[#ffc333] transition-colors"
            >
              Bekijk Diensten
            </button>
            <button
              onClick={() => {
                // Hier kun je de quote modal openen
              }}
              className="bg-[#FF6B35] text-white px-8 py-3 rounded-lg hover:bg-[#ff8555] transition-colors"
            >
              Offerte Aanvragen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}