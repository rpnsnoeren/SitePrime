'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DashboardCard {
  title: string
  count: number
  link: string
  description: string
  icon: string
}

export default function Dashboard() {
  const router = useRouter()
  const [quotesCount, setQuotesCount] = useState(0)
  const [freelancersCount, setFreelancersCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCounts()
  }, [])

  const fetchCounts = async () => {
    try {
      const quotesRes = await fetch('/api/quotes')
      const quotesData = await quotesRes.json()
      setQuotesCount(quotesData.length)

      const freelancersRes = await fetch('/api/freelancers')
      const freelancersData = await freelancersRes.json()
      setFreelancersCount(freelancersData.length)
    } catch (error) {
      console.error('Error fetching counts:', error)
    } finally {
      setLoading(false)
    }
  }

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Offerte Aanvragen',
      count: quotesCount,
      link: '/dashboard/quotes',
      description: 'Bekijk en beheer alle offerte aanvragen',
      icon: '📝'
    },
    {
      title: 'Freelancers',
      count: freelancersCount,
      link: '/dashboard/freelancers',
      description: 'Bekijk en beheer alle freelancer aanmeldingen',
      icon: '👥'
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overzicht</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardCards.map((card) => (
          <Link 
            href={card.link} 
            key={card.title}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{card.title}</p>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
                <span className="text-3xl">{card.icon}</span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-blue-600">{card.count}</p>
                <p className="text-sm text-gray-500">Totaal aantal</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Snelle Acties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => router.push('/dashboard/quotes')}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <h3 className="font-semibold text-blue-900">Bekijk Offerte Aanvragen</h3>
            <p className="text-sm text-blue-700">Beheer en reageer op nieuwe aanvragen</p>
          </button>
          
          <button 
            onClick={() => router.push('/dashboard/freelancers')}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <h3 className="font-semibold text-green-900">Bekijk Freelancers</h3>
            <p className="text-sm text-green-700">Beheer freelancer aanmeldingen</p>
          </button>
        </div>
      </div>
    </div>
  )
} 