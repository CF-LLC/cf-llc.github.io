'use client'

import { ExternalLink, Github } from 'lucide-react'
import { motion } from 'framer-motion'

type Project = {
  name: string
  value: string
  features: string[]
  stack: string
  proof: string
  source: string
  live?: string
  accent: 'magenta' | 'cyan' | 'orange'
}

const projects: Project[] = [
  {
    name: 'Funnel Maker',
    value: 'A SaaS-style funnel builder that lets a team design, share, and export multi-step sales pages without starting from a blank file every time.',
    features: [
      'Email/password authentication via Supabase Auth',
      'Drag-and-drop funnel steps with dashboard CRUD',
      'Stripe billing routes, public share links, and HTML export',
    ],
    stack: 'Next.js, React, TypeScript, Supabase, Stripe, OpenAI, Tailwind',
    proof: 'Live at myfunnelr.vercel.app. Source includes auth pages, API routes for funnels/billing/AI, and a Supabase-backed schema.',
    source: 'https://github.com/CF-LLC/funnel-maker',
    live: 'https://myfunnelr.vercel.app',
    accent: 'magenta',
  },
  {
    name: 'Daily Methods Hub',
    value: 'A full-stack tracker for logging daily earning methods, reviewing totals, and managing income sources from a protected dashboard.',
    features: [
      'Login and signup with route protection',
      'Methods CRUD, dashboard summaries, and CSV import/export',
      'Supabase data layer with Stripe subscription routes in the repo',
    ],
    stack: 'Next.js 14, TypeScript, Supabase, Stripe, Tailwind',
    proof: 'Deployed at daily-methods-hub.vercel.app. Repo contains auth callbacks, server actions, and API routes rather than a static demo page.',
    source: 'https://github.com/CF-LLC/DailyMethodsHub',
    live: 'https://daily-methods-hub.vercel.app',
    accent: 'cyan',
  },
  {
    name: 'IG Command Center',
    value: 'An internal operations dashboard for managing multiple social accounts, content, approvals, and comments from one place.',
    features: [
      'Multi-account dashboard, calendar, composer, and analytics views',
      'Role-based workflow (admin / editor / approver) and comments inbox',
      'PostgreSQL via Prisma/Neon plus an access-gated login path',
    ],
    stack: 'Next.js, TypeScript, Tailwind, shadcn/ui, Prisma, PostgreSQL, OpenAI',
    proof: 'Public source at CF-LLC/IG-Command-Center documents a production-shaped app with demo mode and a real database path. No public marketing homepage is published yet.',
    source: 'https://github.com/CF-LLC/IG-Command-Center',
    accent: 'orange',
  },
  {
    name: 'InvoiceForge',
    value: 'A browser invoice generator for creating client-ready invoices with custom business details, line items, tax, and export.',
    features: [
      'Editable sender, client, line items, tax, and currency',
      'Save/load business profile templates in local storage',
      'PNG download and print-to-PDF export',
    ],
    stack: 'Next.js, TypeScript, React',
    proof: 'Live on GitHub Pages at cf-llc.github.io/InvoiceForge with the source in CF-LLC/InvoiceForge.',
    source: 'https://github.com/CF-LLC/InvoiceForge',
    live: 'https://cf-llc.github.io/InvoiceForge/',
    accent: 'magenta',
  },
  {
    name: "Satoshi's Path",
    value: 'A Bitcoin education site that packages calculators, price context, and learning resources so someone can plan a strategy instead of hunting scattered tabs.',
    features: [
      'DCA calculators and price tracking views',
      'Personal strategy guides and curated resources',
      'Responsive multi-page educational UI',
    ],
    stack: 'TypeScript, Next.js, React',
    proof: 'Live at cf-llc.github.io/satoshis-path. Public repo CF-LLC/satoshis-path.',
    source: 'https://github.com/CF-LLC/satoshis-path',
    live: 'https://cf-llc.github.io/satoshis-path/',
    accent: 'cyan',
  },
  {
    name: 'ContentCascade',
    value: 'A content tool that takes one source piece and turns it into platform-shaped posts so a creator does not rewrite the same idea six times by hand.',
    features: [
      'Single-source input to multi-platform output',
      'Platform-oriented copy variants',
      'TypeScript application structure in the public repo',
    ],
    stack: 'TypeScript, Next.js, React',
    proof: 'Source is public at CF-LLC/ContentCascade. No separate live homepage is listed on the repository.',
    source: 'https://github.com/CF-LLC/ContentCascade',
    accent: 'orange',
  },
  {
    name: 'RogueCoin Game',
    value: 'A browser crash-style game and airdrop experience built as a public product page for RogueCoin.',
    features: [
      'Interactive crash-game loop',
      'Airdrop-oriented product surface',
      'Deployed static frontend',
    ],
    stack: 'TypeScript, React, Next.js',
    proof: 'Live at cf-llc.github.io/RogueCoinGame with source in CF-LLC/RogueCoinGame.',
    source: 'https://github.com/CF-LLC/RogueCoinGame',
    live: 'https://cf-llc.github.io/RogueCoinGame/',
    accent: 'magenta',
  },
  {
    name: 'Passive Income Tracker',
    value: 'A simple tracker for logging passive income in USD or BTC so totals stay visible without a spreadsheet.',
    features: [
      'USD and BTC tracking views',
      'Responsive UI for logging entries',
      'Deployed GitHub Pages build',
    ],
    stack: 'TypeScript, React',
    proof: 'Live at cf-llc.github.io/passive-income-tracker. Public source in CF-LLC/passive-income-tracker.',
    source: 'https://github.com/CF-LLC/passive-income-tracker',
    live: 'https://cf-llc.github.io/passive-income-tracker/',
    accent: 'cyan',
  },
]

const accentBorder = {
  magenta: 'border-pink-400/25 hover:border-pink-300/50',
  cyan: 'border-cyan-300/25 hover:border-cyan-200/50',
  orange: 'border-orange-400/25 hover:border-orange-300/50',
}

export default function ProjectsSection() {
  return (
    <section className="relative">
      <div className="mb-10 max-w-3xl">
        <p className="kicker">Selected work</p>
        <h2 className="display-title mt-4 text-4xl text-white sm:text-6xl">Products, not homework.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
          Each build below is real source or a live deploy. Proof is limited to what the repo or live site actually shows.
        </p>
      </div>

      <div className="grid gap-6">
        {projects.map((project, index) => (
          <motion.article
            key={project.name}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2) }}
            className={`glass rounded-[2rem] border p-6 sm:p-8 ${accentBorder[project.accent]}`}
          >
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="kicker">0{index + 1}</p>
                <h3 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{project.name}</h3>
                <p className="mt-4 text-base leading-7 text-white/75">{project.value}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={project.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10"
                  >
                    <Github className="h-4 w-4" />
                    Source
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live
                    </a>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div>
                  <p className="kicker">Features</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-white/75">
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="kicker">Tech</p>
                  <p className="mt-3 text-sm leading-6 text-white/75">{project.stack}</p>
                </div>
                <div>
                  <p className="kicker">Proof</p>
                  <p className="mt-3 text-sm leading-6 text-white/75">{project.proof}</p>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
