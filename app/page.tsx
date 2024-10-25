'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import LoadingAnimation from '../components/LoadingAnimation'
import Image from 'next/image'
import Head from 'next/head'

const ProjectsSection = dynamic(() => import('../components/ProjectsSection'), {
  loading: () => <LoadingAnimation />,
  ssr: false
})
const ContactInfo = dynamic(() => import('../components/ContactInfo'), {
  loading: () => <LoadingAnimation />,
  ssr: false
})
const TicTacToe = dynamic(() => import('../components/TicTacToe'), {
  loading: () => <LoadingAnimation />,
  ssr: false
})
const LogoSlider = dynamic(() => import('../components/LogoSlider'), {
  loading: () => <LoadingAnimation />,
  ssr: false
})
const Othello = dynamic(() => import('../components/Othello'), {
  loading: () => <LoadingAnimation />,
  ssr: false
})

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 text-gray-800">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-2 flex items-center justify-center">
            <Image src="/favicon.ico" alt="Logo" width={50} height={50} className="mr-2" />
            Cooper Featherstone LLC
          </h1>
          <p className="text-xl md:text-2xl text-purple-600">Innovative Solutions, Exceptional Results</p>
        </header>

        <main className="space-y-16">
          <ProjectsSection />
          <ContactInfo />
          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-3xl font-semibold text-center mb-8">In Case You're Bored</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[rgb(226,231,255)] p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-center">Easy</h3>
                  <TicTacToe />
                </div>
                <div className="bg-[rgb(226,231,255)] p-4 rounded-lg shadow-md flex flex-col items-center">
                  <h3 className="text-xl font-semibold mb-4 text-center">Normal</h3>
                  <div className="flex justify-center items-center">
                    <LogoSlider />
                  </div>
                </div>
                <div className="bg-[rgb(226,231,255)] p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-center">Hard</h3>
                  <Othello />
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-16 text-center text-sm text-gray-600 flex items-center justify-center">
          <p>© {new Date().getFullYear()} Cooper Featherstone LLC</p>
          <Image src="/favicon.ico" alt="Logo" width={20} height={20} className="ml-2" />
        </footer>
      </div>
    </div>
  )
}