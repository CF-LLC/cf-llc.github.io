'use client'

import { useState, useEffect } from 'react'
import ProjectShowcase from '../components/ProjectShowcase'
import ProjectSetupGuide from '../components/ProjectSetupGuide'
import ContactInfo from '../components/ContactInfo'
import LoadingAnimation from '../components/LoadingAnimation'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 text-gray-800">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-indigo-800 mb-2">Cooper Featherstone LLC</h1>
            <p className="text-xl text-purple-600">Innovative Solutions, Exceptional Results</p>
          </header>

          <main className="space-y-16">
            <ProjectShowcase />
            <ProjectSetupGuide />
            <ContactInfo />
          </main>

          <footer className="mt-16 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Cooper Featherstone LLC. All rights reserved.</p>
          </footer>
        </div>
      )}
    </div>
  )
}