'use client'
import { useEffect, useState } from 'react'

interface Freelancer {
  _id: string
  name: string
  email: string
  skills: string[]
  experience: string
  availability: string
  rate: string
  portfolio?: string
  status: string
  createdAt: string
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFreelancers()
  }, [])

  const fetchFreelancers = async () => {
    try {
      const res = await fetch('/api/freelancers')
      const data = await res.json()
      setFreelancers(data)
    } catch (error) {
      console.error('Error fetching freelancers:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFreelancerStatus = async (freelancerId: string, newStatus: string) => {
    try {
      await fetch(`/api/freelancers/${freelancerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchFreelancers()
    } catch (error) {
      console.error('Error updating freelancer:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Freelancers Overzicht</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {freelancers.map((freelancer) => (
            <li key={freelancer._id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{freelancer.name}</h3>
                  <p className="text-sm text-gray-600">
                    Skills: {freelancer.skills.join(', ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rate: {freelancer.rate}
                  </p>
                  <p className="text-sm text-gray-600">
                    Experience: {freelancer.experience}
                  </p>
                </div>
                <div className="space-y-2">
                  <select
                    value={freelancer.status}
                    onChange={(e) => updateFreelancerStatus(freelancer._id, e.target.value)}
                    className="ml-2 rounded border border-gray-300 p-2"
                  >
                    <option value="beschikbaar">Beschikbaar</option>
                    <option value="bezet">Bezet</option>
                    <option value="inactief">Inactief</option>
                  </select>
                  <p className="text-sm text-gray-500">
                    {new Date(freelancer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 