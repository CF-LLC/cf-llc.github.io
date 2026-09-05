'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
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
    <div className="site-shell min-h-screen text-white">
      <ScrollBackground />
      <SceneCanvas />

      <div id="page-top" className="relative z-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <a href="#page-top" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/20">
              <Image src="/favicon.ico" alt="CF LLC logo" width={28} height={28} />
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.32em] text-white/55">Cooper Featherstone LLC</p>
              <p className="text-sm font-semibold">Founder & Full-Stack Developer</p>
            </div>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <a href="#work" className="hover:text-white">Work</a>
            <a href="#founder" className="hover:text-white">Founder</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
        </header>

        <section className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="kicker"
          >
            Cooper Featherstone
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="display-title mt-6 max-w-5xl text-5xl text-white sm:text-7xl lg:text-8xl"
          >
            Full-Stack Developer building production-ready web applications
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-8 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl"
          >
            I build real-world applications with authentication, APIs, and modern frameworks like React and Next.js — focused on usability, performance, and business impact.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-950"
            >
              See the work
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="mailto:cooperfeatherstonellc@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base text-white"
            >
              <Mail className="h-4 w-4" />
              cooperfeatherstonellc@gmail.com
            </a>
          </motion.div>
        </section>

        <section id="founder" className="color-panel panel-magenta scroll-mt-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8 lg:py-32">
            <div>
              <p className="kicker">Cooper Featherstone LLC</p>
              <h2 className="display-title mt-4 text-4xl sm:text-6xl">Founder & Full-Stack Developer</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
                Early-stage product engineer who ships production work. Not a student portfolio. Not a generic agency wrapper.
              </p>
            </div>
            <ul className="space-y-5 text-lg leading-8 text-white/90">
              {founderPoints.map((point) => (
                <li key={point} className="border-b border-white/15 pb-5">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="signals" className="color-panel panel-cyan">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <p className="kicker">What I have built</p>
            <h2 className="display-title mt-4 max-w-4xl text-4xl sm:text-6xl">Production signals, not vibes.</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
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
                <div key={item.title} className="rounded-[1.75rem] border border-white/15 bg-black/20 p-6">
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-white/75">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="color-panel panel-ink scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
            <ProjectsSection />
          </div>
        </section>

        <section className="color-panel panel-orange">
          <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <p className="kicker">About</p>
            <h2 className="display-title mt-4 text-4xl sm:text-6xl">I ship usable software.</h2>
            <p className="mt-6 text-lg leading-8 text-white/85">
              I focus on building real-world applications that solve practical problems. Most of my work centers around full-stack development using React and modern backend tools, with an emphasis on performance, usability, and clean design.
            </p>
            <p className="mt-6 text-lg leading-8 text-white/85">
              Internships at JB Hunt and Walmart sit behind the work. The public repos are the proof: auth, APIs, dashboards, and deployed apps.
            </p>
          </div>
        </section>

        <div id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
          <ContactInfo />
        </div>

        <section id="play" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="glass rounded-[2rem] p-6 sm:p-8">
            <div className="mb-8 text-center">
              <p className="kicker">Extras</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Quick interaction studies</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <h3 className="mb-4 text-center text-xl font-semibold">Easy</h3>
                <div className="rounded-[1.25rem] bg-[#d8efff] p-4 text-slate-900">
                  <TicTacToe />
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <h3 className="mb-4 text-center text-xl font-semibold">Normal</h3>
                <div className="flex justify-center rounded-[1.25rem] bg-[#d8efff] p-4 text-slate-900">
                  <LogoSlider />
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 md:col-span-2 xl:col-span-1">
                <h3 className="mb-4 text-center text-xl font-semibold">Hard</h3>
                <div className="rounded-[1.25rem] bg-[#d8efff] p-4 text-slate-900">
                  <Othello />
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-white/50">
              © {new Date().getFullYear()} Cooper Featherstone LLC
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
