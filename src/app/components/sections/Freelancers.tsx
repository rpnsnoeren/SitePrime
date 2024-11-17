'use client'
import React, { useState } from 'react'
import type { FC } from 'react'
import FreelancerModal from '../modals/FreelancerModal'

const Freelancers: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const benefits = [
    {
      title: 'Vaste stroom aan leads',
      description: 'Ontvang regelmatig nieuwe projectaanvragen zonder acquisitie',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Geen acquisitiekosten',
      description: 'Focus op je werk, niet op het vinden van werk',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Flexibele werkuren',
      description: 'Werk wanneer het jou uitkomt',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Gegarandeerde betalingen',
      description: 'Veilig en op tijd uitbetaald voor je werk',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Professioneel platform',
      description: 'Werk met moderne tools en processen',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Groeimogelijkheden',
      description: 'Ontwikkel jezelf met diverse projecten',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ]

  return (
    <section id="freelancers" className="bg-gradient-to-b from-[#1E3D59] to-[#234567] py-16 lg:py-24">
      <div className="max-w-screen-xl px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-6 text-4xl font-bold text-white tracking-tight">
            Word onderdeel van <span className="text-[#FFB400]">SitePrime's</span> netwerk van web professionals
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join ons team van experts en krijg toegang tot kwalitatieve projecten en professionele ondersteuning
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors"
            >
              <div className="w-12 h-12 bg-[#FFB400] rounded-lg flex items-center justify-center mb-4 text-[#1E3D59]">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-300">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#ff8555] transition-colors font-semibold"
          >
            Start als SitePrime Professional
          </button>
        </div>
      </div>

      <FreelancerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}

export default Freelancers 