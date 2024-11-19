'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamisch importeren van de QuoteModal component
const QuoteModal = dynamic(() => import('../modals/QuoteModal'), {
  ssr: false
})

const Navbar = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  // Check of we op de homepage zijn
  const isHomePage = pathname === '/'

  return (
    <nav className="bg-[#1E3D59] border-b border-[#FFB400]/20 sticky top-0 w-full z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand Name */}
          <div className="flex-shrink-0">
            <Link 
              href="/"
              className="flex items-center space-x-2"
            >
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-white">Site</span>
                <span className="text-[#FFB400]">Prime</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Alleen tonen op homepage */}
          {isHomePage && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
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
            </div>
          )}

          {/* CTA Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="px-4 py-2 bg-[#FF6B35] text-white rounded hover:bg-[#ff8555] transition-colors"
            >
              Offerte Aanvragen
            </button>
            <button
              onClick={() => scrollToSection('freelancers')}
              className="px-4 py-2 bg-[#FFB400] text-white rounded hover:bg-[#ffc333] transition-colors"
            >
              Word Freelancer
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-[#FFB400]"
            >
              <span className="sr-only">Open menu</span>
              {/* Hamburger icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('diensten')}
                className="block w-full text-left px-3 py-2 text-white hover:text-[#FFB400]"
              >
                Diensten
              </button>
              <button
                onClick={() => scrollToSection('voordelen')}
                className="block w-full text-left px-3 py-2 text-white hover:text-[#FFB400]"
              >
                Voordelen
              </button>
              <button
                onClick={() => scrollToSection('over-ons')}
                className="block w-full text-left px-3 py-2 text-white hover:text-[#FFB400]"
              >
                Over Ons
              </button>
              <button
                onClick={() => {
                  setIsQuoteModalOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-white hover:text-[#FFB400]"
              >
                Offerte Aanvragen
              </button>
              <button
                onClick={() => {
                  scrollToSection('freelancers')
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-white hover:text-[#FFB400]"
              >
                Word Freelancer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </nav>
  )
}

export default Navbar