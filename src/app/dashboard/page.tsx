'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import { nl } from 'date-fns/locale'

interface Activity {
  id: string
  description: string
  created_at: string
  type: 'quote' | 'freelancer' | 'chat'
}

interface Counts {
  quotes: number
  freelancers: number
}

export default function Dashboard() {
  const router = useRouter()
  const [counts, setCounts] = useState<Counts>({ quotes: 0, freelancers: 0 })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quotes count - alleen openstaande quotes (status = 'open')
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select('id')
          .eq('status', 'open')

        // Fetch freelancers count - alleen freelancers met status 'pending'
        const { data: freelancersData, error: freelancersError } = await supabase
          .from('freelancers')
          .select('id')
          .eq('status', 'pending')

        // Fetch recent activities
        const { data: recentActivities, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        if (quotesError || freelancersError || activitiesError) {
          console.error('Error fetching data:', { quotesError, freelancersError, activitiesError })
          return
        }

        setCounts({
          quotes: quotesData?.length || 0,
          freelancers: freelancersData?.length || 0
        })
        setActivities(recentActivities || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time subscriptions
    const quotesSubscription = supabase
      .channel('quotes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quotes' }, fetchData)
      .subscribe()

    const freelancersSubscription = supabase
      .channel('freelancers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'freelancers' }, fetchData)
      .subscribe()

    const activitiesSubscription = supabase
      .channel('activities-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, fetchData)
      .subscribe()

    return () => {
      quotesSubscription.unsubscribe()
      freelancersSubscription.unsubscribe()
      activitiesSubscription.unsubscribe()
    }
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return '📝'
      case 'freelancer':
        return '👤'
      case 'chat':
        return '💬'
      default:
        return '📌'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Snelle Links */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Snelle Links
              </h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard/quotes')}
                  className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl" role="img" aria-label="quotes">📝</span>
                    <span className="font-medium text-gray-900">Open Opdrachten</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-500 text-white text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center">
                      {loading ? '...' : counts.quotes}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard/freelancers')}
                  className="w-full flex justify-between items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl" role="img" aria-label="freelancers">👤</span>
                    <span className="font-medium text-gray-900">Nieuwe Freelancers</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-green-500 text-white text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center">
                      {loading ? '...' : counts.freelancers}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Recente Activiteit */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recente Activiteit
              </h2>
              
              <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : activities.length > 0 ? (
                  activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="text-xl flex-shrink-0" role="img" aria-label={activity.type}>
                        {getActivityIcon(activity.type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900 break-words">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(activity.created_at), { 
                            addSuffix: true,
                            locale: nl 
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Geen recente activiteiten</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
