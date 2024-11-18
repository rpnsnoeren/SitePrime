'use client'
import { useState } from 'react'
import Link from 'next/link'
import QuoteModal from './modals/QuoteModal'
import FreelancerModal from './modals/FreelancerModal'

export default function Navbar() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [isFreelancerModalOpen, setIsFreelancerModalOpen] = useState(false)

  return (
    <nav className="bg-[#1E3D59] border-b border-[#FFB400]/20">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-white">Site</span>
                <span className="text-[#FFB400]">Prime</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/" className="text-white hover:text-[#FFB400] transition-colors">
              Home
            </Link>
            <Link href="#diensten" className="text-white hover:text-[#FFB400] transition-colors">
              Diensten
            </Link>
            <Link href="#over-ons" className="text-white hover:text-[#FFB400] transition-colors">
              Over Ons
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#ff8555] transition-colors"
            >
              Offerte Aanvragen
            </button>
            <button
              onClick={() => setIsFreelancerModalOpen(true)}
              className="bg-[#FFB400] text-[#1E3D59] px-6 py-2 rounded-lg hover:bg-[#ffc333] transition-colors"
            >
              Word Freelancer
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
      
      <FreelancerModal 
        isOpen={isFreelancerModalOpen} 
        onClose={() => setIsFreelancerModalOpen(false)} 
      />
    </nav>
  )
} 