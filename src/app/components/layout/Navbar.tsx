'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false) // Sluit menu na klikken
    }
  }

  // Check of we op de homepage zijn
  const isHomePage = pathname === '/'

  return (
    <nav className="bg-[#1E3D59] border-b border-[#FFB400]/20 sticky top-0 z-50">
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
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-white hover:text-[#FFB400] transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-white hover:text-[#FFB400] transition-colors"
                >
                  Diensten
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-white hover:text-[#FFB400] transition-colors"
                >
                  Over Ons
                </button>
              </div>
            </div>
          )}

          {/* Hamburger Menu Button */}
          {isHomePage && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isHomePage && isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-white hover:bg-[#FFB400]/10 rounded-md"
              >
                Home
              </button>
              <button
                onClick={() => {
                  scrollToSection('services')
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-white hover:bg-[#FFB400]/10 rounded-md"
              >
                Diensten
              </button>
              <button
                onClick={() => {
                  scrollToSection('about')
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-white hover:bg-[#FFB400]/10 rounded-md"
              >
                Over Ons
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar