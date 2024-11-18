import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'

// Hernoem naar _inter om ESLint te laten weten dat dit bewust ongebruikt is
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
    <html lang="nl">
      <body className={_inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
