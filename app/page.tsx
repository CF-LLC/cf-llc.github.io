'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import LoadingAnimation from '@/components/LoadingAnimation'
import ProjectsSection from '@/components/ProjectsSection'
import ContactInfo from '@/components/ContactInfo'
import ScrollBackground from '@/components/ScrollBackground'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, BriefcaseBusiness, ChevronDown, Sparkles } from 'lucide-react'

const TicTacToe = dynamic(() => import('@/components/TicTacToe'), {
  loading: () => <LoadingAnimation />,
  ssr: false
})
const LogoSlider = dynamic(() => import('@/components/LogoSlider'), {
  loading: () => <LoadingAnimation />,
  ssr: false
})
const Othello = dynamic(() => import('@/components/Othello'), {
  loading: () => <LoadingAnimation />,
  ssr: false
})

const heroStats = [
  { value: 'Product Websites', label: 'design + build + launch' },
  { value: 'Automation Systems', label: 'remove repetitive manual work' },
  { value: 'Technical Direction', label: 'focused, practical execution plans' },
]

export default function Home() {
  return (
    <div className="site-shell min-h-screen text-slate-50">
      <ScrollBackground />

      <div id="page-top" className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-20">
        <motion.header
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="glass-panel sticky top-4 z-30 mb-8 flex items-center justify-between rounded-full px-4 py-3 sm:px-6"
        >
          <a href="#page-top" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 via-sky-400 to-blue-600 shadow-lg shadow-sky-900/30 ring-1 ring-white/20">
              <Image src="/favicon.ico" alt="CF LLC logo" width={28} height={28} />
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.35em] text-sky-200/80">Cooper Featherstone LLC</p>
              <p className="text-sm font-semibold text-white">Custom Software Solutions</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-sky-100/80 md:flex">
            <a href="#projects" className="hover:text-white">Projects</a>
            <a href="#apply" className="hover:text-white">Apply</a>
            <a href="#play" className="hover:text-white">Extras</a>
          </nav>
        </motion.header>

        <main className="space-y-10" id="top">
          <section className="animated-gradient relative overflow-hidden rounded-[2rem] border border-sky-200/10 bg-[linear-gradient(135deg,rgba(8,33,63,0.9),rgba(8,25,46,0.75),rgba(6,29,56,0.95))] px-6 py-8 shadow-[0_32px_90px_rgba(0,0,0,0.38)] sm:px-10 sm:py-12 lg:px-14 lg:py-16">
            <motion.div
              initial={false}
              animate={{ opacity: 0.65, scale: 1 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="pointer-events-none absolute left-[-6rem] top-[-5rem] h-64 w-64 rounded-full bg-sky-400/20 blur-3xl"
            />
            <motion.div
              initial={false}
              animate={{ opacity: 0.55, scale: 1 }}
              transition={{ duration: 1.15, ease: 'easeOut', delay: 0.1 }}
              className="pointer-events-none absolute bottom-[-6rem] right-[-4rem] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
            />
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(116,197,255,0.18),transparent_62%)] lg:block" />
            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
              <div className="max-w-3xl">
                <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200/15 bg-white/5 px-4 py-2 text-sm text-sky-100/90 backdrop-blur">
                  <Sparkles className="h-4 w-4 text-sky-300" />
                  Cooper Featherstone LLC • digital build partner
                </motion.div>
                <motion.h1 initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }} className="hero-text max-w-4xl text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
                  Build smarter systems. Launch faster experiences.
                </motion.h1>
                <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }} className="mt-6 max-w-2xl text-lg leading-8 text-sky-100/78 sm:text-xl">
                  CF LLC helps companies ship websites, automations, and internal tools that reduce busywork and increase speed across the business.
                </motion.p>

                <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }} className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <motion.a
                    href="#apply"
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="ring-pulse animated-gradient inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-sky-900/30"
                  >
                    Start your project
                    <ArrowRight className="h-4 w-4" />
                  </motion.a>
                  <motion.a
                    href="#projects"
                    onClick={() => window.dispatchEvent(new Event('open-projects'))}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200/20 bg-white/5 px-6 py-3 text-base font-medium text-sky-50 backdrop-blur"
                  >
                    View projects
                    <ChevronDown className="h-4 w-4" />
                  </motion.a>
                </motion.div>
              </div>

              <motion.div
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut', delay: 0.1 }}
                className="glass-panel rounded-[1.75rem] p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-200">
                    <BriefcaseBusiness className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-sky-200/65">How CF LLC helps</p>
                    <p className="text-lg font-semibold text-white">Strategy, build, and ongoing execution</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {heroStats.map((stat, index) => (
                    <motion.div
                      key={stat.value}
                      initial={false}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 + index * 0.08 }}
                      whileHover={{ x: 4 }}
                      className="float-slow rounded-2xl border border-sky-200/10 bg-sky-50/5 px-4 py-4"
                      style={{ animationDelay: `${index * 0.35}s` }}
                    >
                      <p className="text-2xl font-semibold text-white">{stat.value}</p>
                      <p className="mt-1 text-sm uppercase tracking-[0.2em] text-sky-100/55">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          <div id="projects" className="scroll-mt-28 sm:scroll-mt-32">
            <ProjectsSection />
          </div>

          <div id="apply" className="scroll-mt-28 sm:scroll-mt-32">
            <ContactInfo />
          </div>

          <section
            id="play"
            className="section-card relative overflow-hidden rounded-[2rem] p-6 scroll-mt-28 sm:p-8 sm:scroll-mt-32"
          >
            <div className="mb-8 flex flex-col gap-3 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-200/60">In case you are bored</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Quick demos. Fast mechanics. Clean interactions.</h2>
              <p className="mx-auto max-w-2xl text-base text-sky-100/70 sm:text-lg">
                These mini builds show interaction quality, UX polish, and problem-solving style in a hands-on way.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 p-4 shadow-lg shadow-slate-950/20">
                <h3 className="mb-4 text-center text-xl font-semibold text-white">Easy</h3>
                <div className="rounded-[1.25rem] border border-sky-200/10 bg-[#d8efff] p-4 text-slate-900">
                  <TicTacToe />
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 p-4 shadow-lg shadow-slate-950/20">
                <h3 className="mb-4 text-center text-xl font-semibold text-white">Normal</h3>
                <div className="flex justify-center rounded-[1.25rem] border border-sky-200/10 bg-[#d8efff] p-4 text-slate-900">
                  <LogoSlider />
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-sky-200/10 bg-sky-50/5 p-4 shadow-lg shadow-slate-950/20 md:col-span-2 xl:col-span-1">
                <h3 className="mb-4 text-center text-xl font-semibold text-white">Hard</h3>
                <div className="rounded-[1.25rem] border border-sky-200/10 bg-[#d8efff] p-4 text-slate-900">
                  <Othello />
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-sky-200/12 pt-6 text-center text-sm text-sky-100/60">
              © {new Date().getFullYear()} Cooper Featherstone LLC • Built and operated by CF LLC
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}