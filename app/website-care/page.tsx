import type { Metadata } from 'next'
import { Activity, BarChart3, Database, Mail, Pencil, ShieldCheck, Check } from 'lucide-react'
import { pageSeo } from '@/lib/seo'
import { CARE_PLAN, careFaqs, careIncludes } from '@/data/carePlan'
import MockupForm from '@/components/MockupForm'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = pageSeo(
  '/website-care',
  'Website Care Plan — $99/month — CF LLC',
  'Hosting and uptime monitoring, security and plugin updates, monthly backups, up to 1 hour of edits, a monthly health report and fast email support. $99/month, cancel anytime.',
)

const icons = {
  activity: Activity,
  shield: ShieldCheck,
  database: Database,
  pencil: Pencil,
  chart: BarChart3,
  mail: Mail,
} as const

export default function WebsiteCarePage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Website Care Plan',
    provider: { '@type': 'LocalBusiness', name: 'CF LLC', areaServed: 'US', address: { '@type': 'PostalAddress', addressLocality: 'Bentonville', addressRegion: 'AR', addressCountry: 'US' } },
    description: 'Monthly website care: uptime monitoring, security and plugin updates, backups, up to 1 hour of content edits, a monthly health report and email support.',
    offers: { '@type': 'Offer', price: '99', priceCurrency: 'USD', priceSpecification: { '@type': 'UnitPriceSpecification', price: '99', priceCurrency: 'USD', billingDuration: 1, unitCode: 'MON' } },
  }
  return (
    <div className="site-shell min-h-screen bg-[#070708] text-[#eceae4]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <a href="/" className="text-sm font-semibold tracking-[0.18em] text-white">CF LLC</a>
        <nav aria-label="Main" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          <a href="/#packages" className="hover:text-white">Packages</a>
          <a href="/website-care" className="font-semibold text-white underline underline-offset-4" aria-current="page">Care Plan</a>
          <a href="/quote" className="hover:text-white">Get a quote</a>
          <a href="/nwa" className="hover:text-white">Bentonville &amp; NWA</a>
          <a href="/case-studies" className="hover:text-white">Case studies</a>
          <a href="/#mockup" className="hover:text-white">Free mockup</a>
        </nav>
      </header>

      <main id="main">
        <section className="relative overflow-hidden border-b border-white/10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 80% at 85% 0%, rgba(74,168,184,0.22), transparent 60%), radial-gradient(50% 70% at 0% 100%, rgba(196,59,114,0.16), transparent 60%)' }} />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="kicker">Monthly website care</p>
              <h1 className="display-title mt-4 text-5xl text-white sm:text-7xl">Website Care Plan<span className="block text-[#8fd3de]">$99/month</span></h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
                {CARE_PLAN.tagline} I keep your site fast, secure, backed up and current, so you can run your business instead of worrying about it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#start" className="rounded-md bg-[#eceae4] px-6 py-3 font-semibold text-[#070708] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#4aa8b8] focus:ring-offset-2 focus:ring-offset-[#070708]">Get the Care Plan →</a>
                <a href="#included" className="rounded-md border border-white/30 px-6 py-3 font-semibold text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-[#4aa8b8]">See what&apos;s included</a>
              </div>
              <p className="mt-4 text-sm text-white/70">No contract. Cancel anytime.</p>
            </div>
            <aside aria-label="Plan summary" className="rounded-2xl border border-[#4aa8b8]/60 bg-[#4aa8b8]/10 p-7 shadow-[0_0_80px_-20px_rgba(74,168,184,0.5)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8fd3de]">One simple plan</p>
              <p className="mt-3"><span className="text-6xl font-semibold text-white">{CARE_PLAN.price}</span> <span className="text-white/80">/ month</span></p>
              <ul className="mt-5 space-y-2.5 text-white/90">
                {['Uptime monitoring', 'Security & plugin updates', 'Monthly backups', 'Up to 1 hour of edits', 'Monthly health report', 'Fast email support'].map((t) => (
                  <li key={t} className="flex gap-2.5"><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#8fd3de]" /><span>{t}</span></li>
                ))}
              </ul>
              <a href="#start" className="mt-6 block rounded-md bg-[#eceae4] px-5 py-3 text-center font-semibold text-[#070708] hover:bg-white">Start with a quick inquiry</a>
              <p className="mt-3 text-center text-xs text-white/70">I reply by email, check your site, then set you up.</p>
            </aside>
          </div>
        </section>

        <section id="included" aria-labelledby="included-title" className="scroll-mt-6 mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <p className="kicker">What&apos;s included</p>
          <h2 id="included-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Everything your site needs, every month</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {careIncludes.map((c) => {
              const Icon = icons[c.icon]
              return (
                <li key={c.title} className="rounded-xl border border-white/15 bg-white/[0.03] p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#4aa8b8]/15 text-[#8fd3de]"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                  <h3 className="mt-4 text-2xl text-white">{c.title}</h3>
                  <p className="mt-2 leading-7 text-white/80">{c.body}</p>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="how-title" className="border-y border-white/10 bg-[#0b0a12]/85">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <p className="kicker">How it works</p>
            <h2 id="how-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Send a note, I take it from there</h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { t: 'Tell me about your site', b: 'Send your business name and website address using the form below.' },
                { t: 'I take a look', b: 'I check your site and reply by email to confirm it is a fit and what I would handle first.' },
                { t: 'We get started', b: 'Your monitoring, backups and updates begin, and your first health report arrives the next month.' },
              ].map((s, i) => (
                <li key={s.t} className="rounded-lg border border-white/15 p-6">
                  <p className="text-sm font-semibold text-[#8fd3de]">Step {i + 1}</p>
                  <h3 className="mt-2 text-2xl text-white">{s.t}</h3>
                  <p className="mt-3 leading-7 text-white/80">{s.b}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-white/75">Need a new site first? See the <a href="/#packages" className="underline">Starter and Pro packages</a>, or get a <a href="/#mockup" className="underline">free homepage mockup</a>. Want a lighter option? <a href="/#packages" className="underline">Site Care is $49/month</a>.</p>
          </div>
        </section>

        <section id="start" aria-labelledby="start-title" className="scroll-mt-6">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
            <div>
              <p className="kicker">Get started</p>
              <h2 id="start-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Ask about the Care Plan</h2>
              <p className="mt-4 leading-7 text-white/80">Tell me about your business and the site you want looked after. I&apos;ll email you back, usually within one business day. There&apos;s no payment on this page and nothing to commit to yet.</p>
              <p className="mt-4 text-sm text-white/70">CF LLC · Bentonville, Arkansas · working remotely with small businesses across the US.</p>
            </div>
            <MockupForm defaultInterest="care-plan" />
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-6 border-t border-white/10 bg-[#0b0a12]/85">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
            <p className="kicker">FAQ</p>
            <h2 id="faq-title" className="display-title mt-4 text-4xl text-white sm:text-5xl">Care Plan questions</h2>
            <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
              {careFaqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="cursor-pointer text-lg font-semibold text-white">{f.q}</summary>
                  <p className="mt-3 leading-7 text-white/80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
