'use client'
import React from 'react'
import type { FC } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar: FC = () => {
  const pathname = usePathname()
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
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

          {/* CTA Button - Alleen tonen op homepage */}
          {isHomePage && (
            <div className="hidden md:block">
              <button 
                onClick={() => scrollToSection('services')}
                className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#ff8555] transition-colors"
              >
                Start Nu
              </button>
            </div>
          )}

          {/* Mobile menu button - Alleen tonen op homepage */}
          {isHomePage && (
            <div className="md:hidden">
              <button className="text-white hover:text-[#FFB400] transition-colors">
                <svg
                  className="h-6 w-6"
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
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu (hidden by default) - Alleen tonen op homepage */}
        {isHomePage && (
          <div className="hidden md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="block text-white hover:text-[#FFB400] transition-colors py-2 w-full text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="block text-white hover:text-[#FFB400] transition-colors py-2 w-full text-left"
              >
                Diensten
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block text-white hover:text-[#FFB400] transition-colors py-2 w-full text-left"
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