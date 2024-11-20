import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SitePrime',
  description: 'SitePrime Platform',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/apple-touch-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={`${inter.className} relative`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
