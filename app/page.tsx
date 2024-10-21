import { Suspense } from 'react'
import ProjectsSection from '../components/ProjectsSection'
import ContactInfo from '../components/ContactInfo'
import LoadingAnimation from '../components/LoadingAnimation'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 text-gray-800">
      <Suspense fallback={<LoadingAnimation />}>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-2">Cooper Featherstone LLC</h1>
            <p className="text-xl md:text-2xl text-purple-600">Innovative Solutions, Exceptional Results</p>
          </header>

          <main className="space-y-16">
            <ProjectsSection />
            <ContactInfo />
          </main>

          <footer className="mt-16 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Cooper Featherstone LLC. All rights reserved.</p>
          </footer>
        </div>
      </Suspense>
    </div>
  )
}