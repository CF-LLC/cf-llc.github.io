import { ExternalLink, Github } from 'lucide-react'

type Project = {
  name: string
  value: string
  features: string[]
  stack: string
  source?: string
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
    source: 'https://github.com/CF-LLC/funnel-maker',
    live: 'https://myfunnelr.vercel.app',
  },
  {
    name: 'SpockShop',
    value: "Spock's Resale Shop: a live online store with categorized product listings and a self-hosted admin for managing items.",
    features: ['Categorized product catalog', 'Self-hosted Postgres and /admin area', 'Mobile-friendly storefront'],
    stack: 'Next.js, TypeScript, PostgreSQL, Docker',
    live: 'https://spockshop.com',
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
    source: 'https://github.com/CF-LLC/InvoiceForge',
    live: 'https://cf-llc.github.io/InvoiceForge/',
  },
]

export default function ProjectsSection() {
  return (
    <div>
      <p className="kicker">Projects</p>
      <h2 id="work-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Other things I&apos;ve built</h2>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <li key={p.name} className="rounded-lg border border-white/15 bg-white/[0.03] p-6">
            <h3 className="text-2xl text-white">{p.name}</h3>
            <p className="mt-3 leading-7 text-white/80">{p.value}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-white/75">
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <p className="mt-4 text-sm text-white/70"><span className="font-semibold text-white/85">Tech:</span> {p.stack}</p>
            <div className="mt-5 flex flex-wrap gap-5 text-sm">
              {p.live && (
                <a href={p.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-white">
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />Live<span className="sr-only"> site for {p.name} (opens in new tab)</span>
                </a>
              )}
              {p.source && (
                <a href={p.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-white">
                  <Github aria-hidden="true" className="h-4 w-4" />Source<span className="sr-only"> code for {p.name} (opens in new tab)</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <a href="https://github.com/coopfeathy" className="font-semibold underline underline-offset-4">More work on GitHub →</a>
      </p>
    </div>
  )
}
