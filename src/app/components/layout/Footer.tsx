'use client'
import React from 'react'
import type { FC } from 'react'

const Footer: FC = () => {
  return (
    <footer className="bg-white shadow">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © {new Date().getFullYear()}{' '}
            <a href="/" className="hover:underline">
              Jouw Bedrijf
            </a>
            . Alle rechten voorbehouden.
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer