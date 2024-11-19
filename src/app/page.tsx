import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import About from './components/sections/About'
import Freelancers from './components/sections/Freelancers'

export default function Home() {
  return (
    <main className="">
      {/* Hero Section */}
      <section className="relative">
        <Hero />
      </section>

      {/* Diensten Section */}
      <section id="diensten" className="py-20 bg-white">
        <Services />
      </section>

      {/* Voordelen Section */}
      <section id="voordelen" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Onze Voordelen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">AI-powered Content</h3>
              <p className="text-gray-600">Optimale content creatie met behulp van AI-technologie</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Snelle Oplevering</h3>
              <p className="text-gray-600">Efficiënt ontwikkelproces voor snelle resultaten</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Expert Support</h3>
              <p className="text-gray-600">24/7 ondersteuning van ons expert team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Over Ons Section */}
      <section id="over-ons" className="py-20 bg-white">
        <About />
      </section>

      {/* Freelancers Section */}
      <section id="freelancers" className="py-20 bg-gray-50">
        <Freelancers />
      </section>
    </main>
  )
}
