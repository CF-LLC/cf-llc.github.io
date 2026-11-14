import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseStudyShell from '../../../components/CaseStudyShell'
import { CHECKED_ON, caseStudies, getCaseStudy } from '../../../data/caseStudies'

export const dynamicParams = false
export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCaseStudy((await params).slug)
  if (!c) return {}
  return { title: `${c.name} case study — CF LLC`, description: `${c.name}: ${c.tagline}. What we built, the stack, and real numbers as they come in.` }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCaseStudy((await params).slug)
  if (!c) notFound()
  const external = c.url.startsWith('http')
  return (
    <CaseStudyShell>
      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/60"><a href="/case-studies" className="hover:text-white">Case studies</a> / {c.name}</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{c.name}</h1>
      <p className="mt-2 text-lg" style={{ color: c.accent }}>{c.tagline}</p>
      <p className="mt-4 text-white/80">{c.summary}</p>
      <a href={c.url} {...(external ? { target: '_blank', rel: 'noopener' } : {})} className="mt-5 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">{external ? `Visit ${c.name}` : 'Get a free mockup'}</a>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-bold text-white">The problem</h2>
        <p className="text-white/80">{c.problem}</p>
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-2xl font-bold text-white">What we built</h2>
        <ul className="list-disc space-y-2 pl-5 text-white/80">{c.built.map((b) => <li key={b}>{b}</li>)}</ul>
        <p className="text-sm text-white/60">Stack: {c.stack.join(' · ')}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white">Numbers</h2>
        <p className="mt-1 text-sm text-white/60">Checked {CHECKED_ON}. We only publish numbers you can verify; the rest will be added as they come in.</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2" data-metrics>
          {c.metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <dt className="text-xs uppercase tracking-wider text-white/60">{m.label}</dt>
              {m.value ? (
                <dd className="mt-1 text-xl font-bold text-white">{m.value}{m.source ? <a href={m.source} target="_blank" rel="noopener" className="ml-2 align-middle text-xs font-normal text-white/60 underline">source</a> : null}</dd>
              ) : (
                <dd className="mt-1 text-sm italic text-white/50" data-tbd>To be added</dd>
              )}
            </div>
          ))}
        </dl>
      </section>
      <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold text-white">Want something like this for your business?</h2>
        <p className="mt-2 text-white/75">Start with a free homepage mockup. No commitment.</p>
        <a href="/#mockup" className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">Get a free mockup</a>
      </section>
    </CaseStudyShell>
  )
}
