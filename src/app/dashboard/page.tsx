'use client'

import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Snelle Links</h2>
          
          <div className="space-y-2">
            <button
              onClick={() => router.push('/dashboard/quotes')}
              className="w-full flex justify-between items-center p-3 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
            >
              <span>Bekijk Opdrachten</span>
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                3
              </span>
            </button>

            <button
              onClick={() => router.push('/dashboard/freelancers')}
              className="w-full flex justify-between items-center p-3 bg-green-50 hover:bg-green-100 rounded transition-colors"
            >
              <span>Bekijk Freelancers</span>
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                1
              </span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recente Activiteit</h2>
          <div className="space-y-3">
            {/* Activiteiten lijst */}
          </div>
        </div>
      </div>
    </div>
  )
} 
