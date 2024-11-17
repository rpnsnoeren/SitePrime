import React from 'react'
import type { FC } from 'react'

const About: FC = () => {
  return (
    <section id="about" className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-screen-xl px-4 py-16 mx-auto lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="mb-6 text-4xl font-bold text-[#1E3D59] tracking-tight">
              Over Ons
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-600 leading-relaxed">
                Wij zijn een innovatief bedrijf dat zich richt op het leveren van hoogwaardige oplossingen voor onze klanten. Met jaren ervaring in de branche, begrijpen we precies wat onze klanten nodig hebben.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Onze missie is om technologie toegankelijk te maken voor iedereen, waarbij we focussen op gebruiksgemak en effectiviteit.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-[#FFB400] mb-2">100+</h3>
                <p className="text-gray-600">Tevreden klanten</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#FFB400] mb-2">5+ jaar</h3>
                <p className="text-gray-600">Ervaring</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#1E3D59] to-[#234567] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-[#FFB400]">
                  <svg 
                    className="w-24 h-24 opacity-20" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FFB400] rounded-xl opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 