'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import LoadingAnimation from '@/components/LoadingAnimation'
import ProjectsSection from '@/components/ProjectsSection'
import ContactInfo from '@/components/ContactInfo'
import ScrollBackground from '@/components/ScrollBackground'
import SceneCanvas from '@/components/SceneCanvas'

const TicTacToe = dynamic(() => import('@/components/TicTacToe'), {
  loading: () => <LoadingAnimation />,
  ssr: false,
})
const LogoSlider = dynamic(() => import('@/components/LogoSlider'), {
  loading: () => <LoadingAnimation />,
  ssr: false,
})
const Othello = dynamic(() => import('@/components/Othello'), {
  loading: () => <LoadingAnimation />,
  ssr: false,
})

const founderPoints = [
  'Built and launched production web apps and SaaS-style products (React, Next.js, APIs)',
  'Client work end-to-end: UI/UX, backend integration, deploy',
  'Auth, dynamic data, responsive UI',
  'Full product lifecycle, concept to production',
]

export default function Home() {
  return (
    <div className="site-shell min-h-screen text-[#eceae4]">
      <ScrollBackground />
      <SceneCanvas />

      <div id="page-top" className="relative z-10">
        <header className="mx-auto flex max-w-6xl items-baseline justify-between px-5 py-8 sm:px-8">
          <a href="#page-top" className="text-sm tracking-[0.18em] text-white/70">
            CF LLC
          </a>
          <nav className="flex items-center gap-7 text-[0.8rem] tracking-[0.16em] text-white/45">
            <a href="#work" className="hover:text-white">Work</a>
            <a href="#founder" className="hover:text-white">Founder</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
        </header>

        <section className="relative mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-center px-5 pb-28 pt-10 sm:px-8">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="kicker">
            Cooper Featherstone
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.7 }}
            className="display-title mt-8 max-w-4xl text-[3.1rem] sm:text-7xl lg:text-[5.6rem]"
          >
            Full-Stack Developer building production-ready web applications
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.7 }}
            className="mt-10 max-w-xl text-[1.05rem] leading-8 text-white/58"
          >
            I build real-world applications with authentication, APIs, and modern frameworks like React and Next.js — focused on usability, performance, and business impact.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm"
          >
            <a href="#work" className="border-b border-white/30 pb-1 text-white hover:border-white">
              Selected work
            </a>
            <a href="mailto:cooperfeatherstonellc@gmail.com" className="text-white/50 hover:text-white">
              cooperfeatherstonellc@gmail.com
            </a>
          </motion.div>
        </section>

        <section id="founder" className="color-panel panel-magenta scroll-mt-24">
          <div className="mx-auto grid max-w-6xl gap-16 px-5 py-28 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-36">
            <div>
              <p className="kicker">01 — Cooper Featherstone LLC</p>
              <h2 className="display-title mt-6 text-4xl sm:text-6xl">Founder & Full-Stack Developer</h2>
              <p className="mt-8 max-w-md text-lg leading-8 text-white/60">
                Early-stage product engineer who ships production work.
              </p>
            </div>
            <ul className="space-y-0 text-[1.05rem] leading-8 text-white/80">
              {founderPoints.map((point) => (
                <li key={point} className="border-t border-white/10 py-5 last:border-b">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="signals" className="color-panel panel-cyan">
          <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8 lg:py-36">
            <p className="kicker">02 — Practice</p>
            <h2 className="display-title mt-6 max-w-3xl text-4xl sm:text-6xl">Production signals, not vibes.</h2>
            <div className="mt-16 grid gap-0 border-t border-white/10 md:grid-cols-3">
              {[
                {
                  title: 'Full-stack apps deployed',
                  body: 'Public deploys on GitHub Pages and Vercel, including Funnel Maker, Daily Methods Hub, InvoiceForge, and more.',
                },
                {
                  title: 'Authentication + database',
                  body: 'Supabase auth and Postgres-backed product flows in Funnel Maker and Daily Methods Hub. Access-gated dashboard path in IG Command Center.',
                },
                {
                  title: 'API-driven products',
                  body: 'App Router API routes for funnels, billing, AI generation, and CRUD — visible in the public repositories.',
                },
              ].map((item) => (
                <div key={item.title} className="border-white/10 py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                  <h3 className="font-sans text-lg font-medium tracking-tight">{item.title}</h3>
                  <p className="mt-4 text-[0.95rem] leading-7 text-white/55">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="color-panel panel-ink scroll-mt-24">
          <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8 lg:py-36">
            <ProjectsSection />
          </div>
        </section>

        <section className="color-panel panel-orange">
          <div className="mx-auto max-w-3xl px-5 py-28 sm:px-8 lg:py-36">
            <p className="kicker">04 — About</p>
            <h2 className="display-title mt-6 text-4xl sm:text-6xl">I ship usable software.</h2>
            <p className="mt-8 text-lg leading-8 text-white/62">
              I focus on building real-world applications that solve practical problems. Most of my work centers around full-stack development using React and modern backend tools, with an emphasis on performance, usability, and clean design.
            </p>
            <p className="mt-6 text-lg leading-8 text-white/62">
              Internships at JB Hunt and Walmart sit behind the work. The public repos are the proof: auth, APIs, dashboards, and deployed apps.
            </p>
          </div>
        </section>

        <div id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8">
          <ContactInfo />
        </div>

        <footer className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <details className="border-t border-white/10 pt-8">
            <summary className="cursor-pointer list-none text-sm tracking-[0.18em] text-white/35">
              Interaction studies
            </summary>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-md border border-white/10 p-4">
                <p className="mb-3 text-xs tracking-[0.2em] text-white/40">EASY</p>
                <div className="bg-[#eceae4] p-3 text-slate-900">
                  <TicTacToe />
                </div>
              </div>
              <div className="rounded-md border border-white/10 p-4">
                <p className="mb-3 text-xs tracking-[0.2em] text-white/40">NORMAL</p>
                <div className="flex justify-center bg-[#eceae4] p-3 text-slate-900">
                  <LogoSlider />
                </div>
              </div>
              <div className="rounded-md border border-white/10 p-4 md:col-span-2 xl:col-span-1">
                <p className="mb-3 text-xs tracking-[0.2em] text-white/40">HARD</p>
                <div className="bg-[#eceae4] p-3 text-slate-900">
                  <Othello />
                </div>
              </div>
            </div>
          </details>
          <p className="mt-10 text-xs tracking-[0.16em] text-white/30">
            © {new Date().getFullYear()} Cooper Featherstone LLC
          </p>
        </footer>
      </div>
    </div>
  )
}
