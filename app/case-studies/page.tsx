import type { Metadata } from 'next'
import CaseStudyShell from '../../components/CaseStudyShell'
import { caseStudies } from '../../data/caseStudies'

export const metadata: Metadata = {
  title: 'Case studies — CF LLC',
  description: 'What CF LLC has built and runs itself: SaaS Nation, SpockShop, Satoshi’s Path and OpenClaw. Real numbers only, added as they come in.',
}

export default function CaseStudies() {
  return (
    <CaseStudyShell>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Case studies</h1>
      <p className="mt-3 max-w-2xl text-white/75">Products we built and run ourselves. Every number links to where you can check it; anything we can’t show yet is marked “to be added”.</p>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {caseStudies.map((c) => (
          <li key={c.slug}>
            <a href={`/case-studies/${c.slug}`} className="block h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/30">
              <span aria-hidden className="mb-4 block h-1 w-12 rounded" style={{ background: c.accent }} />
              <h2 className="text-xl font-bold text-white">{c.name}</h2>
              <p className="mt-1 text-sm text-white/70">{c.tagline}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-white underline underline-offset-4">Read the case study</span>
            </a>
          </li>
        ))}
      </ul>
    </CaseStudyShell>
  )
}
