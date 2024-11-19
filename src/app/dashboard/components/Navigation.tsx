'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className={`py-4 px-3 ${
              pathname === '/dashboard' 
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
          
          <button
            onClick={() => handleNavigation('/dashboard/quotes')}
            className={`py-4 px-3 ${
              pathname === '/dashboard/quotes'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Opdrachten
          </button>
          
          <button
            onClick={() => handleNavigation('/dashboard/freelancers')}
            className={`py-4 px-3 ${
              pathname === '/dashboard/freelancers'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Freelancers
          </button>
        </div>
      </div>
    </nav>
  )
}