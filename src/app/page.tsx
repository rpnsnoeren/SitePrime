import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import About from './components/sections/About'
import Freelancers from './components/sections/Freelancers'
import Benefits from './components/sections/Benefits'

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
      {/* Freelancers Section */}
      <section id="freelancers" className="py-20 bg-gray-50">
        <Freelancers />
      </section>
      {/* Voordelen Section */}
      <section id="voordelen" className="py-20 bg-gray-50">
      <Benefits />
      </section>
      {/* Over Ons Section */}
      <section id="over-ons" className="py-20 bg-white">
        <About />
      </section>
    
    </main>
  )
}
