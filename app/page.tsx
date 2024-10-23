import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import LoadingAnimation from '../components/LoadingAnimation'

const ProjectsSection = React.lazy(() => import('../components/ProjectsSection'));
const ContactInfo = React.lazy(() => import('../components/ContactInfo'));
const TicTacToe = dynamic(() => import('../components/TicTacToe'), { ssr: false })
const LogoSlider = dynamic(() => import('../components/LogoSlider'), { ssr: false })
const MiniChess = dynamic(() => import('../components/MiniChess'), { ssr: false })

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
            <section className="w-full py-12 bg-white">
              <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold text-center mb-8">Game Section</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-[rgb(226,231,255)] p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-center">Easy</h3>
                    <Suspense fallback={<LoadingAnimation />}>
                      <TicTacToe />
                    </Suspense>
                  </div>
                  <div className="bg-[rgb(226,231,255)] p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-4 text-center">Normal</h3>
                    <Suspense fallback={<LoadingAnimation />}>
                      <div className="flex justify-center items-center"> {/* Center the LogoSlider */}
                        <LogoSlider />
                      </div>
                    </Suspense>
                  </div>
                  <div className="bg-[rgb(226,231,255)] p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-center">Hard</h3>
                    <Suspense fallback={<LoadingAnimation />}>
                      <MiniChess />
                    </Suspense>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer className="mt-16 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Cooper Featherstone LLC. All rights reserved.</p>
          </footer>
        </div>
      </Suspense>
    </div>
  )
}