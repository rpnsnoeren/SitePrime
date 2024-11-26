import Link from 'next/link'
import type { FC } from 'react'

const Services: FC = () => {
  const services = [
    {
      title: 'Basis Websites',
      price: 'vanaf €1.000',
      features: [
        'Responsive design',
        'CMS integratie',
        'Contact formulieren',
        'Analytics'
      ]
    },
    {
      title: 'AI Landingspagina\'s',
      price: '€750',
      features: [
        'Modern design',
        'AI-powered content',
        'Snelle oplevering',
        'SEO-optimalisatie'
      ]
    },
    {
      title: 'Maatwerk Solutions',
      price: 'op aanvraag',
      features: [
        'Complexe functionaliteit',
        'Custom design',
        'API integraties',
        'Schaalbaarheid'
      ]
    }
  ]

  return (
    <section id="services" className="bg-white py-16 lg:py-24">
      <div className="max-w-screen-xl px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-6 text-4xl font-bold text-[#1E3D59] tracking-tight">
            Onze Diensten
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kies de oplossing die het beste bij uw behoeften past
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <div 
              key={index}
              className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold text-[#1E3D59] mb-4">
                {service.title}
              </h3>
              <div className="text-3xl font-bold text-[#FFB400] mb-6">
                {service.price}
              </div>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                href="/offerte"
                className="block w-full mt-8 px-6 py-3 text-center text-white bg-[#1E3D59] rounded-lg hover:bg-[#2a5580] transition-colors"
              >
                Offerte Aanvragen
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services 