import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Moderne Landing Page',
  description: 'Gemaakt met Next.js, Tailwind CSS en Flowbite',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
