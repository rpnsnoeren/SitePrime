import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/layout/Navbar'

const _inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SitePrime',
  description: 'Premium Websites binnen Handbereik',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className="scroll-smooth">
      <body className={_inter.className}>
        <Navbar />
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
