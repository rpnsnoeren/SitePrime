import QuoteModal from '../QuoteModal'
import FreelancerModal from '../FreelancerModal'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-[#1B2937] to-[#0B1219] text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professionele Websites op Maat
          </h1>
          <p className="text-xl mb-8">
            Wij bouwen moderne, snelle en gebruiksvriendelijke websites die perfect aansluiten bij uw bedrijf
          </p>
          <div className="flex justify-center gap-4">
            <QuoteModal />
            <FreelancerModal />
          </div>
        </div>
      </div>
    </section>
  )
} 