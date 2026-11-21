import type { Metadata } from 'next'
import { pageSeo } from '@/lib/seo'
import QuoteQuiz from '@/components/QuoteQuiz'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = pageSeo('/quote', 'Get a quote in 60 seconds — CF LLC', 'Answer a few questions and I will recommend Starter Site ($499 setup + $39/mo), Pro Site ($1,200 + $59/mo), or Site Care ($49/mo). Then send me the request.')

export default function QuotePage() {
  return (

    <div className="site-shell min-h-screen bg-[#070708] text-[#eceae4]">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <a href="/" className="text-sm font-semibold tracking-[0.18em] text-white">CF LLC</a>
        <nav aria-label="Main" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          <a href="/#packages" className="hover:text-white">Packages</a>
          <a href="/quote" className="font-semibold text-white underline underline-offset-4" aria-current="page">Get a quote</a>
          <a href="/nwa" className="hover:text-white">Bentonville &amp; NWA</a>
          <a href="/sample-homepages" className="hover:text-white">Sample homepages</a>
          <a href="/case-studies" className="hover:text-white">Case studies</a>
          <a href="/ecosystem" className="hover:text-white">Ecosystem</a>
          <a href="/#mockup" className="hover:text-white">Free mockup</a>
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        <p className="kicker">About a minute</p>
        <h1 className="display-title mt-4 text-4xl text-white sm:text-5xl">Get a quote in 60 seconds</h1>
        <p className="mt-4 max-w-2xl leading-7 text-white/80">
          Four short questions. I&apos;ll recommend Starter Site ($499 setup + $39/mo), Pro Site ($1,200 setup + $59/mo), or Site Care ($49/mo) — the same packages as on the home page — and you can send me the request.
        </p>
        <div className="mt-10">
          <QuoteQuiz />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
