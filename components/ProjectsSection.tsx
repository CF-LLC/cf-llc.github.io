'use client'

import { ExternalLink, Github } from 'lucide-react'

type Project = {
  name: string
  value: string
  features: string[]
  stack: string
  proof: string
  source: string
  live?: string
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
  },
]

export default function ProjectsSection() {
  return (
    <section className="relative">
      <div className="mb-16 max-w-2xl">
        <p className="kicker">03 — Selected work</p>
        <h2 className="display-title mt-6 text-4xl text-white sm:text-6xl">Products, not homework.</h2>
        <p className="mt-6 text-lg leading-8 text-white/55">
          Each build below is real source or a live deploy. Proof is limited to what the repo or live site actually shows.
        </p>
      </div>

      <div>
        {projects.map((project, index) => (
          <article key={project.name} className="border-t border-white/10 py-12 last:border-b">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="kicker">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="display-title mt-4 text-3xl text-white sm:text-5xl">{project.name}</h3>
                <p className="mt-5 text-base leading-7 text-white/60">{project.value}</p>
                <div className="mt-7 flex flex-wrap gap-6 text-sm">
                  <a href={project.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/70 hover:text-white">
                    <Github className="h-4 w-4" />
                    Source
                  </a>
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/70 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                      Live
                    </a>
                  )}
                </div>
              </div>
              <div className="grid gap-8 sm:grid-cols-3">
                <div>
                  <p className="kicker">Features</p>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-white/55">
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="kicker">Tech</p>
                  <p className="mt-4 text-sm leading-6 text-white/55">{project.stack}</p>
                </div>
                <div>
                  <p className="kicker">Proof</p>
                  <p className="mt-4 text-sm leading-6 text-white/55">{project.proof}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
