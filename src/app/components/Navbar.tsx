'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

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
            <button
              onClick={() => scrollToSection('diensten')}
              className="text-white hover:text-[#FFB400] transition-colors"
            >
              Diensten
            </button>
            <button
              onClick={() => scrollToSection('voordelen')}
              className="text-white hover:text-[#FFB400] transition-colors"
            >
              Voordelen
            </button>
            <button
              onClick={() => scrollToSection('over-ons')}
              className="text-white hover:text-[#FFB400] transition-colors"
            >
              Over Ons
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/offerte"
              className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#ff8555] transition-colors"
            >
              Offerte Aanvragen
            </Link>
            <button
              onClick={() => scrollToSection('freelancers')}
              className="bg-[#FFB400] text-[#1E3D59] px-6 py-2 rounded-lg hover:bg-[#ffc333] transition-colors"
            >
              Word Freelancer
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 