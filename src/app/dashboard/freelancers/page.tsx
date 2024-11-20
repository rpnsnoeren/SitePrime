'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import FreelancerModal from '@/app/components/modals/FreelancerModal'
import FreelancerDetailModal from '../components/FreelancerDetailModal'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

interface Freelancer {
  id: string
  name: string
  email: string
  phone: string
  status: string
  created_at: string
  expertise: string
  experience: string
  rate: string
  availability: string
  portfolio: string
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchFreelancers()

    const subscription = supabase
      .channel('freelancers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'freelancers' }, fetchFreelancers)
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchFreelancers = async () => {
    try {
      const { data, error } = await supabase
        .from('freelancers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFreelancers(data || [])
    } catch (error) {
      console.error('Error fetching freelancers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFreelancerClick = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer)
    setShowDetailModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Freelancers</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nieuwe Freelancer
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Naam
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Telefoon
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Aangemaakt op
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Expertise
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Ervaring
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Tarief
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Beschikbaarheid
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Portfolio
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : freelancers.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                        Geen freelancers gevonden
                      </td>
                    </tr>
                  ) : (
                    freelancers.map((freelancer) => (
                      <tr
                        key={freelancer.id}
                        onClick={() => handleFreelancerClick(freelancer)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900 break-words">
                              {freelancer.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <div className="text-sm text-gray-500 break-words">
                            {freelancer.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="text-sm text-gray-500">
                            {freelancer.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(freelancer.status)}`}>
                            {freelancer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="text-sm text-gray-500">
                            {format(new Date(freelancer.created_at), 'dd MMM yyyy', { locale: nl })}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <div className="text-sm text-gray-500">
                            {freelancer.expertise}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <div className="text-sm text-gray-500">
                            {freelancer.experience}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <div className="text-sm text-gray-500">
                            {freelancer.rate}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <div className="text-sm text-gray-500">
                            {freelancer.availability}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <div className="text-sm text-gray-500">
                            {freelancer.portfolio}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <FreelancerModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDetailModal && selectedFreelancer && (
        <FreelancerDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedFreelancer(null)
          }}
          freelancer={selectedFreelancer}
          mode="view"
        />
      )}
    </div>
  )
}