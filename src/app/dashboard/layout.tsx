'use client'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove('token')
    router.push('/dashboard/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">SitePrime</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a href="/dashboard" className="inline-flex items-center px-1 pt-1 text-gray-900">
                  Dashboard
                </a>
                <a href="/dashboard/quotes" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                  Opdrachten
                </a>
                <a href="/dashboard/freelancers" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                  Freelancers
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
} 