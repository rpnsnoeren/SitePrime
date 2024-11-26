'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
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
            <Link
              href="/offerte"
              className="px-4 py-2 bg-[#FF6B35] text-white rounded hover:bg-[#ff8555] transition-colors"
            >
              Offerte Aanvragen
            </Link>
            <button
              onClick={() => scrollToSection('freelancers')}
              className="px-4 py-2 text-white hover:text-[#FFB400] transition-colors"
            >
              Word Freelancer
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#FFB400] focus:outline-none"
            >
              <span className="sr-only">Open hoofdmenu</span>
              {/* Menu Icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close Icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
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
              <Link
                href="/offerte"
                className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#ff8555] rounded transition-colors"
              >
                Offerte Aanvragen
              </Link>
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
    </nav>
  )
}

export default Navbar